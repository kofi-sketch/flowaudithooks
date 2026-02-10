'use client'

import { useEffect, useState } from 'react'
import { getAllHooksByType } from '@/lib/actions/hooks'
import HookStatsTable from '@/components/hooks/hook-stats-table'
import Link from 'next/link'
import { MetricCard } from '@/components/ui/metric-card'
import Button from '@/components/ui/button'
import { calculateDashboardMetrics } from '@/lib/utils/metrics'
import { TestTube, TrendingUp, BarChart3, FolderOpen } from 'lucide-react'
import type { Hook, ContentType } from '@/lib/types/database'
import { CONTENT_TYPE_LABELS } from '@/lib/constants/content-types'

type FilterType = ContentType | 'all'

export default function AdminDashboard() {
  const [hooks, setHooks] = useState<Hook[]>([])
  const [contentTypeFilter, setContentTypeFilter] = useState<FilterType>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadHooks() {
      setLoading(true)
      const filterType = contentTypeFilter === 'all' ? undefined : contentTypeFilter
      const data = await getAllHooksByType(filterType)
      setHooks(data)
      setLoading(false)
    }
    loadHooks()
  }, [contentTypeFilter])

  const metrics = calculateDashboardMetrics(hooks)

  const filterLabel = contentTypeFilter === 'all'
    ? 'All Content'
    : CONTENT_TYPE_LABELS[contentTypeFilter]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-6">
        <div className="animate-[slide-up_0.4s_ease-out]">
          <h1 className="text-[32px] font-semibold text-white mb-2">
            Library
          </h1>
          <p className="text-base text-[#a0a0a0]">
            Manage and monitor your marketing content
          </p>
        </div>

        <div className="flex items-center gap-3 animate-[slide-up_0.4s_ease-out_0.1s] opacity-0" style={{ animation: 'slide-up 0.4s ease-out 0.1s forwards' }}>
          {/* Content Type Filter */}
          <select
            value={contentTypeFilter}
            onChange={(e) => setContentTypeFilter(e.target.value as FilterType)}
            className="px-4 py-2 bg-[#2d2d2d] border border-[#353535] rounded-lg text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <option value="all">All Content</option>
            <option value="hook">Hooks</option>
            <option value="bridge">Bridges</option>
            <option value="followup">Follow-ups</option>
          </select>

          <Link href="/admin/hooks/new">
            <Button variant="primary" size="md">
              Add New Content
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="animate-[slide-up_0.5s_ease-out_0.1s] opacity-0" style={{ animation: 'slide-up 0.5s ease-out 0.1s forwards' }}>
          <MetricCard
            title={`Total ${filterLabel}`}
            value={metrics.totalHooks}
            icon={<TestTube className="w-6 h-6" />}
          />
        </div>

        <div className="animate-[slide-up_0.5s_ease-out_0.2s] opacity-0" style={{ animation: 'slide-up 0.5s ease-out 0.2s forwards' }}>
          <MetricCard
            title={`Winning ${filterLabel}`}
            value={metrics.winningPercentage}
            icon={<TrendingUp className="w-6 h-6" />}
          />
        </div>

        <div className="animate-[slide-up_0.5s_ease-out_0.3s] opacity-0" style={{ animation: 'slide-up 0.5s ease-out 0.3s forwards' }}>
          <MetricCard
            title="Avg Votes per Item"
            value={metrics.avgVotesPerHook}
            icon={<BarChart3 className="w-6 h-6" />}
          />
        </div>

        <div className="animate-[slide-up_0.5s_ease-out_0.4s] opacity-0" style={{ animation: 'slide-up 0.5s ease-out 0.4s forwards' }}>
          <MetricCard
            title="Content Type"
            value={metrics.topCategory}
            icon={<FolderOpen className="w-6 h-6" />}
          />
        </div>
      </div>

      {/* Hooks Table */}
      <div className="animate-[slide-up_0.5s_ease-out_0.5s] opacity-0" style={{ animation: 'slide-up 0.5s ease-out 0.5s forwards' }}>
        {loading ? (
          <div className="crm-card text-center py-16">
            <p className="text-xl text-[#a0a0a0]">Loading...</p>
          </div>
        ) : hooks.length === 0 ? (
          <div className="crm-card text-center py-16">
            <p className="text-xl text-[#a0a0a0] mb-8">
              No {filterLabel.toLowerCase()} yet. Add your first item to get started!
            </p>
            <Link href="/admin/hooks/new">
              <Button variant="primary" size="lg">
                Add Your First Item
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
