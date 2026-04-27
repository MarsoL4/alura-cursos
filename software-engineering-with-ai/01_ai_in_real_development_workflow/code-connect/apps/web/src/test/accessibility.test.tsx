/**
 * Accessibility tests — WCAG 2 Level AA
 *
 * Uses jest-axe (axe-core) to run automated checks against every component.
 * These tests surface violations early; manual testing is still required for
 * the ~43 % of WCAG criteria that cannot be verified programmatically.
 */

import React from 'react'
import { render } from '@testing-library/react'
import { configureAxe } from 'jest-axe'
import { MemoryRouter } from 'react-router-dom'

// Atoms
import { Button } from '../components/atoms/Button/Button'
import { Checkbox } from '../components/atoms/Checkbox/Checkbox'
import { Input } from '../components/atoms/Input/Input'
import { Label } from '../components/atoms/Label/Label'
import { Link } from '../components/atoms/Link/Link'
import { SocialButton } from '../components/atoms/SocialButton/SocialButton'

// Molecules
import { FormField } from '../components/molecules/FormField/FormField'

// Organisms
import { AuthBanner } from '../components/organisms/AuthBanner/AuthBanner'
import { LoginForm } from '../components/organisms/LoginForm/LoginForm'
import { SignupForm } from '../components/organisms/SignupForm/SignupForm'

// Templates
import { AuthTemplate } from '../components/templates/AuthTemplate/AuthTemplate'

// Pages
import { LoginPage } from '../components/pages/LoginPage/LoginPage'
import { SignupPage } from '../components/pages/SignupPage/SignupPage'

// Configure axe for WCAG 2 AA — region rule enabled (pages have <main> via AuthTemplate)
const axe = configureAxe({})

// Wraps isolated components in a <main> so the `region` rule does not fire
// for content that is legitimately rendered outside a page landmark in unit tests.
function renderInMain(ui: React.ReactElement) {
  return render(<main>{ui}</main>)
}

// ---------------------------------------------------------------------------
// Atoms
// ---------------------------------------------------------------------------

describe('Accessibility — atoms', () => {
  describe('Button', () => {
    it('primary variant has no violations', async () => {
      const { container } = renderInMain(<Button>Entrar</Button>)
      expect(await axe(container)).toHaveNoViolations()
    })

    it('social variant has no violations', async () => {
      const { container } = renderInMain(<Button variant="social">Github</Button>)
      expect(await axe(container)).toHaveNoViolations()
    })

    it('disabled state has no violations', async () => {
      const { container } = renderInMain(<Button disabled>Aguarde</Button>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('Input', () => {
    it('labeled input has no violations', async () => {
      const { container } = renderInMain(
        <div>
          <label htmlFor="test-input">Email</label>
          <Input id="test-input" type="email" placeholder="usuario@email.com" />
        </div>
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('password input has no violations', async () => {
      const { container } = renderInMain(
        <div>
          <label htmlFor="test-password">Senha</label>
          <Input id="test-password" type="password" />
        </div>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('Label', () => {
    it('has no violations', async () => {
      const { container } = renderInMain(
        <div>
          <Label htmlFor="campo">Nome</Label>
          <input id="campo" type="text" />
        </div>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('Checkbox', () => {
    it('unchecked state has no violations', async () => {
      const { container } = renderInMain(
        <Checkbox id="check" label="Lembrar-me" checked={false} onChange={() => {}} />
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('checked state has no violations', async () => {
      const { container } = renderInMain(
        <Checkbox id="check" label="Lembrar-me" checked={true} onChange={() => {}} />
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('Link', () => {
    it('default variant has no violations', async () => {
      const { container } = renderInMain(
        <MemoryRouter>
          <Link to="/about">Sobre nós</Link>
        </MemoryRouter>
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('highlight variant has no violations', async () => {
      const { container } = renderInMain(
        <MemoryRouter>
          <Link to="/signup" variant="highlight">Crie seu cadastro!</Link>
        </MemoryRouter>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('SocialButton', () => {
    it('has no violations', async () => {
      const { container } = renderInMain(
        <SocialButton icon="/github.png" alt="GitHub logo" label="Github" />
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

// ---------------------------------------------------------------------------
// Molecules
// ---------------------------------------------------------------------------

describe('Accessibility — molecules', () => {
  describe('FormField', () => {
    it('text field has no violations', async () => {
      const { container } = renderInMain(
        <FormField label="Nome" id="name" type="text" placeholder="João" />
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('email field has no violations', async () => {
      const { container } = renderInMain(
        <FormField label="Email" id="email" type="email" placeholder="usuario@email.com" />
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('password field has no violations', async () => {
      const { container } = renderInMain(
        <FormField label="Senha" id="password" type="password" />
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

// ---------------------------------------------------------------------------
// Organisms
// ---------------------------------------------------------------------------

describe('Accessibility — organisms', () => {
  describe('AuthBanner', () => {
    it('has no violations', async () => {
      const { container } = renderInMain(
        <AuthBanner imageSrc="/banner.png" imageAlt="Mulher desenvolvedora no computador" />
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('LoginForm', () => {
    it('has no violations', async () => {
      const { container } = renderInMain(
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('SignupForm', () => {
    it('has no violations', async () => {
      const { container } = renderInMain(
        <MemoryRouter>
          <SignupForm />
        </MemoryRouter>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

describe('Accessibility — templates', () => {
  describe('AuthTemplate', () => {
    it('has no violations', async () => {
      const { container } = render(
        <AuthTemplate
          banner={<AuthBanner imageSrc="/banner.png" imageAlt="Banner de cadastro" />}
          form={<p>Formulário de exemplo</p>}
        />
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

// ---------------------------------------------------------------------------
// Pages — closest to the real user experience
// ---------------------------------------------------------------------------

describe('Accessibility — pages', () => {
  describe('LoginPage', () => {
    it('has no WCAG 2 AA violations', async () => {
      const { container } = render(
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('SignupPage', () => {
    it('has no WCAG 2 AA violations', async () => {
      const { container } = render(
        <MemoryRouter>
          <SignupPage />
        </MemoryRouter>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
