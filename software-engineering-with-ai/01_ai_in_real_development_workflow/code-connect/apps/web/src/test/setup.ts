import '@testing-library/jest-dom/vitest'
import { configureAxe, toHaveNoViolations } from 'jest-axe'
import { expect } from 'vitest'

expect.extend(toHaveNoViolations)

export const axe = configureAxe({
  rules: {
    // WCAG 2 Level AA — disable rules not applicable to component-level tests
    'region': { enabled: false },
  },
})
