import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { AuthBanner } from '../../organisms/AuthBanner/AuthBanner'
import { SignupForm } from '../../organisms/SignupForm/SignupForm'
import { AuthTemplate } from '../../templates/AuthTemplate/AuthTemplate'

export function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(data: { name: string; email: string; password: string; rememberMe: boolean }) {
    setError(null)
    try {
      await signup({ name: data.name, email: data.email, password: data.password })
      navigate('/')
    } catch {
      setError('Não foi possível criar a conta. Verifique os dados e tente novamente.')
    }
  }

  return (
    <AuthTemplate
      banner={<AuthBanner imageSrc="/banner-cadastro.png" imageAlt="Mulher desenvolvedora com óculos futuristas" />}
      form={<SignupForm onSubmit={handleSubmit} error={error} />}
    />
  )
}
