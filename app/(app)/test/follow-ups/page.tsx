import { getRandomHook, getTopContentToday, getTopContentThisWeek } from '@/lib/actions/hooks'
import HookCard from '@/components/hooks/hook-card'
import TopContent from '@/components/hooks/top-content'

export default async function TestFollowUpsPage() {
  const initialHook = await getRandomHook([], 'followup')
  const topToday = await getTopContentToday('followup')
  const topWeek = await getTopContentThisWeek('followup')

  if (!initialHook) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="crm-card space-y-6">
          <h1 className="text-4xl font-semibold text-white">
            No Follow-ups Available
          </h1>
          <p className="text-lg text-[#a0a0a0]">
            There are no follow-ups in the system yet. Please ask an admin to add some follow-ups.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-semibold text-white mb-3">
          Follow-up Tester
        </h1>
        <p className="text-lg text-[#a0a0a0]">
          Vote on cold call follow-ups to find the winners
        </p>
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
