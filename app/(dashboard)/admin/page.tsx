import { getAllHooks } from '@/lib/actions/hooks'
import HookStatsTable from '@/components/hooks/hook-stats-table'
import Link from 'next/link'
import StatsCard from '@/components/ui/stats-card'
import Button from '@/components/ui/button'

export default async function AdminDashboard() {
  const hooks = await getAllHooks()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-6">
        <div className="animate-[slide-up_0.4s_ease-out]">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">
            Hook Library
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Manage and monitor your marketing hooks
          </p>
        </div>

        <Link href="/admin/hooks/new" className="animate-[slide-up_0.4s_ease-out_0.1s] opacity-0" style={{ animation: 'slide-up 0.4s ease-out 0.1s forwards' }}>
          <Button variant="primary" size="lg">
            <span className="text-2xl">+</span>
            Add New Hook
          </Button>
        </Link>
      </div>

      {/* Stats Overview - Premium Animated Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="animate-[slide-up_0.5s_ease-out_0.1s] opacity-0" style={{ animation: 'slide-up 0.5s ease-out 0.1s forwards' }}>
          <StatsCard
            label="Total Hooks"
            value={hooks.length}
            icon="🪝"
            variant="default"
          />
        </div>

        <div className="animate-[slide-up_0.5s_ease-out_0.2s] opacity-0" style={{ animation: 'slide-up 0.5s ease-out 0.2s forwards' }}>
          <StatsCard
            label="Total Votes"
            value={hooks.reduce((sum, hook) => sum + hook.total_votes, 0)}
            icon="📊"
            variant="info"
          />
        </div>

        <div className="animate-[slide-up_0.5s_ease-out_0.3s] opacity-0" style={{ animation: 'slide-up 0.5s ease-out 0.3s forwards' }}>
          <StatsCard
            label="Flagged Hooks"
            value={hooks.filter(hook => hook.is_flagged).length}
            icon="🚩"
            variant="error"
          />
        </div>

        <div className="animate-[slide-up_0.5s_ease-out_0.4s] opacity-0" style={{ animation: 'slide-up 0.5s ease-out 0.4s forwards' }}>
          <StatsCard
            label="Avg Success Rate"
            value={
              hooks.length > 0
                ? Number(
                    (
                      hooks.reduce((sum, hook) => sum + Number(hook.green_percentage), 0) /
                      hooks.length
                    ).toFixed(0)
                  )
                : 0
            }
            suffix="%"
            icon="🎯"
            variant="success"
          />
        </div>
      </div>

      {/* Hooks Table */}
      <div className="animate-[slide-up_0.5s_ease-out_0.5s] opacity-0" style={{ animation: 'slide-up 0.5s ease-out 0.5s forwards' }}>
        {hooks.length === 0 ? (
          <div className="glass-premium rounded-3xl p-16 text-center">
            <div className="text-6xl mb-6">🪝</div>
            <p className="text-xl text-slate-700 dark:text-slate-300 mb-8">
              No hooks yet. Add your first hook to get started!
            </p>
            <Link href="/admin/hooks/new">
              <Button variant="primary" size="xl">
                <span className="text-2xl">+</span>
                Add Your First Hook
              </Button>
            </Link>
          </div>
        ) : (
          <HookStatsTable hooks={hooks} />
        )}
      </div>
    </div>
  )
}
