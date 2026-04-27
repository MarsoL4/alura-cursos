import type { InputHTMLAttributes } from 'react'
import { Input } from '../../atoms/Input/Input'
import { Label } from '../../atoms/Label/Label'

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  id: string
}

export function FormField({ label, id, ...inputProps }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...inputProps} />
    </div>
  )
}
