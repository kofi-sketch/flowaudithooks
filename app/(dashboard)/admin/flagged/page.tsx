import { getFlaggedHooks } from '@/lib/actions/hooks'
import HookStatsTable from '@/components/hooks/hook-stats-table'
import Link from 'next/link'
import Button from '@/components/ui/button'
import { ArrowLeft, AlertTriangle } from 'lucide-react'

export default async function FlaggedHooksPage() {
  const flaggedHooks = await getFlaggedHooks()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-semibold text-white mb-2">Flagged Hooks</h1>
          <p className="text-base text-[#a0a0a0]">
            Hooks with less than 40% positive votes after 10+ votes
          </p>
        </div>

        <Link href="/admin">
          <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
            Back to All Hooks
          </Button>
        </Link>
      </div>

      {/* Info Banner */}
      <div className="crm-card bg-[#2a2a2a]">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-[#a0a0a0] flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-white mb-2">About Flagged Hooks</h3>
            <p className="text-sm text-[#a0a0a0] mb-3">
              These hooks have underperformed based on user feedback. Review them to decide whether to:
            </p>
            <ul className="text-sm text-[#a0a0a0] space-y-1.5">
              <li>• <strong className="text-white">Delete</strong> - Remove permanently if consistently poor</li>
              <li>• <strong className="text-white">Unflag</strong> - Keep active if you want to give it more chances</li>
              <li>• <strong className="text-white">Edit</strong> - Revise the hook text and test again (coming soon)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Flagged Hooks Table */}
      {flaggedHooks.length === 0 ? (
        <div className="crm-card text-center py-16">
          <h2 className="text-2xl font-semibold text-white mb-2">
            No Flagged Hooks!
          </h2>
          <p className="text-base text-[#a0a0a0] mb-8">
            All your hooks are performing well. Great job!
          </p>
          <Link href="/admin">
            <Button variant="primary" size="lg">
              View All Hooks
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="px-4 py-3 bg-[#2a2a2a] border border-[#353535] rounded-lg">
            <p className="text-sm text-white">
              <strong>{flaggedHooks.length}</strong> {flaggedHooks.length === 1 ? 'hook' : 'hooks'} flagged for review
            </p>
          </div>

          <HookStatsTable hooks={flaggedHooks} />
        </>
      )}
    </div>
  )
}
