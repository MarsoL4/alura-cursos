import { render, screen } from '@testing-library/react'
import { ThumbnailPlaceholder } from './ThumbnailPlaceholder'

describe('ThumbnailPlaceholder', () => {
  it('renders with accessible label', () => {
    render(<ThumbnailPlaceholder />)
    expect(screen.getByLabelText('Sem imagem de capa')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<ThumbnailPlaceholder className="h-60 w-full" />)
    const el = screen.getByLabelText('Sem imagem de capa')
    expect(el.className).toContain('h-60')
  })
})
