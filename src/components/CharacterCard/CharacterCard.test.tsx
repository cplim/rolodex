import { describe, it, expect } from 'vitest'
import { render, screen } from '../../test/test-utils'
import { CharacterCard } from './CharacterCard'
import { TEST_IDS } from '../../test/test-ids'

describe('CharacterCard', () => {
  const defaultProps = {
    name: 'Rick Sanchez',
    image: 'https://example.com/rick.jpg',
    species: 'Human',
    status: 'Alive',
    gender: 'Male',
  }

  it('renders character card with all information', () => {
    render(<CharacterCard {...defaultProps} />)

    // Card container should be present
    expect(screen.getByTestId(TEST_IDS.CHARACTER_CARD)).toBeInTheDocument()

    // Character name should be rendered as heading
    expect(screen.getByRole('heading', { name: 'Rick Sanchez' })).toBeInTheDocument()

    // Character image should be rendered with alt text
    const image = screen.getByAltText('Rick Sanchez character')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/rick.jpg')

    // Species should be displayed
    expect(screen.getByText('Human')).toBeInTheDocument()

    // Status should be displayed with test ID (dynamic styled element)
    const statusElement = screen.getByTestId(TEST_IDS.CHARACTER_STATUS)
    expect(statusElement).toBeInTheDocument()
    expect(statusElement).toHaveTextContent('Alive')
    expect(statusElement).toHaveClass('status', 'alive')

    // Gender should be displayed
    expect(screen.getByText('Male')).toBeInTheDocument()
  })

  it('renders without optional gender prop', () => {
    const propsWithoutGender = {
      name: 'Rick Sanchez',
      image: 'https://example.com/rick.jpg',
      species: 'Human',
      status: 'Alive',
    }

    render(<CharacterCard {...propsWithoutGender} />)

    expect(screen.getByRole('heading', { name: 'Rick Sanchez' })).toBeInTheDocument()
    expect(screen.queryByText('Gender:')).not.toBeInTheDocument()
  })

  it('renders without optional species prop', () => {
    const propsWithoutSpecies = {
      name: 'Rick Sanchez',
      image: 'https://example.com/rick.jpg',
      status: 'Alive',
      gender: 'Male',
    }

    render(<CharacterCard {...propsWithoutSpecies} />)

    expect(screen.getByRole('heading', { name: 'Rick Sanchez' })).toBeInTheDocument()
    expect(screen.queryByText('Species:')).not.toBeInTheDocument()
  })

  it('renders without optional status prop', () => {
    const propsWithoutStatus = {
      name: 'Rick Sanchez',
      image: 'https://example.com/rick.jpg',
      species: 'Human',
      gender: 'Male',
    }

    render(<CharacterCard {...propsWithoutStatus} />)

    expect(screen.getByRole('heading', { name: 'Rick Sanchez' })).toBeInTheDocument()
    expect(screen.queryByText('Status:')).not.toBeInTheDocument()
    expect(screen.queryByTestId(TEST_IDS.CHARACTER_STATUS)).not.toBeInTheDocument()
  })

  it('applies correct CSS class for status "Dead"', () => {
    const propsWithDeadStatus = {
      ...defaultProps,
      status: 'Dead',
    }

    render(<CharacterCard {...propsWithDeadStatus} />)

    const statusElement = screen.getByTestId(TEST_IDS.CHARACTER_STATUS)
    expect(statusElement).toHaveTextContent('Dead')
    expect(statusElement).toHaveClass('status', 'dead')
  })

  it('applies correct CSS class for status "unknown"', () => {
    const propsWithUnknownStatus = {
      ...defaultProps,
      status: 'unknown',
    }

    render(<CharacterCard {...propsWithUnknownStatus} />)

    const statusElement = screen.getByTestId(TEST_IDS.CHARACTER_STATUS)
    expect(statusElement).toHaveTextContent('unknown')
    expect(statusElement).toHaveClass('status', 'unknown')
  })

  it('renders with only required props', () => {
    const minimalProps = {
      name: 'Morty Smith',
      image: 'https://example.com/morty.jpg',
    }

    render(<CharacterCard {...minimalProps} />)

    expect(screen.getByRole('heading', { name: 'Morty Smith' })).toBeInTheDocument()
    expect(screen.getByAltText('Morty Smith character')).toBeInTheDocument()
    expect(screen.queryByText('Species:')).not.toBeInTheDocument()
    expect(screen.queryByText('Status:')).not.toBeInTheDocument()
    expect(screen.queryByText('Gender:')).not.toBeInTheDocument()
  })

  it('handles special characters in character name', () => {
    const propsWithSpecialChars = {
      ...defaultProps,
      name: "Rick's Clone #42",
    }

    render(<CharacterCard {...propsWithSpecialChars} />)

    expect(screen.getByRole('heading', { name: "Rick's Clone #42" })).toBeInTheDocument()
    expect(screen.getByAltText("Rick's Clone #42 character")).toBeInTheDocument()
  })
})
