import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { Sidebar } from './Sidebar'

const mockLogout = vi.fn()

vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}))

import { useAuth } from '../../../contexts/AuthContext'
const mockUseAuth = useAuth as unknown as ReturnType<typeof vi.fn>

function renderSidebar() {
  return render(
    <MemoryRouter>
      <Sidebar />
    </MemoryRouter>,
  )
}

describe('Sidebar', () => {
  afterEach(() => vi.clearAllMocks())

  it('renders Feed and Sobre nós links always', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, logout: mockLogout })
    renderSidebar()
    expect(screen.getByText('Feed')).toBeInTheDocument()
    expect(screen.getByText('Sobre nós')).toBeInTheDocument()
  })

  it('shows Entrar link when not authenticated', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, logout: mockLogout })
    renderSidebar()
    expect(screen.getByText('Entrar')).toBeInTheDocument()
    expect(screen.queryByText('Sair')).not.toBeInTheDocument()
  })

  it('shows Sair button when authenticated', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, logout: mockLogout })
    renderSidebar()
    expect(screen.getByText('Sair')).toBeInTheDocument()
    expect(screen.queryByText('Entrar')).not.toBeInTheDocument()
  })

  it('shows Publicar link when authenticated', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, logout: mockLogout })
    renderSidebar()
    expect(screen.getByText('Publicar')).toBeInTheDocument()
  })

  it('calls logout when Sair is clicked', async () => {
    const user = userEvent.setup()
    mockUseAuth.mockReturnValue({ isAuthenticated: true, logout: mockLogout })
    renderSidebar()
    await user.click(screen.getByText('Sair'))
    expect(mockLogout).toHaveBeenCalledOnce()
  })
})
