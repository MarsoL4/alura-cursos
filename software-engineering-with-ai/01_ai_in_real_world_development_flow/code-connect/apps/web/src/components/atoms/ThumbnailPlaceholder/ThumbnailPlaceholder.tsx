interface ThumbnailPlaceholderProps {
  className?: string
}

export function ThumbnailPlaceholder({ className = '' }: ThumbnailPlaceholderProps) {
  return (
    <div
      className={`flex items-center justify-center bg-verde-petroleo rounded-lg ${className}`}
      aria-label="Sem imagem de capa"
    >
      <span className="material-icons text-verde-destaque" style={{ fontSize: '3rem' }}>
        code
      </span>
    </div>
  )
}
