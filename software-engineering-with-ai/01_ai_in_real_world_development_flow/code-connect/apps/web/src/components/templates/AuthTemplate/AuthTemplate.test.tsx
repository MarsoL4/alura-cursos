import { render, screen } from '@testing-library/react'
import { AuthTemplate } from './AuthTemplate'

describe('AuthTemplate', () => {
  it('renders the banner slot', () => {
    render(
      <AuthTemplate
        banner={<div>Banner content</div>}
        form={<div>Form content</div>}
      />
    )
    expect(screen.getByText('Banner content')).toBeInTheDocument()
  })

  it('renders the form slot', () => {
    render(
      <AuthTemplate
        banner={<div>Banner content</div>}
        form={<div>Form content</div>}
      />
    )
    expect(screen.getByText('Form content')).toBeInTheDocument()
  })
})
