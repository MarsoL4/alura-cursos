import { useAuth } from '../../../contexts/AuthContext'
import { Link } from '../../atoms/Link/Link'

interface NavItemProps {
  icon: string
  label: string
  to?: string
  onClick?: () => void
  active?: boolean
}

function NavItem({ icon, label, to, onClick, active }: NavItemProps) {
  const baseClass = `flex flex-col items-center justify-center gap-2 px-4 py-2 text-center transition-colors ${
    active ? 'text-white' : 'text-cinza-medio hover:text-cinza-claro'
  }`

  if (onClick) {
    return (
      <button className={baseClass} onClick={onClick}>
        <span className="material-icons text-3xl">{icon}</span>
        <span className="text-base leading-[1.5]">{label}</span>
      </button>
    )
  }

  return (
    <Link to={to!} className={baseClass}>
      <span className="material-icons text-3xl">{icon}</span>
      <span className="text-base leading-[1.5]">{label}</span>
    </Link>
  )
}

export function Sidebar() {
  const { isAuthenticated, logout } = useAuth()

  return (
    <aside className="bg-cinza-escuro flex flex-col gap-20 items-center px-4 py-10 rounded-lg self-stretch shrink-0 w-44">
      <Link to="/" className="flex items-center justify-center">
        <img
          src="/favicon.svg"
          alt="Code Connect"
          className="h-10 w-auto"
        />
      </Link>

      <nav className="flex flex-col gap-10 items-center w-full">
        {isAuthenticated && (
          <Link
            to="/publicar"
            className="border border-verde-destaque text-verde-destaque flex items-center justify-center gap-2 px-4 py-3 rounded-lg w-full text-lg text-center leading-[1.5] hover:bg-verde-destaque/10 transition-colors"
          >
            Publicar
          </Link>
        )}

        <NavItem icon="feed" label="Feed" to="/" active />
        <NavItem icon="account_circle" label="Perfil" to="/perfil" />
        <NavItem icon="info" label="Sobre nós" to="/sobre" />

        {isAuthenticated ? (
          <NavItem icon="logout" label="Sair" onClick={logout} />
        ) : (
          <NavItem icon="login" label="Entrar" to="/login" />
        )}
      </nav>
    </aside>
  )
}
