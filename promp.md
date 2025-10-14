sounds good, my comments and answers 

## ui/ux design
- pls change the apps backgourn from #fafbfc to soemthing more mathing the themes primary colour, like very light ping or so? 
- pls don't use the blue colour you have in some of the buttons/badges/links in the admin dashboard. use secondary/tertiary instead

## team creation
I will create all teams manually for now following the instructions. Its' a bit teadious but i should have only about 15 teams, so it should be fine. 
I will probably make some extra fake teams just in case in need extra on the day for late signups. Because of this, I need to have option to change teams name, category, and all members details (names, cateogry, ages, etc). I don't need to change the team id or passwords.

## team/climber categories
Climbers can register in three categories based on their hardest redpoint on the rock:
- Recreational: Hardest redpoint up to grade 19
- Intermediate Usually climbs in the 20 to 23
- Advanced: Climbs grade 24+

The team category will be based on the category of the stronger/older climber in the team.
- A Masters team – at least one team member is 50+ or both team members are 45+
- A recreational team – both team members are in the recreational category
- An intermediate team – one or both members are intermediate climbers
- An advanced team – one or both members are advanced climbers

## scoring
- each route will ahve Base points by grade (for all; sport, trad and boulders) 
- there will be routes with 0 points; these are routes on which climbers are not allowed to score. I just need to keep these in so climbers can navigate themselves better on the crag. These routes could muted text or something like that. It also would be nice to have an option to hide these routes if the competiror doesn't want to see them. 
- the scorring page should display all routes in given groups, given order, and with names, grade and base points and then a score box for each climber. the box should dipslay how many attempts the climber has made in nice format like pie chart or something and total score for the route.
- we probably should have option to filter the routes by type of climbing (sport, trad, boulders), by category grade bend (recreational 19<=, intermediate 20-23, advanced 24+).
- there will be a 50% bonus for trad routes
- each route can be scored/ticked multiple times by the same climber. The first time will get 100% points, the second 75%, the third 50%, the fourth 25%, and the fift or more will get 0% points (this has been change since the last version of the app) Trad bonus still needs to apply. 
- Team scoring; score = sum of both climbers’ points.
- Games scoring; each climber can have only one score on each game. the score will be manually entered. I don't know the value min/max values for each game yet and might need an option to change it.

## answers to your questions
- there will be about 60 routes
- routes don't belong to categories. any climber can score on any route
- i think we have a little misunderstadnign about the scorign window. The competiton is officily 6am to 6pm on Saturday the 18th of october (Western Australian time). The admin should be able to set the main scorring window (the dates i mentioned above) but also have option to open the scoring window outside of these dates with a simple button to do so. The window is the same for all competitors.
- teams should not see other teams scores. they should only see their own scores. the admin dashboard should provide real-time leaderboards broken down by team categories and individual climber categories and also display a list of the hadrest sends and list of total ticks (sends) by climber and by team.

## extra functionality
- i'd like to nudge competitors with displaying a hint of the leaderboard results, like show them the leaderboard at every 3hrs or something like that.

before aplying all this, i want you to git commit accordingly 

---

Great, thx, thats solved. Let's have a look properly one where we are at. 
I think we got sidetracked in the last chats and some progress was recorded in different files. Pls check all md files in the project directory to see where we got lost. Most importantly pls check history of this chat and you'll see we started discussing sprints. I don't really mind how we call it phase/sprint, just wanna make sure we stay on the track. 

I can also confirm, that the following points are finisched:
route list with filters
climber selection
send logging with tick multipliers
visual progress indicators
delete last send fuctionality
clean SVG icons
bottom-right notificatins
team total score in header.

Lot's of stuff was done in admin panel as well. based on chat history, the original tasks.md and what you could find in the extra files, pls recap on where you think we are at and what the next steps should be - and update todo. 

fyi: i will upload teams and climbers manually - only need a template
i will upload routes manually - only need a template
i think there are some duplicate tables in the db - we've created some originaly and then added newones. I mean i don't mind having extra unused tables but assume it's better keep it clean. 

pls don't make any changes, only recap on where we are at and what the next steps should be.

---

Thanks, pls jot this down somewhere so you ahave access to this in next chats.
Pls be aware that there is a few minor discrepencies. 
The amdin interface has working list of teams, an option to view and edit team details (team name, and climbers names, ages, categories, grades) only missing an option to edit the teams category. This one is currenly autogenerated
We have aborded the password reset - it didin't work due to cors issues. The interface for craating teams was also abandoned for teh same issues and for luck of time to work on it. 
The leaderboard nudge should have a adming manual trigger as well. 
Regarding the UI polish - we'll need to reaplace leftover emojies with svg icons and fix the buttons in header as it's just get too bussy there and teh button take too much space. Maybe they could be in the dropdown menu or in subheader?

pls ensure to commit between all changes and yes, pls start with phase A.