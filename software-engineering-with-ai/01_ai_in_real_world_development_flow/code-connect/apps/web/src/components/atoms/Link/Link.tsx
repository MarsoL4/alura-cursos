import { Link as RouterLink } from 'react-router-dom'
import type { ReactNode } from 'react'

type LinkVariant = 'default' | 'highlight'

interface LinkProps {
  to: string
  children: ReactNode
  variant?: LinkVariant
  className?: string
}

export function Link({ to, children, variant = 'default', className = '' }: LinkProps) {
  const variants: Record<LinkVariant, string> = {
    default: 'text-gray-400 hover:text-gray-200 transition-colors',
    highlight: 'text-verde-destaque hover:text-verde-destaque/80 font-medium transition-colors',
  }

  return (
    <RouterLink to={to} className={`${variants[variant]} ${className}`}>
      {children}
    </RouterLink>
  )
}
