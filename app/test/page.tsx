import { getRandomHook } from '@/lib/actions/hooks'
import { redirect } from 'next/navigation'
import HookCard from '@/components/hooks/hook-card'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/actions/auth'
import GradientBackground from '@/components/ui/gradient-background'
import Button from '@/components/ui/button'
import ThemeToggle from '@/components/ui/theme-toggle'

export default async function TestPage() {
  const initialHook = await getRandomHook()

  if (!initialHook) {
    return (
      <>
        <GradientBackground />
        <div className="relative min-h-screen flex items-center justify-center px-4">
          <div className="glass-premium rounded-3xl p-12 text-center space-y-6 max-w-2xl animate-[scale-in_0.5s_ease-out]">
            <div className="text-6xl mb-4">🪝</div>
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">
              No Hooks Available
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              There are no hooks in the system yet. Please ask an admin to add some hooks.
            </p>
          </div>
        </div>
      </>
    )
  }

  const user = await getCurrentUser()

  return (
    <>
      <GradientBackground />
      <div className="relative min-h-screen px-4 py-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="animate-[slide-up_0.5s_ease-out]">
              <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-3">
                Hook Tester
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Vote on marketing hooks to find the winners
              </p>
            </div>

            <div className="flex items-center gap-3 animate-[slide-up_0.5s_ease-out_0.1s] opacity-0" style={{ animation: 'slide-up 0.5s ease-out 0.1s forwards' }}>
              <ThemeToggle />
              {user && (
                <Link href="/saved">
                  <Button variant="warning" size="md">
                    <span className="text-xl mr-2">💾</span>
                    Saved
                  </Button>
                </Link>
              )}
              {user?.is_admin && (
                <Link href="/admin">
                  <Button variant="primary" size="md">
                    Admin Dashboard
                  </Button>
                </Link>
              )}
              {user ? (
                <div className="glass px-4 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:block">
                  {user.email}
                </div>
              ) : (
                <Link href="/login">
                  <Button variant="secondary" size="md">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <HookCard initialHook={initialHook} />
        </div>

        {/* Instructions */}
        <div className="max-w-2xl mx-auto mt-16 animate-[slide-up_0.5s_ease-out_0.3s] opacity-0" style={{ animation: 'slide-up 0.5s ease-out 0.3s forwards' }}>
          <div className="glass-premium rounded-2xl p-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-3">
              <span className="text-2xl">📖</span>
              How It Works
            </h2>
            <ul className="space-y-4 text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 dark:from-emerald-500/20 dark:to-green-500/20">
                <span className="text-3xl">✅</span>
                <span className="flex-1 pt-1">
                  Click <strong className="font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">"Worked!"</strong> if the hook caught your attention and would make you engage
                </span>
              </li>
              <li className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-rose-500/10 to-red-500/10 dark:from-rose-500/20 dark:to-red-500/20">
                <span className="text-3xl">❌</span>
                <span className="flex-1 pt-1">
                  Click <strong className="font-bold bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent">"Didn't Work"</strong> if the hook feels weak or uninteresting
                </span>
              </li>
              <li className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20">
                <span className="text-3xl">⭐</span>
                <span className="flex-1 pt-1">
                  Click <strong className="font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">"Save"</strong> to bookmark hooks you like. Access them anytime from the Saved page!
                </span>
              </li>
              <li className="flex items-start gap-4 p-4 rounded-xl bg-slate-100/50 dark:bg-slate-800/30">
                <span className="text-3xl">→</span>
                <span className="flex-1 pt-1">
                  Click <strong className="font-bold text-slate-700 dark:text-slate-300">"Skip"</strong> to see a different hook without voting
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
