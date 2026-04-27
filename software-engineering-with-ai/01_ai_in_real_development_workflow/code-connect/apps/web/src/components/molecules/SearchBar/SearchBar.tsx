interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder = 'Digite o que você procura' }: SearchBarProps) {
  return (
    <div className="bg-cinza-escuro flex gap-4 items-center px-4 py-2 rounded w-full">
      <span className="material-icons text-cinza-claro text-3xl">search</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-cinza-claro placeholder-cinza-medio text-lg leading-[1.5] outline-none"
      />
    </div>
  )
}
