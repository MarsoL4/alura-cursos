import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('renders label text', () => {
    render(<Checkbox id="remember" label="Lembrar-me" checked={false} onChange={() => {}} />)
    expect(screen.getByText('Lembrar-me')).toBeInTheDocument()
  })

  it('calls onChange when clicked', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Checkbox id="remember" label="Lembrar-me" checked={false} onChange={handleChange} />)
    await user.click(screen.getByLabelText('Lembrar-me'))
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('shows as checked when checked prop is true', () => {
    render(<Checkbox id="remember" label="Lembrar-me" checked={true} onChange={() => {}} />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })
})
