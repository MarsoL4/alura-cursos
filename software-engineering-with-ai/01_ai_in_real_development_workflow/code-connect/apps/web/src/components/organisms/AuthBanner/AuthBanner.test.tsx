import { render, screen } from '@testing-library/react'
import { AuthBanner } from './AuthBanner'

describe('AuthBanner', () => {
  it('renders image with correct src and alt', () => {
    render(<AuthBanner imageSrc="/banner-login.png" imageAlt="Login banner" />)
    const img = screen.getByAltText('Login banner')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/banner-login.png')
  })

  it('renders the code connect branding', () => {
    render(<AuthBanner imageSrc="/banner-login.png" imageAlt="Login banner" />)
    expect(screen.getByText(/connect/i)).toBeInTheDocument()
  })
})
