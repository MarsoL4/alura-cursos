interface SocialButtonProps {
  icon: string
  alt: string
  label: string
  onClick?: () => void
}

export function SocialButton({ icon, alt, label, onClick }: SocialButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1 bg-transparent border border-gray-500 hover:border-gray-400 rounded-lg px-6 py-3 transition-colors cursor-pointer"
    >
      <img src={icon} alt={alt} className="w-6 h-6 object-contain" />
      <span className="text-xs text-gray-300">{label}</span>
    </button>
  )
}
