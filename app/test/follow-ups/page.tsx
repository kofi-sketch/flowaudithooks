import { getRandomHook, getTopContentToday, getTopContentThisWeek } from '@/lib/actions/hooks'
import HookCard from '@/components/hooks/hook-card'
import TopContent from '@/components/hooks/top-content'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/actions/auth'
import Button from '@/components/ui/button'
import { Bookmark, LayoutDashboard } from 'lucide-react'

export default async function TestFollowUpsPage() {
  const initialHook = await getRandomHook([], 'followup')
  const topToday = await getTopContentToday('followup')
  const topWeek = await getTopContentThisWeek('followup')

  if (!initialHook) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center px-4">
        <div className="crm-card text-center space-y-6 max-w-2xl animate-[scale-in_0.5s_ease-out]">
          <h1 className="text-4xl md:text-5xl font-semibold text-white">
            No Follow-ups Available
          </h1>
          <p className="text-lg text-[#a0a0a0]">
            There are no follow-ups in the system yet. Please ask an admin to add some follow-ups.
          </p>
        </div>
      </div>
    )
  }

  const user = await getCurrentUser()

  return (
    <div className="min-h-screen bg-[#1a1a1a] px-4 py-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div className="animate-[slide-up_0.5s_ease-out]">
            <h1 className="text-4xl md:text-5xl font-semibold text-white mb-3">
              Follow-up Tester
            </h1>
            <p className="text-lg text-[#a0a0a0]">
              Vote on marketing follow-ups to find the winners
            </p>
          </div>

          <div className="flex items-center gap-3 animate-[slide-up_0.5s_ease-out_0.1s] opacity-0" style={{ animation: 'slide-up 0.5s ease-out 0.1s forwards' }}>
            {user && (
              <Link href="/saved">
                <Button variant="outline" size="md" icon={<Bookmark className="w-4 h-4" />}>
                  Saved
                </Button>
              </Link>
            )}
            {user?.is_admin && (
              <Link href="/admin">
                <Button variant="primary" size="md" icon={<LayoutDashboard className="w-4 h-4" />}>
                  Dashboard
                </Button>
              </Link>
            )}
            {user ? (
              <div className="px-4 py-2 bg-[#2d2d2d] border border-[#353535] rounded-lg text-sm font-medium text-white hidden sm:block">
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
        <HookCard initialHook={initialHook} contentType="followup" />
      </div>

      {/* Top Content Section */}
      <div className="max-w-6xl mx-auto mt-16 animate-[slide-up_0.5s_ease-out_0.2s] opacity-0" style={{ animation: 'slide-up 0.5s ease-out 0.2s forwards' }}>
        <TopContent
          todayContent={topToday}
          weekContent={topWeek}
          contentType="followup"
        />
      </div>

      {/* Instructions */}
      <div className="max-w-2xl mx-auto mt-16 animate-[slide-up_0.5s_ease-out_0.3s] opacity-0" style={{ animation: 'slide-up 0.5s ease-out 0.3s forwards' }}>
        <div className="crm-card">
          <h2 className="text-xl font-semibold text-white mb-6">
            How It Works
          </h2>
          <ul className="space-y-4 text-[#a0a0a0]">
            <li className="flex items-start gap-4 p-4 rounded-lg bg-[#2a2a2a] border border-[#353535]">
              <span className="text-white">✓</span>
              <span className="flex-1">
                Click <strong className="text-white">"This Hook Works"</strong> if the follow-up caught your attention and would make you engage
              </span>
            </li>
            <li className="flex items-start gap-4 p-4 rounded-lg bg-[#2a2a2a] border border-[#353535]">
              <span className="text-white">✗</span>
              <span className="flex-1">
                Click <strong className="text-white">"Needs Improvement"</strong> if the follow-up feels weak or uninteresting
              </span>
            </li>
            <li className="flex items-start gap-4 p-4 rounded-lg bg-[#2a2a2a] border border-[#353535]">
              <span className="text-white">★</span>
              <span className="flex-1">
                Click <strong className="text-white">"Save Hook"</strong> to bookmark follow-ups you like. Access them anytime from the Saved page!
              </span>
            </li>
            <li className="flex items-start gap-4 p-4 rounded-lg bg-[#2a2a2a] border border-[#353535]">
              <span className="text-white">→</span>
              <span className="flex-1">
                Click <strong className="text-white">"Skip this hook"</strong> to see a different follow-up without voting
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
