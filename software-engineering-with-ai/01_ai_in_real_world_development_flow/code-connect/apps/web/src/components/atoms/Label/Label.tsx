import type { LabelHTMLAttributes } from 'react'

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>

export function Label({ children, className = '', ...props }: LabelProps) {
  return (
    <label
      className={`text-lg text-offwhite font-normal ${className}`}
      {...props}
    >
      {children}
    </label>
  )
}
