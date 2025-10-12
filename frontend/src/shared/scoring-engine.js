/**
 * Scoring Engine Utility
 *
 * Implements all point calculation rules for the Quarry Madness competition.
 * Based on FR-005 through FR-019 from specification.
 */

/**
 * Grade point mapping for Ewbank (sport/trad) routes
 * FR-005: Ewbank 10-14=5pts, 15-17=8pts, 18-20=12pts, 21-22=16pts, 23+=20pts
 */
const EWBANK_POINTS = {
  10: 5, 11: 5, 12: 5, 13: 5, 14: 5,
  15: 8, 16: 8, 17: 8,
  18: 12, 19: 12, 20: 12,
  21: 16, 22: 16,
  // 23+ all get 20 points
}

/**
 * Grade point mapping for V-grade (boulder) routes
 * FR-005: V0-V2=8pts, V3-V4=16pts, V5+=20pts
 */
const V_GRADE_POINTS = {
  0: 8, 1: 8, 2: 8,
  3: 16, 4: 16,
  // V5+ all get 20 points
}

/**
 * Tick multipliers for multiple ticks of same route
 * Updated for Sprint 1: 1st=100%, 2nd=75%, 3rd=50%, 4th=25%, 5th+=0%
 */
const TICK_MULTIPLIERS = [1.0, 0.75, 0.50, 0.25, 0]

/**
 * Calculate base points for a route based on grade and gear type
 * @param {number} grade - Route grade (Ewbank 10-35 or V-grade 0-20)
 * @param {string} gearType - 'sport', 'trad', or 'boulder'
 * @returns {number} Base points
 */
export function calculateBasePoints(grade, gearType) {
  let basePoints = 0

  if (gearType === 'boulder') {
    // V-grade scoring
    if (grade >= 5) {
      basePoints = 20
    } else {
      basePoints = V_GRADE_POINTS[grade] || 0
    }
  } else {
    // Ewbank scoring (sport or trad)
    if (grade >= 23) {
      basePoints = 20
    } else {
      basePoints = EWBANK_POINTS[grade] || 0
    }

    // FR-006: Apply 50% bonus for trad routes
    if (gearType === 'trad') {
      basePoints = Math.round(basePoints * 1.5)
    }
  }

  return basePoints
}

/**
 * Get tick multiplier for a specific tick number
 * @param {number} tickNumber - Which tick this is (1-based: 1, 2, 3, 4, 5+)
 * @returns {number} Multiplier (1.00, 0.75, 0.50, 0.25, or 0.00)
 */
export function getTickMultiplier(tickNumber) {
  if (tickNumber < 1) return 0

  // 5th+ tick gets 0 points
  const multiplierIndex = Math.min(tickNumber - 1, TICK_MULTIPLIERS.length - 1)
  return TICK_MULTIPLIERS[multiplierIndex]
}

/**
 * Calculate points for a single tick of a route
 * @param {number} routeBasePoints - Manually set base points for this route
 * @param {number} tickNumber - Which tick this is (1-based: 1, 2, 3, 4, 5+)
 * @param {boolean} isTrad - Whether this is a trad route (for 50% bonus)
 * @returns {number} Points for this tick
 */
export function calculateTickPoints(routeBasePoints, tickNumber, isTrad = false) {
  if (routeBasePoints === 0) return 0 // Zero-point navigation routes
  if (tickNumber < 1) return 0
  if (tickNumber > 4) return 0 // 5th+ tick scores 0

  const tickMultiplier = getTickMultiplier(tickNumber)
  let points = routeBasePoints * tickMultiplier

  // Apply trad bonus to this tick
  if (isTrad) {
    points = points * 1.5 // 50% bonus
  }

  return Math.round(points)
}

/**
 * Calculate points for an ascent considering repeat penalties
 * @param {number} basePoints - Base points for the route
 * @param {number} attemptNumber - Which attempt this is (1-based: 1, 2, 3, 4+)
 * @returns {number} Points after repeat penalty
 * @deprecated Use calculateTickPoints instead for new tick-based system
 */
export function calculateAscentPoints(basePoints, attemptNumber) {
  if (attemptNumber < 1) return 0

  // Use new tick multipliers
  const penaltyIndex = Math.min(attemptNumber - 1, TICK_MULTIPLIERS.length - 1)
  const multiplier = TICK_MULTIPLIERS[penaltyIndex]

  return Math.round(basePoints * multiplier)
}

/**
 * Calculate total points for a climber's ascents
 * @param {Array<Object>} ascents - Array of ascent objects with route info and attempt number
 * @returns {number} Total points
 */
export function calculateClimberTotal(ascents) {
  return ascents.reduce((total, ascent) => {
    const basePoints = calculateBasePoints(ascent.grade, ascent.gearType)
    const ascentPoints = calculateAscentPoints(basePoints, ascent.attemptNumber)
    return total + ascentPoints
  }, 0)
}

/**
 * Calculate team score from both climbers' scores
 * FR-011: Team score is sum of both climbers' individual points
 * @param {number} climber1Points - First climber's total points
 * @param {number} climber2Points - Second climber's total points
 * @returns {number} Team total
 */
export function calculateTeamScore(climber1Points, climber2Points) {
  return climber1Points + climber2Points
}

/**
 * Determine if ascent is within scoring window
 * FR-009: Prevent submissions outside scoring window
 * @param {Date} ascentTime - When the ascent was logged
 * @param {Date} windowStart - Scoring window start time
 * @param {Date} windowEnd - Scoring window end time
 * @returns {boolean} True if within window
 */
export function isWithinScoringWindow(ascentTime, windowStart, windowEnd) {
  const time = new Date(ascentTime).getTime()
  const start = new Date(windowStart).getTime()
  const end = new Date(windowEnd).getTime()

  return time >= start && time <= end
}

/**
 * Get attempt number for a route by a climber
 * @param {Array<Object>} previousAscents - Previous ascents of this route by this climber
 * @returns {number} Attempt number (1-based)
 */
export function getAttemptNumber(previousAscents) {
  return previousAscents.length + 1
}

/**
 * Calculate bonus game points
 * FR-017, FR-018: Bonus points are awarded once per climber per game
 * @param {Array<Object>} bonusEntries - Array of bonus game entries for a climber
 * @param {number} pointsPerGame - Points awarded per bonus game
 * @returns {number} Total bonus points
 */
export function calculateBonusPoints(bonusEntries, pointsPerGame = 10) {
  // Each unique bonus game counts once
  const uniqueGames = new Set(bonusEntries.map(entry => entry.bonusGameId))
  return uniqueGames.size * pointsPerGame
}

/**
 * Find hardest send for tiebreaker
 * FR-016: Hardest send award winner is climber with highest-graded route,
 * using number of ascents at that grade as tiebreaker
 * @param {Array<Object>} ascents - All ascents by a climber
 * @returns {Object} { grade, count } - Hardest grade and number of ascents at that grade
 */
export function findHardestSend(ascents) {
  if (!ascents || ascents.length === 0) {
    return { grade: 0, count: 0 }
  }

  // Group ascents by grade
  const gradeGroups = ascents.reduce((groups, ascent) => {
    const grade = ascent.grade
    if (!groups[grade]) {
      groups[grade] = []
    }
    groups[grade].push(ascent)
    return groups
  }, {})

  // Find highest grade
  const grades = Object.keys(gradeGroups).map(Number)
  const hardestGrade = Math.max(...grades)

  return {
    grade: hardestGrade,
    count: gradeGroups[hardestGrade].length
  }
}

/**
 * Compare two climbers for hardest send tiebreaker
 * @param {Object} climber1 - { grade, count }
 * @param {Object} climber2 - { grade, count }
 * @returns {number} -1 if climber1 wins, 1 if climber2 wins, 0 if tied
 */
export function compareHardestSends(climber1, climber2) {
  // First compare grade
  if (climber1.grade > climber2.grade) return -1
  if (climber1.grade < climber2.grade) return 1

  // If grades are equal, compare count
  if (climber1.count > climber2.count) return -1
  if (climber1.count < climber2.count) return 1

  // Complete tie
  return 0
}

/**
 * Validate route grade is within valid range
 * @param {number} grade - Route grade
 * @param {string} gearType - 'sport', 'trad', or 'boulder'
 * @returns {boolean} True if valid
 */
export function isValidGrade(grade, gearType) {
  if (gearType === 'boulder') {
    return grade >= 0 && grade <= 20
  } else {
    return grade >= 10 && grade <= 35
  }
}

/**
 * Format points for display
 * @param {number} points - Point value
 * @returns {string} Formatted string (e.g., "125 pts")
 */
export function formatPoints(points) {
  return `${points} pts`
}

/**
 * Get grade display name
 * @param {number} grade - Route grade
 * @param {string} gearType - 'sport', 'trad', or 'boulder'
 * @returns {string} Display name (e.g., "V5", "23")
 */
export function formatGrade(grade, gearType) {
  if (gearType === 'boulder') {
    return `V${grade}`
  } else {
    return `${grade}`
  }
}

export default {
  calculateBasePoints,
  calculateAscentPoints,
  calculateTickPoints,
  getTickMultiplier,
  calculateClimberTotal,
  calculateTeamScore,
  isWithinScoringWindow,
  getAttemptNumber,
  calculateBonusPoints,
  findHardestSend,
  compareHardestSends,
  isValidGrade,
  formatPoints,
  formatGrade,
}
