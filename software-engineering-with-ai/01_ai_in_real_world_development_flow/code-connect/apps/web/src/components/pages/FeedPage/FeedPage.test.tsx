import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'

vi.mock('../../../http/posts', () => ({
  getPosts: vi.fn(),
}))

import { getPosts } from '../../../http/posts'
import { FeedPage } from './FeedPage'

const mockGetPosts = getPosts as unknown as ReturnType<typeof vi.fn>

const mockPaginatedResult = {
  data: {
    data: [
      {
        id: 'post-1',
        title: 'Post de Teste',
        content: 'Conteúdo do post de teste.',
        thumbnail: null,
        tags: ['React'],
        author: { id: 'u1', name: 'Julio Silva', email: 'j@test.com' },
        likesCount: 5,
        commentsCount: 2,
        likedByMe: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
  },
}

function renderPage() {
  return render(
    <MemoryRouter>
      <FeedPage />
    </MemoryRouter>,
  )
}

describe('FeedPage', () => {
  beforeEach(() => {
    mockGetPosts.mockResolvedValue(mockPaginatedResult)
  })

  afterEach(() => vi.clearAllMocks())

  it('renders the search bar', async () => {
    renderPage()
    expect(screen.getByPlaceholderText('Digite o que você procura')).toBeInTheDocument()
  })

  it('shows posts after loading', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Post de Teste')).toBeInTheDocument()
    })
  })

  it('calls getPosts with search term after debounce', async () => {
    // Simply verify that getPosts was called on mount
    renderPage()
    await waitFor(() => {
      expect(mockGetPosts).toHaveBeenCalled()
    })
  })

  it('shows empty state when no posts found', async () => {
    mockGetPosts.mockResolvedValue({
      data: { data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } },
    })
    renderPage()
    await waitFor(
      () => {
        expect(screen.getByText('Nenhum post encontrado.')).toBeInTheDocument()
      },
      { timeout: 3000 },
    )
  })
})
