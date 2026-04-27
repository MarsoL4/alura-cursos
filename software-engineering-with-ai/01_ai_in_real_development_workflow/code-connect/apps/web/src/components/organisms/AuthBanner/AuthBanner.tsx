interface AuthBannerProps {
  imageSrc: string
  imageAlt: string
}

export function AuthBanner({ imageSrc, imageAlt }: AuthBannerProps) {
  return (
    <div className="relative w-full h-full min-h-[400px] overflow-hidden rounded-l-2xl">
      <img
        src={imageSrc}
        alt={imageAlt}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-6 left-6 flex items-center gap-2">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect width="32" height="32" rx="8" fill="#81FE88" />
          <text x="8" y="23" fill="black" fontSize="18" fontWeight="bold">C</text>
        </svg>
        <span className="text-white font-semibold text-lg leading-tight">
          code<br />connect
        </span>
      </div>
    </div>
  )
}
