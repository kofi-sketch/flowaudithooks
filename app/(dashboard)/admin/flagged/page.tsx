import { getFlaggedHooks } from '@/lib/actions/hooks'
import HookStatsTable from '@/components/hooks/hook-stats-table'
import Link from 'next/link'

export default async function FlaggedHooksPage() {
  const flaggedHooks = await getFlaggedHooks()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Flagged Hooks</h1>
          <p className="text-gray-600 mt-1">
            Hooks with less than 40% positive votes after 10+ votes
          </p>
        </div>

        <Link
          href="/admin"
          className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
        >
          ← Back to All Hooks
        </Link>
      </div>

      {/* Info Banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="font-semibold text-yellow-900">About Flagged Hooks</h3>
            <p className="text-sm text-yellow-800 mt-1">
              These hooks have underperformed based on user feedback. Review them to decide whether to:
            </p>
            <ul className="text-sm text-yellow-800 mt-2 space-y-1 ml-4">
              <li>• <strong>Delete</strong> - Remove permanently if consistently poor</li>
              <li>• <strong>Unflag</strong> - Keep active if you want to give it more chances</li>
              <li>• <strong>Edit</strong> - Revise the hook text and test again (coming soon)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Flagged Hooks Table */}
      {flaggedHooks.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <span className="text-6xl mb-4 block">🎉</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Flagged Hooks!
          </h2>
          <p className="text-gray-600">
            All your hooks are performing well. Great job!
          </p>
          <Link
            href="/admin"
            className="inline-block mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors"
          >
            View All Hooks
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              <strong>{flaggedHooks.length}</strong> {flaggedHooks.length === 1 ? 'hook' : 'hooks'} flagged for review
            </p>
          </div>

          <HookStatsTable hooks={flaggedHooks} />
        </>
      )}
    </div>
  )
}
