import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Login</Button>)
    expect(screen.getByText('Login')).toBeInTheDocument()
  })

  it('fires onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Login</Button>)
    await user.click(screen.getByText('Login'))
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('renders social variant', () => {
    render(<Button variant="social">GitHub</Button>)
    expect(screen.getByText('GitHub')).toBeInTheDocument()
  })
})
