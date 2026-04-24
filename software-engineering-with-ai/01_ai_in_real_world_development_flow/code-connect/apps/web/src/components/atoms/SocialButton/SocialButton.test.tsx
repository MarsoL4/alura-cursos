import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SocialButton } from './SocialButton'

describe('SocialButton', () => {
  it('renders image with alt text', () => {
    render(<SocialButton icon="/github.png" alt="GitHub" label="Github" />)
    expect(screen.getByAltText('GitHub')).toBeInTheDocument()
  })

  it('renders label', () => {
    render(<SocialButton icon="/github.png" alt="GitHub" label="Github" />)
    expect(screen.getByText('Github')).toBeInTheDocument()
  })

  it('fires onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<SocialButton icon="/github.png" alt="GitHub" label="Github" onClick={handleClick} />)
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledOnce()
  })
})
