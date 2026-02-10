import { getAllHooks } from '@/lib/actions/hooks'
import HookStatsTable from '@/components/hooks/hook-stats-table'
import Link from 'next/link'
import { MetricCard } from '@/components/ui/metric-card'
import Button from '@/components/ui/button'
import { calculateDashboardMetrics } from '@/lib/utils/metrics'
import { TestTube, TrendingUp, BarChart3, FolderOpen } from 'lucide-react'

export default async function AdminDashboard() {
  const hooks = await getAllHooks()
  const metrics = calculateDashboardMetrics(hooks)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-6">
        <div className="animate-[slide-up_0.4s_ease-out]">
          <h1 className="text-[32px] font-semibold text-white mb-2">
            Hook Library
          </h1>
          <p className="text-base text-[#a0a0a0]">
            Manage and monitor your marketing hooks
          </p>
        </div>

        <Link href="/admin/hooks/new" className="animate-[slide-up_0.4s_ease-out_0.1s] opacity-0" style={{ animation: 'slide-up 0.4s ease-out 0.1s forwards' }}>
          <Button variant="primary" size="md">
            Add New Hook
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="animate-[slide-up_0.5s_ease-out_0.1s] opacity-0" style={{ animation: 'slide-up 0.5s ease-out 0.1s forwards' }}>
          <MetricCard
            title="Total Hooks Tested"
            value={metrics.totalHooks}
            icon={<TestTube className="w-6 h-6" />}
          />
        </div>

        <div className="animate-[slide-up_0.5s_ease-out_0.2s] opacity-0" style={{ animation: 'slide-up 0.5s ease-out 0.2s forwards' }}>
          <MetricCard
            title="Winning Hooks"
            value={metrics.winningPercentage}
            subtitle=">50% success rate"
            icon={<TrendingUp className="w-6 h-6" />}
          />
        </div>

        <div className="animate-[slide-up_0.5s_ease-out_0.3s] opacity-0" style={{ animation: 'slide-up 0.5s ease-out 0.3s forwards' }}>
          <MetricCard
            title="Avg Votes per Hook"
            value={metrics.avgVotesPerHook}
            icon={<BarChart3 className="w-6 h-6" />}
          />
        </div>

        <div className="animate-[slide-up_0.5s_ease-out_0.4s] opacity-0" style={{ animation: 'slide-up 0.5s ease-out 0.4s forwards' }}>
          <MetricCard
            title="Top Category"
            value={metrics.topCategory}
            icon={<FolderOpen className="w-6 h-6" />}
          />
        </div>
      </div>

      {/* Hooks Table */}
      <div className="animate-[slide-up_0.5s_ease-out_0.5s] opacity-0" style={{ animation: 'slide-up 0.5s ease-out 0.5s forwards' }}>
        {hooks.length === 0 ? (
          <div className="crm-card text-center py-16">
            <p className="text-xl text-[#a0a0a0] mb-8">
              No hooks yet. Add your first hook to get started!
            </p>
            <Link href="/admin/hooks/new">
              <Button variant="primary" size="lg">
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
