// Admin Team Creation Edge Function
// Requires Service Role key to create auth users

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 })
  }

  try {
    // Create Supabase client with Service Role key (has admin privileges)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Verify the request is from an admin
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Check if user is admin
    const { data: isAdmin, error: adminError } = await supabaseAdmin
      .rpc('is_admin')

    if (adminError || !isAdmin) {
      throw new Error('Not an admin')
    }

    // Get request body
    const { teamId, teamName, password, climber1, climber2, category } = await req.json()

    // Validate inputs
    if (!teamId || !teamName || !password || !climber1 || !climber2) {
      throw new Error('Missing required fields')
    }

    // Validate team ID uniqueness
    const { data: existingTeam } = await supabaseAdmin
      .from('teams')
      .select('team_id')
      .eq('team_id', teamId)
      .single()

    if (existingTeam) {
      throw new Error(`Team ID "${teamId}" already exists`)
    }

    // Create auth user
    const email = `${teamId}@quarrymadness.local`
    const { data: authData, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        team_id: teamId,
        is_team: true
      }
    })

    if (createUserError) {
      throw new Error('Failed to create auth user: ' + createUserError.message)
    }

    const authUserId = authData.user.id

    // Create team record
    const { data: teamData, error: teamError } = await supabaseAdmin
      .from('teams')
      .insert({
        team_id: teamId,
        team_name: teamName,
        category,
        auth_user_id: authUserId
      })
      .select()
      .single()

    if (teamError) {
      // Cleanup: delete auth user if team creation fails
      await supabaseAdmin.auth.admin.deleteUser(authUserId)
      throw new Error('Failed to create team record: ' + teamError.message)
    }

    // Create climber records
    const climberInserts = [
      {
        team_id: teamData.id,
        name: climber1.name,
        age: climber1.age,
        self_reported_grade: climber1.grade,
        climber_number: 1
      },
      {
        team_id: teamData.id,
        name: climber2.name,
        age: climber2.age,
        self_reported_grade: climber2.grade,
        climber_number: 2
      }
    ]

    const { error: climbersError } = await supabaseAdmin
      .from('climbers')
      .insert(climberInserts)

    if (climbersError) {
      // Cleanup: delete team and auth user if climber creation fails
      await supabaseAdmin.from('teams').delete().eq('id', teamData.id)
      await supabaseAdmin.auth.admin.deleteUser(authUserId)
      throw new Error('Failed to create climbers: ' + climbersError.message)
    }

    // Log admin action
    await supabaseAdmin
      .from('admin_actions')
      .insert({
        admin_user_id: user.id,
        action_type: 'create_team',
        target_id: teamId,
        details: {
          team_name: teamName,
          category,
          climbers: [climber1.name, climber2.name]
        }
      })

    return new Response(
      JSON.stringify({
        success: true,
        team: teamData,
        credentials: {
          team_id: teamId,
          email,
          password
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
