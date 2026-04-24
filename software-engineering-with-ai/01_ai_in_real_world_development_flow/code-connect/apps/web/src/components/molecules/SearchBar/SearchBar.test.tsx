import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBar } from './SearchBar'

describe('SearchBar', () => {
  it('renders with placeholder text', () => {
    render(<SearchBar value="" onChange={() => {}} />)
    expect(screen.getByPlaceholderText('Digite o que você procura')).toBeInTheDocument()
  })

  it('renders with custom placeholder', () => {
    render(<SearchBar value="" onChange={() => {}} placeholder="Buscar posts" />)
    expect(screen.getByPlaceholderText('Buscar posts')).toBeInTheDocument()
  })

  it('calls onChange when user types', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<SearchBar value="" onChange={handleChange} />)
    await user.type(screen.getByRole('textbox'), 'React')
    expect(handleChange).toHaveBeenCalled()
  })

  it('displays current value', () => {
    render(<SearchBar value="TypeScript" onChange={() => {}} />)
    expect(screen.getByDisplayValue('TypeScript')).toBeInTheDocument()
  })
})
