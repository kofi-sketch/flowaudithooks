import { getCurrentUser } from '@/lib/actions/auth'
import { Sidebar } from '@/components/layout/sidebar'
import { TopBar } from '@/components/layout/topbar'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get current user (can be null - that's OK)
  const user = await getCurrentUser()

  return (
    <div className="flex h-screen bg-[#1a1a1a] overflow-hidden">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar user={user} />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
