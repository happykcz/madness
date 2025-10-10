/**
 * Category Classifier Utility
 *
 * Implements team and climber categorization logic per FR-019 and FR-020.
 * Categories determine which leaderboards teams and climbers appear on.
 */

/**
 * Climber categories based on redpoint grade
 * FR-020: Recreational (up to 19), Intermediate (20-23), Advanced (24+)
 */
export const CLIMBER_CATEGORIES = {
  RECREATIONAL: 'recreational',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
}

/**
 * Team categories
 * FR-019: Masters, Recreational, Intermediate, Advanced
 */
export const TEAM_CATEGORIES = {
  MASTERS: 'masters',
  RECREATIONAL: 'recreational',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
}

/**
 * Classify individual climber category based on redpoint grade
 * FR-020: Recreational up to 19, Intermediate 20-23, Advanced 24+
 * @param {number} redpointGrade - Climber's hardest redpoint grade (Ewbank)
 * @returns {string} Category name
 */
export function classifyClimber(redpointGrade) {
  if (redpointGrade >= 24) {
    return CLIMBER_CATEGORIES.ADVANCED
  } else if (redpointGrade >= 20) {
    return CLIMBER_CATEGORIES.INTERMEDIATE
  } else {
    return CLIMBER_CATEGORIES.RECREATIONAL
  }
}

/**
 * Classify team category based on both climbers
 * FR-019: Masters if any climber is over 50 (or both over 45),
 * otherwise by stronger climber's grade
 * @param {Object} climber1 - { age, redpointGrade }
 * @param {Object} climber2 - { age, redpointGrade }
 * @returns {string} Team category
 */
export function classifyTeam(climber1, climber2) {
  const { age: age1, redpointGrade: grade1 } = climber1
  const { age: age2, redpointGrade: grade2 } = climber2

  // Masters category: any climber over 50, or both over 45
  if (age1 > 50 || age2 > 50) {
    return TEAM_CATEGORIES.MASTERS
  }

  if (age1 > 45 && age2 > 45) {
    return TEAM_CATEGORIES.MASTERS
  }

  // Otherwise, categorize by stronger climber (higher redpoint grade)
  const strongerGrade = Math.max(grade1, grade2)

  if (strongerGrade >= 24) {
    return TEAM_CATEGORIES.ADVANCED
  } else if (strongerGrade >= 20) {
    return TEAM_CATEGORIES.INTERMEDIATE
  } else {
    return TEAM_CATEGORIES.RECREATIONAL
  }
}

/**
 * Get category display name
 * @param {string} category - Category identifier
 * @returns {string} Display name
 */
export function getCategoryDisplayName(category) {
  const names = {
    'masters': 'Masters',
    'recreational': 'Recreational',
    'intermediate': 'Intermediate',
    'advanced': 'Advanced',
  }
  return names[category] || category
}

/**
 * Get category description
 * @param {string} category - Category identifier
 * @param {boolean} isTeam - True for team category, false for climber
 * @returns {string} Description
 */
export function getCategoryDescription(category, isTeam = false) {
  if (isTeam) {
    const descriptions = {
      'masters': 'Any climber over 50, or both over 45',
      'recreational': 'Strongest climber redpoints up to 19',
      'intermediate': 'Strongest climber redpoints 20-23',
      'advanced': 'Strongest climber redpoints 24+',
    }
    return descriptions[category] || ''
  } else {
    const descriptions = {
      'recreational': 'Redpoint grade up to 19',
      'intermediate': 'Redpoint grade 20-23',
      'advanced': 'Redpoint grade 24+',
    }
    return descriptions[category] || ''
  }
}

/**
 * Validate climber category assignment
 * @param {number} redpointGrade - Climber's redpoint grade
 * @param {string} category - Assigned category
 * @returns {boolean} True if category matches grade
 */
export function validateClimberCategory(redpointGrade, category) {
  const expectedCategory = classifyClimber(redpointGrade)
  return expectedCategory === category
}

/**
 * Validate team category assignment
 * @param {Object} climber1 - { age, redpointGrade }
 * @param {Object} climber2 - { age, redpointGrade }
 * @param {string} category - Assigned category
 * @returns {boolean} True if category matches climbers
 */
export function validateTeamCategory(climber1, climber2, category) {
  const expectedCategory = classifyTeam(climber1, climber2)
  return expectedCategory === category
}

/**
 * Get all categories for leaderboard display
 * @param {boolean} isTeam - True for team categories, false for climber
 * @returns {Array<Object>} Array of { id, name, description }
 */
export function getAllCategories(isTeam = false) {
  if (isTeam) {
    return [
      {
        id: TEAM_CATEGORIES.MASTERS,
        name: getCategoryDisplayName(TEAM_CATEGORIES.MASTERS),
        description: getCategoryDescription(TEAM_CATEGORIES.MASTERS, true),
      },
      {
        id: TEAM_CATEGORIES.ADVANCED,
        name: getCategoryDisplayName(TEAM_CATEGORIES.ADVANCED),
        description: getCategoryDescription(TEAM_CATEGORIES.ADVANCED, true),
      },
      {
        id: TEAM_CATEGORIES.INTERMEDIATE,
        name: getCategoryDisplayName(TEAM_CATEGORIES.INTERMEDIATE),
        description: getCategoryDescription(TEAM_CATEGORIES.INTERMEDIATE, true),
      },
      {
        id: TEAM_CATEGORIES.RECREATIONAL,
        name: getCategoryDisplayName(TEAM_CATEGORIES.RECREATIONAL),
        description: getCategoryDescription(TEAM_CATEGORIES.RECREATIONAL, true),
      },
    ]
  } else {
    return [
      {
        id: CLIMBER_CATEGORIES.ADVANCED,
        name: getCategoryDisplayName(CLIMBER_CATEGORIES.ADVANCED),
        description: getCategoryDescription(CLIMBER_CATEGORIES.ADVANCED, false),
      },
      {
        id: CLIMBER_CATEGORIES.INTERMEDIATE,
        name: getCategoryDisplayName(CLIMBER_CATEGORIES.INTERMEDIATE),
        description: getCategoryDescription(CLIMBER_CATEGORIES.INTERMEDIATE, false),
      },
      {
        id: CLIMBER_CATEGORIES.RECREATIONAL,
        name: getCategoryDisplayName(CLIMBER_CATEGORIES.RECREATIONAL),
        description: getCategoryDescription(CLIMBER_CATEGORIES.RECREATIONAL, false),
      },
    ]
  }
}

export default {
  CLIMBER_CATEGORIES,
  TEAM_CATEGORIES,
  classifyClimber,
  classifyTeam,
  getCategoryDisplayName,
  getCategoryDescription,
  validateClimberCategory,
  validateTeamCategory,
  getAllCategories,
}
