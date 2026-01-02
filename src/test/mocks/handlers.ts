import { graphql, HttpResponse } from 'msw'
import { createCharactersResponse, mockCharacters } from './fixtures'

/**
 * MSW handlers for Rick and Morty GraphQL API
 * These handlers intercept network requests during tests
 */

const GRAPHQL_ENDPOINT = 'https://rickandmortyapi.com/graphql'

export const handlers = [
  // Default handler for GetCharacters query
  graphql.query('GetCharacters', ({ query, variables }) => {
    const { search } = variables as { search: string; page: number }

    // Return Rick when searching for "rick"
    if (search.toLowerCase().includes('rick')) {
      return HttpResponse.json({
        data: createCharactersResponse([mockCharacters.rick]),
      })
    }

    // Return Morty when searching for "morty"
    if (search.toLowerCase().includes('morty')) {
      return HttpResponse.json({
        data: createCharactersResponse([mockCharacters.morty]),
      })
    }

    // Return multiple characters for generic searches
    if (search.toLowerCase() === 'smith') {
      return HttpResponse.json({
        data: createCharactersResponse([
          mockCharacters.morty,
          mockCharacters.summerSmith,
        ]),
      })
    }

    // Return empty results for unknown searches
    return HttpResponse.json({
      data: {
        characters: {
          results: [],
        },
      },
    })
  }),
]

/**
 * Error handlers for testing error states
 */
export const errorHandlers = [
  graphql.query('GetCharacters', () => {
    return HttpResponse.json({
      errors: [
        {
          message: 'GraphQL Error: Failed to fetch characters',
        },
      ],
    })
  }),
]

/**
 * Network error handlers for testing network failures
 */
export const networkErrorHandlers = [
  graphql.query('GetCharacters', () => {
    return HttpResponse.error()
  }),
]
