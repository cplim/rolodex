import { render as rtlRender, RenderOptions } from '@testing-library/react'
import { ReactElement, ReactNode } from 'react'
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client'
import { createMemoryRouter, RouterProvider } from 'react-router'

/**
 * Create a test Apollo Client instance
 * Uses InMemoryCache and connects to the MSW-mocked GraphQL endpoint
 */
export function createTestApolloClient() {
  return new ApolloClient({
    link: new HttpLink({
      uri: 'https://rickandmortyapi.com/graphql',
      // Important: fetch requests will be intercepted by MSW
    }),
    cache: new InMemoryCache(),
  })
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  withRouter?: boolean
  withApollo?: boolean
  client?: ApolloClient<any>
  initialRoute?: string
}

/**
 * Custom render function with optional providers
 * Use withRouter and withApollo options to include providers as needed
 */
export function render(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  const {
    withRouter = false,
    withApollo = false,
    client,
    initialRoute = '/',
    ...renderOptions
  } = options || {}

  // Special handling when router is needed
  if (withRouter) {
    // Create a memory router with the component as a route
    const router = createMemoryRouter(
      [
        {
          path: '*',
          element: ui,
        },
      ],
      {
        initialEntries: [initialRoute],
      }
    )

    let content: ReactElement = <RouterProvider router={router} />

    // Wrap with Apollo if needed
    if (withApollo) {
      const apolloClient = client || createTestApolloClient()
      content = <ApolloProvider client={apolloClient}>{content}</ApolloProvider>
    }

    return rtlRender(content, renderOptions)
  }

  // No router - just use wrapper
  function Wrapper({ children }: { children: ReactNode }) {
    if (withApollo) {
      const apolloClient = client || createTestApolloClient()
      return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
    }
    return <>{children}</>
  }

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

// Re-export everything from React Testing Library
export * from '@testing-library/react'
