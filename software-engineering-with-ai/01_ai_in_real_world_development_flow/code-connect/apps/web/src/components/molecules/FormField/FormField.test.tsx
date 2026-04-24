import { render, screen } from '@testing-library/react'
import { FormField } from './FormField'

describe('FormField', () => {
  it('renders label and input together', () => {
    render(<FormField label="Email ou usuário" id="email" placeholder="usuario123" />)
    expect(screen.getByText('Email ou usuário')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('usuario123')).toBeInTheDocument()
  })

  it('label is associated with input via htmlFor and id', () => {
    render(<FormField label="Email ou usuário" id="email" />)
    const label = screen.getByText('Email ou usuário')
    const input = screen.getByRole('textbox')
    expect(label).toHaveAttribute('for', 'email')
    expect(input).toHaveAttribute('id', 'email')
  })
})
