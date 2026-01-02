/**
 * Test fixtures for Rick and Morty characters
 * Reusable mock data for tests
 */

export const mockCharacters = {
  rick: {
    id: 1,
    name: 'Rick Sanchez',
    image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    species: 'Human',
    status: 'Alive',
    gender: 'Male',
  },
  morty: {
    id: 2,
    name: 'Morty Smith',
    image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
    species: 'Human',
    status: 'Alive',
    gender: 'Male',
  },
  summerSmith: {
    id: 3,
    name: 'Summer Smith',
    image: 'https://rickandmortyapi.com/api/character/avatar/3.jpeg',
    species: 'Human',
    status: 'Alive',
    gender: 'Female',
  },
  birdPerson: {
    id: 47,
    name: 'Birdperson',
    image: 'https://rickandmortyapi.com/api/character/avatar/47.jpeg',
    species: 'Alien',
    status: 'Dead',
    gender: 'Male',
  },
}

/**
 * Create a GraphQL response for the GetCharacters query
 */
export function createCharactersResponse(characters: typeof mockCharacters[keyof typeof mockCharacters][]) {
  return {
    characters: {
      results: characters,
    },
  }
}

/**
 * Create an empty GraphQL response (no results)
 */
export const emptyCharactersResponse = {
  characters: {
    results: [],
  },
}
