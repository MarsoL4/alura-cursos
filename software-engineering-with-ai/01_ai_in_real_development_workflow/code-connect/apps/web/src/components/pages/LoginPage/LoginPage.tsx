import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { AuthBanner } from '../../organisms/AuthBanner/AuthBanner'
import { LoginForm } from '../../organisms/LoginForm/LoginForm'
import { AuthTemplate } from '../../templates/AuthTemplate/AuthTemplate'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(data: { email: string; password: string; rememberMe: boolean }) {
    setError(null)
    try {
      await login({ email: data.email, password: data.password })
      navigate('/')
    } catch {
      setError('Email ou senha inválidos.')
    }
  }

  return (
    <AuthTemplate
      banner={<AuthBanner imageSrc="/banner-login.png" imageAlt="Mulher desenvolvedora no computador" />}
      form={<LoginForm onSubmit={handleSubmit} error={error} />}
    />
  )
}
