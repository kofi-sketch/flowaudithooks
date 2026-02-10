'use client'

import { useState } from 'react'
import { deleteHook, unflagHook } from '@/lib/actions/hooks'
import { toast } from 'sonner'
import type { Hook } from '@/lib/types/database'

interface HookStatsTableProps {
  hooks: Hook[]
}

export default function HookStatsTable({ hooks: initialHooks }: HookStatsTableProps) {
  const [hooks, setHooks] = useState(initialHooks)
  const [sortField, setSortField] = useState<keyof Hook>('created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleSort = (field: keyof Hook) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const sortedHooks = [...hooks].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (aValue === null || aValue === undefined) return 1
    if (bValue === null || bValue === undefined) return -1

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  const handleDelete = async (id: string, text: string) => {
    if (!confirm(`Are you sure you want to delete this hook?\n\n"${text}"`)) {
      return
    }

    setDeletingId(id)
    try {
      const result = await deleteHook(id)

      if (result.success) {
        setHooks(hooks.filter(h => h.id !== id))
        toast.success('Hook deleted successfully')
      } else {
        toast.error(result.error || 'Failed to delete hook')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setDeletingId(null)
    }
  }

  const handleUnflag = async (id: string) => {
    try {
      const result = await unflagHook(id)

      if (result.success && result.data) {
        setHooks(hooks.map(h => h.id === id ? result.data! : h))
        toast.success('Hook unflagged')
      } else {
        toast.error(result.error || 'Failed to unflag hook')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const SortButton = ({ field, label }: { field: keyof Hook; label: string }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-2 hover:text-white transition-colors"
    >
      <span className="font-medium">{label}</span>
      {sortField === field && (
        <span className="text-lg">
          {sortDirection === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </button>
  )

  return (
    <div className="bg-[#2d2d2d] border border-[#353535] rounded-xl overflow-hidden shadow-crm-md">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-[#353535]">
              <th className="px-6 py-4 text-left text-xs text-[#a0a0a0] uppercase tracking-wider bg-[#2a2a2a]">
                <SortButton field="text" label="Hook Text" />
              </th>
              <th className="px-6 py-4 text-left text-xs text-[#a0a0a0] uppercase tracking-wider bg-[#2a2a2a]">
                <SortButton field="total_votes" label="Total Votes" />
              </th>
              <th className="px-6 py-4 text-left text-xs text-[#a0a0a0] uppercase tracking-wider bg-[#2a2a2a]">
                <SortButton field="green_votes" label="Green" />
              </th>
              <th className="px-6 py-4 text-left text-xs text-[#a0a0a0] uppercase tracking-wider bg-[#2a2a2a]">
                <SortButton field="red_votes" label="Red" />
              </th>
              <th className="px-6 py-4 text-left text-xs text-[#a0a0a0] uppercase tracking-wider bg-[#2a2a2a]">
                <SortButton field="green_percentage" label="Success Rate" />
              </th>
              <th className="px-6 py-4 text-left text-xs text-[#a0a0a0] uppercase tracking-wider bg-[#2a2a2a]">
                <SortButton field="is_flagged" label="Status" />
              </th>
              <th className="px-6 py-4 text-right text-xs text-[#a0a0a0] uppercase tracking-wider bg-[#2a2a2a]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#353535]">
            {sortedHooks.map((hook, index) => (
              <tr
                key={hook.id}
                className={`transition-colors duration-150 hover:bg-[#353535] ${
                  index % 2 === 0 ? 'bg-[#2d2d2d]' : 'bg-[#2a2a2a]'
                }`}
              >
                <td className="px-6 py-4">
                  <div className="text-sm text-white max-w-md leading-relaxed">
                    {hook.text}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-white">{hook.total_votes}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="inline-flex items-center px-3 py-1 rounded-lg bg-[#353535] border border-[#404040]">
                    <span className="text-sm font-medium text-white">
                      {hook.green_votes}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="inline-flex items-center px-3 py-1 rounded-lg bg-[#353535] border border-[#404040]">
                    <span className="text-sm font-medium text-white">
                      {hook.red_votes}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-[#353535] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#a0a0a0] transition-all duration-500"
                        style={{ width: `${hook.green_percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-white">
                      {hook.green_percentage.toFixed(0)}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {hook.is_flagged ? (
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 text-xs font-medium rounded-lg border border-[#404040] text-[#a0a0a0]">
                        Flagged
                      </span>
                      <button
                        onClick={() => handleUnflag(hook.id)}
                        className="text-xs font-medium text-[#a0a0a0] hover:text-white transition-colors"
                      >
                        Unflag
                      </button>
                    </div>
                  ) : (
                    <span className="px-3 py-1 text-xs font-medium rounded-lg border border-[#404040] text-white">
                      Active
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => handleDelete(hook.id, hook.text)}
                    disabled={deletingId === hook.id}
                    className="px-4 py-2 text-sm font-medium text-[#ff6b6b] bg-[#2d2d2d] border border-[#404040] rounded-lg hover:brightness-110 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === hook.id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
