import { Outlet } from 'react-router-dom'
import { Sidebar } from '../../organisms/Sidebar/Sidebar'

export function FeedLayout() {
  return (
    <div className="min-h-screen bg-grafite flex items-start justify-between px-8 py-14 gap-6 max-w-[1560px] mx-auto">
      <Sidebar />
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  )
}
