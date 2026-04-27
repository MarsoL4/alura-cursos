import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { LoginForm } from './LoginForm'

function renderLoginForm(props = {}) {
  return render(
    <MemoryRouter>
      <LoginForm {...props} />
    </MemoryRouter>
  )
}

describe('LoginForm', () => {
  it('renders title and subtitle', () => {
    renderLoginForm()
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByText('Boas-vindas! Faça seu login.')).toBeInTheDocument()
  })

  it('renders email and password fields', () => {
    renderLoginForm()
    expect(screen.getByLabelText('Email ou usuário')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
  })

  it('renders remember me checkbox', () => {
    renderLoginForm()
    expect(screen.getByLabelText('Lembrar-me')).toBeInTheDocument()
  })

  it('renders social buttons', () => {
    renderLoginForm()
    expect(screen.getByAltText('GitHub logo')).toBeInTheDocument()
    expect(screen.getByAltText('Gmail logo')).toBeInTheDocument()
  })

  it('calls onSubmit with form data when submitted', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn()
    renderLoginForm({ onSubmit: handleSubmit })

    await user.type(screen.getByLabelText('Email ou usuário'), 'test@example.com')
    await user.type(screen.getByLabelText('Senha'), 'secret123')
    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'secret123',
      rememberMe: false,
    })
  })
})
