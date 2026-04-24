import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'

vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: vi.fn().mockReturnValue({ isAuthenticated: false, logout: vi.fn() }),
}))

import { FeedLayout } from './FeedLayout'

describe('FeedLayout', () => {
  it('renders the sidebar and outlet content', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<FeedLayout />}>
            <Route path="/" element={<div>Conteúdo da página</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Feed')).toBeInTheDocument()
    expect(screen.getByText('Conteúdo da página')).toBeInTheDocument()
  })
})
