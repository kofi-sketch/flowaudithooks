import { getCurrentUser } from '@/lib/actions/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { signOut } from '@/lib/actions/auth'
import GradientBackground from '@/components/ui/gradient-background'
import ThemeToggle from '@/components/ui/theme-toggle'

async function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-rose-500/10 to-red-500/10 hover:from-rose-500/20 hover:to-red-500/20 dark:from-rose-500/20 dark:to-red-500/20 dark:hover:from-rose-500/30 dark:hover:to-red-500/30 text-rose-700 dark:text-rose-400 rounded-xl transition-all duration-200 hover:shadow-lg"
      >
        Sign Out
      </button>
    </form>
  )
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user?.is_admin) {
    redirect('/test')
  }

  return (
    <>
      <GradientBackground />
      <div className="relative min-h-screen">
        {/* Navigation - Glassmorphic Premium */}
        <nav className="sticky top-0 z-50 glass-premium border-b border-white/20 dark:border-slate-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center space-x-8">
                <Link href="/admin" className="group">
                  <h1 className="text-2xl font-bold gradient-text flex items-center gap-2">
                    <span className="text-3xl group-hover:scale-110 transition-transform duration-200">🪝</span>
                    Hook Tester
                  </h1>
                </Link>

                <div className="hidden md:flex space-x-2">
                  <NavLink href="/admin" label="All Hooks" />
                  <NavLink href="/admin/hooks/new" label="Add New" />
                  <NavLink href="/admin/hooks/import" label="Bulk Import" />
                  <NavLink href="/admin/flagged" label="Flagged" />
                  <NavLink href="/test" label="Test Interface" />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <ThemeToggle />
                <div className="glass px-4 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hidden md:block">
                  {user.email}
                </div>
                <SignOutButton />
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {children}
        </main>
      </div>
    </>
  )
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group relative px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all duration-200 hover:bg-white/50 dark:hover:bg-slate-800/50"
    >
      {label}
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 group-hover:w-3/4 transition-all duration-300 rounded-full" />
    </Link>
  )
}
