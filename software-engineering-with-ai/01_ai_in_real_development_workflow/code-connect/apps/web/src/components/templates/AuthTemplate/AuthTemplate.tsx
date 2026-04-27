import type { ReactNode } from 'react'

interface AuthTemplateProps {
  banner: ReactNode
  form: ReactNode
}

export function AuthTemplate({ banner, form }: AuthTemplateProps) {
  return (
    <main className="min-h-screen bg-grafite flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative watermark C's */}
      <span
        aria-hidden="true"
        className="absolute -left-20 top-1/2 -translate-y-1/2 text-[320px] font-bold text-cinza-escuro select-none pointer-events-none leading-none"
      >
        C
      </span>
      <span
        aria-hidden="true"
        className="absolute -right-20 top-1/2 -translate-y-1/2 text-[320px] font-bold text-cinza-escuro select-none pointer-events-none leading-none"
      >
        C
      </span>

      {/* Auth card */}
      <div className="relative z-10 w-full max-w-3xl bg-cinza-escuro rounded-4xl border border-black overflow-hidden shadow-2xl flex min-h-130">
        {/* Left: banner */}
        <div className="hidden md:block w-[45%] shrink-0">
          {banner}
        </div>

        {/* Right: form */}
        <div className="flex-1 flex items-center justify-center">
          {form}
        </div>
      </div>
    </main>
  )
}
