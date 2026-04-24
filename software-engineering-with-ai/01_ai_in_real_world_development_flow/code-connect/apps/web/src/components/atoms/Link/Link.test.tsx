import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Link } from './Link'

describe('Link', () => {
  it('renders children', () => {
    render(
      <MemoryRouter>
        <Link to="/signup">Crie seu cadastro!</Link>
      </MemoryRouter>
    )
    expect(screen.getByText('Crie seu cadastro!')).toBeInTheDocument()
  })

  it('renders with correct href', () => {
    render(
      <MemoryRouter>
        <Link to="/signup">Signup</Link>
      </MemoryRouter>
    )
    expect(screen.getByRole('link')).toHaveAttribute('href', '/signup')
  })

  it('renders highlight variant with green styling', () => {
    render(
      <MemoryRouter>
        <Link to="/signup" variant="highlight">Crie seu cadastro!</Link>
      </MemoryRouter>
    )
    expect(screen.getByRole('link')).toHaveClass('text-verde-destaque')
  })
})
