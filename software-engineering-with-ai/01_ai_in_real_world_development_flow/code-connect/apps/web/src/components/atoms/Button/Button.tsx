import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'social'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: ButtonVariant
}

export function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
  const variants: Record<ButtonVariant, string> = {
    primary:
      'w-full bg-verde-destaque hover:bg-verde-destaque/80 text-verde-petroleo font-semibold rounded-lg px-4 py-3 transition-colors flex items-center justify-center gap-2',
    social:
      'flex flex-col items-center gap-1 bg-transparent border border-gray-600 hover:border-gray-400 rounded-lg p-3 transition-colors text-gray-300 text-xs',
  }

  return (
    <button className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
