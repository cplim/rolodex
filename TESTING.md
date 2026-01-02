# Testing Strategy - Rick & Morty Rolodex

This document outlines the testing approach for this React + GraphQL application.

## Testing Stack

- **Vitest** - Fast, Vite-native test runner with Jest-compatible API
- **React Testing Library** - Component testing following user-centric best practices
- **MSW (Mock Service Worker)** - API mocking for GraphQL requests
- **jsdom** - DOM implementation for Node.js testing

## Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Structure

```
src/
├── components/
│   └── CharacterCard/
│       ├── CharacterCard.tsx
│       ├── CharacterCard.css
│       └── CharacterCard.test.tsx    # Unit tests
├── pages/
│   └── Search/
│       ├── Search.tsx
│       └── (integration tests TBD)
└── test/
    ├── setup.ts                       # Global test setup
    ├── test-utils.tsx                 # Custom render utilities
    ├── test-ids.ts                    # Centralized test ID constants
    └── mocks/
        ├── server.ts                  # MSW server setup
        ├── handlers.ts                # GraphQL mock handlers
        └── fixtures.ts                # Test data fixtures
```

## Testing Approach

### Unit Tests (CharacterCard)

CharacterCard component tests focus on:
- Rendering all character data correctly
- Handling optional props (gender, species, status)
- Applying correct CSS classes based on status
- Accessibility (proper alt text, headings)

**Example:**
```typescript
it('renders character card with all information', () => {
  render(<CharacterCard name="Rick" status="Alive" ... />)

  expect(screen.getByRole('heading', { name: 'Rick Sanchez' })).toBeInTheDocument()
  expect(screen.getByAltText('Rick Sanchez character')).toBeInTheDocument()
  expect(screen.getByTestId(TEST_IDS.CHARACTER_STATUS)).toHaveTextContent('Alive')
})
```

### Integration Tests (Search Page)

**Note:** Full integration tests for the Search page are pending due to React Router v7 testing complexities. The following approach is planned:

- Test GraphQL query execution with MSW
- Verify loading/error/success states
- Test URL parameter handling
- Validate character card rendering from API data

### Test IDs

We use centralized test IDs for stable element selection:

**When to use test IDs:**
- Structural elements without semantic roles
- Dynamic content with changing text
- Multiple similar elements needing distinction

**When NOT to use test IDs:**
- Elements with semantic roles (`button`, `heading`, etc.)
- Elements with stable text content
- When accessible queries work fine

**Example:**
```typescript
// src/test/test-ids.ts
export const TEST_IDS = {
  CHARACTER_CARD: 'character-card',
  CHARACTER_STATUS: 'character-status',
} as const

// In component
<div data-testid={TEST_IDS.CHARACTER_CARD}>

// In test
screen.getByTestId(TEST_IDS.CHARACTER_CARD)
```

## MSW (Mock Service Worker)

GraphQL API mocking is configured for the Rick & Morty API:

**Mock Handlers:**
- `GetCharacters` query with search parameter support
- Error handlers for testing failure states
- Network error handlers for connectivity issues

**Fixtures:**
- Pre-defined character data (Rick, Morty, Summer, etc.)
- Helper functions for creating responses
- Empty state responses

**Example:**
```typescript
// Tests automatically use MSW mocks
test('displays Rick when searching', async () => {
  render(<Search />, { withRouter: true, withApollo: true })

  await waitFor(() => {
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument()
  })
})
```

## Custom Test Utilities

### `render()` Function

Custom render with optional providers:

```typescript
// No providers (unit tests)
render(<CharacterCard {...props} />)

// With Apollo only
render(<Component />, { withApollo: true })

// With Router only
render(<Component />, { withRouter: true, initialRoute: '/?q=rick' })

// With both
render(<Component />, {
  withRouter: true,
  withApollo: true,
  initialRoute: '/?q=rick'
})
```

## Coverage Thresholds

Current coverage targets:
- **Lines**: 70%
- **Functions**: 70%
- **Branches**: 70%
- **Statements**: 70%

Run `npm run test:coverage` to generate coverage reports in `coverage/` directory.

## CI/CD Integration

Recommended CI pipeline:

```bash
1. npm run lint          # ESLint checks
2. npm run test:coverage # Run tests with coverage
3. npm run build         # Type check + build
4. (Deploy to Cloudflare Pages)
```

## Cloudflare Pages Considerations

- Tests run in jsdom environment (not real browser)
- For E2E testing on Cloudflare Pages, consider adding Playwright
- Test against preview builds before production deployment
- Validate client-side routing with direct URL access

## Future Enhancements

**Phase 2:**
- [ ] Resolve React Router v7 testing patterns for Search page integration tests
- [ ] Add E2E tests with Playwright
- [ ] Increase coverage thresholds to 80%+

**Phase 3:**
- [ ] Visual regression testing with Percy/Chromatic
- [ ] Performance testing
- [ ] Accessibility audits with axe-core

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [MSW Documentation](https://mswjs.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Troubleshooting

### Tests failing with "Cannot find module"
- Run `npm install` to ensure all dependencies are installed
- Check that TypeScript paths in `tsconfig.json` match actual file structure

### MSW not intercepting requests
- Verify `setupFiles` path in `vite.config.ts` points to `./src/test/setup.ts`
- Ensure MSW server is started in setup file with `server.listen()`

### React Router issues in tests
- React Router v7 has different testing patterns than v6
- Use `withRouter: true` option in custom render function
- Consider mocking `useSearchParams` for simpler tests

---

**Last Updated:** 2026-01-02
**Testing Framework Version:** Vitest 4.0.16
