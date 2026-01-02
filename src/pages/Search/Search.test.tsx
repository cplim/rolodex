import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../test/test-utils'
import Search from './Search'
import { TEST_IDS } from '../../test/test-ids'
import { server } from '../../test/mocks/server'
import { graphql, HttpResponse } from 'msw'
import { mockCharacters } from '../../test/mocks/fixtures'

describe('Search Component', () => {
  beforeEach(() => {
    server.resetHandlers()
  })

  describe('Null Character Handling', () => {
    it('filters out null characters and displays only valid ones', async () => {
      // Mock API returning mix of valid and null characters
      server.use(
        graphql.query('GetCharacters', () => {
          return HttpResponse.json({
            data: {
              characters: {
                results: [
                  mockCharacters.rick,
                  null, // This should be filtered out
                  mockCharacters.morty,
                  null, // This should be filtered out
                ],
              },
            },
          })
        })
      )

      render(<Search />, { withRouter: true, withApollo: true, initialRoute: '/?q=test' })

      await waitFor(() => {
        expect(screen.queryByTestId(TEST_IDS.SEARCH_LOADING)).not.toBeInTheDocument()
      })

      // Should only render 2 cards (Rick and Morty), nulls filtered out
      const cards = screen.getAllByTestId(TEST_IDS.CHARACTER_CARD)
      expect(cards).toHaveLength(2)

      expect(screen.getByRole('heading', { name: 'Rick Sanchez' })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Morty Smith' })).toBeInTheDocument()
    })

    it('shows empty state when all characters are null', async () => {
      // Mock API returning only null characters
      server.use(
        graphql.query('GetCharacters', () => {
          return HttpResponse.json({
            data: {
              characters: {
                results: [null, null, null],
              },
            },
          })
        })
      )

      render(<Search />, { withRouter: true, withApollo: true, initialRoute: '/?q=test' })

      await waitFor(() => {
        expect(screen.queryByTestId(TEST_IDS.SEARCH_LOADING)).not.toBeInTheDocument()
      })

      // Should show empty state, not render any cards
      expect(screen.getByTestId(TEST_IDS.SEARCH_EMPTY)).toBeInTheDocument()
      expect(screen.getByText('No characters found')).toBeInTheDocument()
      expect(screen.queryByTestId(TEST_IDS.CHARACTER_CARD)).not.toBeInTheDocument()
    })

    it('shows empty state when results array is empty', async () => {
      server.use(
        graphql.query('GetCharacters', () => {
          return HttpResponse.json({
            data: {
              characters: {
                results: [],
              },
            },
          })
        })
      )

      render(<Search />, { withRouter: true, withApollo: true, initialRoute: '/?q=unknown' })

      await waitFor(() => {
        expect(screen.queryByTestId(TEST_IDS.SEARCH_LOADING)).not.toBeInTheDocument()
      })

      expect(screen.getByTestId(TEST_IDS.SEARCH_EMPTY)).toBeInTheDocument()
      expect(screen.getByText('No characters found')).toBeInTheDocument()
    })

    it('handles characters with null name/image fields gracefully', async () => {
      // Mock API returning character with null fields (but not null object)
      server.use(
        graphql.query('GetCharacters', () => {
          return HttpResponse.json({
            data: {
              characters: {
                results: [
                  {
                    id: 999,
                    name: null,
                    image: null,
                    species: 'Human',
                    status: 'Alive',
                    gender: 'Male',
                  },
                ],
              },
            },
          })
        })
      )

      render(<Search />, { withRouter: true, withApollo: true, initialRoute: '/?q=test' })

      await waitFor(() => {
        expect(screen.queryByTestId(TEST_IDS.SEARCH_LOADING)).not.toBeInTheDocument()
      })

      // Character should render with fallback values
      expect(screen.getByRole('heading', { name: 'Unknown Character' })).toBeInTheDocument()
      expect(screen.getByAltText('Unknown Character character')).toBeInTheDocument()

      // Other fields should still display
      expect(screen.getByText('Human')).toBeInTheDocument()
      expect(screen.getByText('Alive')).toBeInTheDocument()
    })
  })

  describe('Loading and Error States', () => {
    it('displays loading state initially', () => {
      render(<Search />, { withRouter: true, withApollo: true, initialRoute: '/?q=rick' })

      expect(screen.getByTestId(TEST_IDS.SEARCH_LOADING)).toBeInTheDocument()
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('displays error state on GraphQL error', async () => {
      server.use(
        graphql.query('GetCharacters', () => {
          return HttpResponse.json({
            errors: [{ message: 'GraphQL Error' }],
          })
        })
      )

      render(<Search />, { withRouter: true, withApollo: true, initialRoute: '/?q=rick' })

      await waitFor(() => {
        expect(screen.queryByTestId(TEST_IDS.SEARCH_LOADING)).not.toBeInTheDocument()
      })

      expect(screen.getByTestId(TEST_IDS.SEARCH_ERROR)).toBeInTheDocument()
      expect(screen.getByText('Error :(')).toBeInTheDocument()
    })

    it('displays error state on network error', async () => {
      server.use(
        graphql.query('GetCharacters', () => {
          return HttpResponse.error()
        })
      )

      render(<Search />, { withRouter: true, withApollo: true, initialRoute: '/?q=rick' })

      await waitFor(() => {
        expect(screen.queryByTestId(TEST_IDS.SEARCH_LOADING)).not.toBeInTheDocument()
      })

      expect(screen.getByTestId(TEST_IDS.SEARCH_ERROR)).toBeInTheDocument()
    })
  })

  describe('Valid Data Display', () => {
    it('displays valid characters correctly', async () => {
      server.use(
        graphql.query('GetCharacters', () => {
          return HttpResponse.json({
            data: {
              characters: {
                results: [mockCharacters.rick, mockCharacters.morty],
              },
            },
          })
        })
      )

      render(<Search />, { withRouter: true, withApollo: true, initialRoute: '/?q=rick' })

      await waitFor(() => {
        expect(screen.queryByTestId(TEST_IDS.SEARCH_LOADING)).not.toBeInTheDocument()
      })

      const cards = screen.getAllByTestId(TEST_IDS.CHARACTER_CARD)
      expect(cards).toHaveLength(2)

      expect(screen.getByRole('heading', { name: 'Rick Sanchez' })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Morty Smith' })).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles undefined data object as error', async () => {
      server.use(
        graphql.query('GetCharacters', () => {
          return HttpResponse.json({
            data: undefined,
          })
        })
      )

      render(<Search />, { withRouter: true, withApollo: true, initialRoute: '/?q=test' })

      await waitFor(() => {
        expect(screen.queryByTestId(TEST_IDS.SEARCH_LOADING)).not.toBeInTheDocument()
      })

      // Apollo treats undefined data as an error
      expect(screen.getByTestId(TEST_IDS.SEARCH_ERROR)).toBeInTheDocument()
    })

    it('handles null characters mixed with valid data', async () => {
      server.use(
        graphql.query('GetCharacters', () => {
          return HttpResponse.json({
            data: {
              characters: {
                results: [
                  null,
                  mockCharacters.rick,
                  null,
                  null,
                  mockCharacters.morty,
                  null,
                ],
              },
            },
          })
        })
      )

      render(<Search />, { withRouter: true, withApollo: true, initialRoute: '/?q=test' })

      await waitFor(() => {
        expect(screen.queryByTestId(TEST_IDS.SEARCH_LOADING)).not.toBeInTheDocument()
      })

      // Should render exactly 2 cards (nulls filtered out)
      const cards = screen.getAllByTestId(TEST_IDS.CHARACTER_CARD)
      expect(cards).toHaveLength(2)

      // Should not show empty state
      expect(screen.queryByTestId(TEST_IDS.SEARCH_EMPTY)).not.toBeInTheDocument()
    })
  })
})
