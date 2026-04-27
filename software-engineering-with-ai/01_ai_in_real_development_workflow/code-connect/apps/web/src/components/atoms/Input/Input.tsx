import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement>

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`w-full bg-cinza-medio text-grafite placeholder-grafite rounded px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-verde-destaque focus:ring-opacity-50 border border-transparent focus:border-verde-destaque transition-colors ${className}`}
      {...props}
    />
  )
}
