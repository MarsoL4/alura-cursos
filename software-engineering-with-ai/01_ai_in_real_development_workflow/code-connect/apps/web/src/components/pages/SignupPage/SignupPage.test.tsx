import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { SignupPage } from './SignupPage'

describe('SignupPage', () => {
  it('renders the signup form', () => {
    render(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>
    )
    expect(screen.getByText('Cadastro')).toBeInTheDocument()
    expect(screen.getByText('Olá! Preencha seus dados.')).toBeInTheDocument()
  })

  it('renders the banner image', () => {
    render(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>
    )
    expect(screen.getByAltText('Mulher desenvolvedora com óculos futuristas')).toBeInTheDocument()
  })

  it('renders name, email and password inputs', () => {
    render(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>
    )
    expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
  })
})
