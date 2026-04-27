import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PostCard } from './PostCard'

const defaultProps = {
  id: 'post-1',
  title: 'Construindo um Design System',
  content: 'Neste post vou mostrar como criar um design system escalável usando React e TypeScript.',
  thumbnail: null,
  tags: ['React', 'TypeScript'],
  author: { name: 'Julio Silva' },
  likesCount: 12,
  commentsCount: 5,
}

function renderCard(props = {}) {
  return render(
    <MemoryRouter>
      <PostCard {...defaultProps} {...props} />
    </MemoryRouter>,
  )
}

describe('PostCard', () => {
  it('renders title and excerpt', () => {
    renderCard()
    expect(screen.getByText('Construindo um Design System')).toBeInTheDocument()
    expect(screen.getByText(/Neste post/)).toBeInTheDocument()
  })

  it('renders tags', () => {
    renderCard()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('renders likes and comments count', () => {
    renderCard()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('renders author username', () => {
    renderCard()
    expect(screen.getByText('@julio')).toBeInTheDocument()
  })

  it('renders thumbnail placeholder when no thumbnail', () => {
    renderCard({ thumbnail: null })
    expect(screen.getByLabelText('Sem imagem de capa')).toBeInTheDocument()
  })

  it('renders thumbnail image when provided', () => {
    renderCard({ thumbnail: 'https://example.com/img.png' })
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', 'https://example.com/img.png')
  })

  it('links to the post detail page', () => {
    renderCard()
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/posts/post-1')
  })
})
