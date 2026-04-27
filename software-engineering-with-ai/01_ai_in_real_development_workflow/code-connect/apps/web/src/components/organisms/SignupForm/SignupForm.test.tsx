import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { SignupForm } from './SignupForm'

function renderSignupForm(props = {}) {
  return render(
    <MemoryRouter>
      <SignupForm {...props} />
    </MemoryRouter>
  )
}

describe('SignupForm', () => {
  it('renders title and subtitle', () => {
    renderSignupForm()
    expect(screen.getByText('Cadastro')).toBeInTheDocument()
    expect(screen.getByText('Olá! Preencha seus dados.')).toBeInTheDocument()
  })

  it('renders name, email and password fields', () => {
    renderSignupForm()
    expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
  })

  it('renders remember me checkbox', () => {
    renderSignupForm()
    expect(screen.getByLabelText('Lembrar-me')).toBeInTheDocument()
  })

  it('renders social buttons', () => {
    renderSignupForm()
    expect(screen.getByAltText('GitHub logo')).toBeInTheDocument()
    expect(screen.getByAltText('Gmail logo')).toBeInTheDocument()
  })

  it('calls onSubmit with form data when submitted', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn()
    renderSignupForm({ onSubmit: handleSubmit })

    await user.type(screen.getByLabelText('Nome'), 'João Silva')
    await user.type(screen.getByLabelText('Email'), 'joao@example.com')
    await user.type(screen.getByLabelText('Senha'), 'senha123')
    await user.click(screen.getByRole('button', { name: /cadastrar/i }))

    expect(handleSubmit).toHaveBeenCalledWith({
      name: 'João Silva',
      email: 'joao@example.com',
      password: 'senha123',
      rememberMe: false,
    })
  })
})
