interface CheckboxProps {
  id: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function Checkbox({ id, label, checked, onChange }: CheckboxProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-gray-600 bg-cinza-medio accent-verde-destaque cursor-pointer"
      />
      <label htmlFor={id} className="text-sm text-gray-300 cursor-pointer select-none">
        {label}
      </label>
    </div>
  )
}
