interface DividerProps {
  text: string
}

export function Divider({ text }: DividerProps) {
  return (
    <div className="flex items-center gap-3 my-2">
      <div className="flex-1 h-px bg-gray-700" />
      <span className="text-xs text-gray-400 whitespace-nowrap">{text}</span>
      <div className="flex-1 h-px bg-gray-700" />
    </div>
  )
}
