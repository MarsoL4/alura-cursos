import { useState } from 'react'
import { Button } from '../../atoms/Button/Button'
import { Checkbox } from '../../atoms/Checkbox/Checkbox'
import { Divider } from '../../atoms/Divider/Divider'
import { Link } from '../../atoms/Link/Link'
import { SocialButton } from '../../atoms/SocialButton/SocialButton'
import { FormField } from '../../molecules/FormField/FormField'

interface SignupFormData {
  name: string
  email: string
  password: string
  rememberMe: boolean
}

interface SignupFormProps {
  onSubmit?: (data: SignupFormData) => void
  error?: string | null
}

export function SignupForm({ onSubmit, error }: SignupFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit?.({ name, email, password, rememberMe })
  }

  return (
    <div className="flex flex-col gap-6 p-8 w-full">
      <div className="flex flex-col gap-6">
        <h1 id="signup-heading" className="text-3xl font-semibold text-offwhite">Cadastro</h1>
        <p className="text-2xl text-offwhite">Olá! Preencha seus dados.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate aria-labelledby="signup-heading">
        <FormField
          label="Nome"
          id="name"
          type="text"
          placeholder="Nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <FormField
          label="Email"
          id="email"
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <FormField
          label="Senha"
          id="password"
          type="password"
          placeholder="••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Checkbox
          id="remember-me"
          label="Lembrar-me"
          checked={rememberMe}
          onChange={setRememberMe}
        />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <Button type="submit">
          Cadastrar →
        </Button>
      </form>

      <Divider text="ou entre com outras contas" />

      <div className="flex justify-center gap-4">
        <SocialButton icon="/github.png" alt="GitHub logo" label="Github" />
        <SocialButton icon="/gmail.png" alt="Gmail logo" label="Gmail" />
      </div>

      <p className="text-sm text-offwhite">
        Já tem conta?{' '}
        <Link to="/login" variant="highlight">
          Faça seu login!
        </Link>
      </p>
    </div>
  )
}
