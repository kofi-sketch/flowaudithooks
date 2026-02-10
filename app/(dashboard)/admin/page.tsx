import { getAllHooks } from '@/lib/actions/hooks'
import HookStatsTable from '@/components/hooks/hook-stats-table'
import Link from 'next/link'

export default async function AdminDashboard() {
  const hooks = await getAllHooks()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hook Library</h1>
          <p className="text-gray-600 mt-1">
            Manage and monitor your marketing hooks
          </p>
        </div>

        <Link
          href="/admin/hooks/new"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors"
        >
          + Add New Hook
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600">Total Hooks</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">
            {hooks.length}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600">Total Votes</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">
            {hooks.reduce((sum, hook) => sum + hook.total_votes, 0)}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600">Flagged Hooks</div>
          <div className="text-3xl font-bold text-red-600 mt-2">
            {hooks.filter(hook => hook.is_flagged).length}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600">Avg Success Rate</div>
          <div className="text-3xl font-bold text-green-600 mt-2">
            {hooks.length > 0
              ? (
                  hooks.reduce((sum, hook) => sum + Number(hook.green_percentage), 0) /
                  hooks.length
                ).toFixed(0)
              : 0}%
          </div>
        </div>
      </div>

      {/* Hooks Table */}
      {hooks.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 text-lg mb-4">
            No hooks yet. Add your first hook to get started!
          </p>
          <Link
            href="/admin/hooks/new"
            className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors"
          >
            Add Your First Hook
          </Link>
        </div>
      ) : (
        <HookStatsTable hooks={hooks} />
      )}
    </div>
  )
}
