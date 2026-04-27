import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('../../../http/posts', () => ({
  createPost: vi.fn().mockResolvedValue({ data: { id: 'new-post' } }),
}))

import { PublishPage } from './PublishPage'

function renderPage() {
  return render(
    <MemoryRouter>
      <PublishPage />
    </MemoryRouter>,
  )
}

describe('PublishPage', () => {
  afterEach(() => vi.clearAllMocks())

  it('renders the form fields', () => {
    renderPage()
    expect(screen.getByLabelText('Nome do projeto')).toBeInTheDocument()
    expect(screen.getByLabelText('Descrição')).toBeInTheDocument()
    expect(screen.getByLabelText('Tags')).toBeInTheDocument()
  })

  it('renders Publicar and Descartar buttons', () => {
    renderPage()
    expect(screen.getByText('Publicar')).toBeInTheDocument()
    expect(screen.getByText('Descartar')).toBeInTheDocument()
  })

  it('shows validation error when submitting empty form', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByText('Publicar'))
    expect(screen.getByText('Título e descrição são obrigatórios.')).toBeInTheDocument()
  })

  it('navigates to feed when Descartar is clicked', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByText('Descartar'))
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('adds tags when pressing Enter', async () => {
    const user = userEvent.setup()
    renderPage()
    const tagInput = screen.getByLabelText('Tags')
    await user.type(tagInput, 'React{Enter}')
    expect(screen.getByText('React')).toBeInTheDocument()
  })

  it('submits the form and navigates on success', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.type(screen.getByLabelText('Nome do projeto'), 'Meu Projeto')
    await user.type(screen.getByLabelText('Descrição'), 'Descrição do meu projeto incrível.')
    await user.click(screen.getByText('Publicar'))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })
})
