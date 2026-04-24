import { useAuth } from '../../../contexts/AuthContext'

export function HomePage() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-grafite flex items-center justify-center">
      <div className="bg-cinza-escuro rounded-2xl p-8 flex flex-col gap-4 max-w-sm w-full">
        <h1 className="text-3xl font-semibold text-offwhite">Olá, {user?.name}!</h1>
        <p className="text-base text-offwhite">{user?.email}</p>
        <button
          onClick={logout}
          className="mt-4 bg-verde-destaque text-verde-petroleo font-semibold rounded-lg px-4 py-2 hover:opacity-90 transition-opacity"
        >
          Sair
        </button>
      </div>
    </div>
  )
}
