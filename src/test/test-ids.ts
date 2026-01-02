/**
 * Centralized test IDs for stable, type-safe element selection in tests
 * Use these constants in both components and tests to avoid typos
 */
export const TEST_IDS = {
  // CharacterCard component
  CHARACTER_CARD: 'character-card',
  CHARACTER_STATUS: 'character-status',

  // Search page
  SEARCH_RESULTS: 'search-results',
  SEARCH_LOADING: 'search-loading',
  SEARCH_ERROR: 'search-error',
  SEARCH_EMPTY: 'search-empty',
} as const

export type TestId = typeof TEST_IDS[keyof typeof TEST_IDS]
