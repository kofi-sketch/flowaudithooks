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
      className="flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
    >
      <span className="font-semibold">{label}</span>
      {sortField === field && (
        <span className="text-lg transition-transform duration-300 group-hover:scale-110">
          {sortDirection === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </button>
  )

  return (
    <div className="glass-premium rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent">
                <SortButton field="text" label="Hook Text" />
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent">
                <SortButton field="total_votes" label="Total Votes" />
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent">
                <SortButton field="green_votes" label="Green" />
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent">
                <SortButton field="red_votes" label="Red" />
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent">
                <SortButton field="green_percentage" label="Success Rate" />
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent">
                <SortButton field="is_flagged" label="Status" />
              </th>
              <th className="px-6 py-5 text-right text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {sortedHooks.map((hook, index) => (
              <tr
                key={hook.id}
                className={`transition-all duration-200 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-transparent dark:hover:from-indigo-900/20 dark:hover:to-transparent ${
                  hook.is_flagged ? 'bg-rose-50/50 dark:bg-rose-900/10' : index % 2 === 0 ? 'bg-slate-50/30 dark:bg-slate-800/20' : ''
                }`}
              >
                <td className="px-6 py-5">
                  <div className="text-sm font-medium text-slate-900 dark:text-slate-100 max-w-md leading-relaxed">
                    {hook.text}
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{hook.total_votes}</div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500/10 to-green-500/10 dark:from-emerald-500/20 dark:to-green-500/20">
                    <span className="text-sm font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                      {hook.green_votes}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-rose-500/10 to-red-500/10 dark:from-rose-500/20 dark:to-red-500/20">
                    <span className="text-sm font-bold bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent">
                      {hook.red_votes}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          hook.green_percentage >= 60
                            ? 'bg-gradient-to-r from-emerald-500 to-green-600'
                            : hook.green_percentage >= 40
                            ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                            : 'bg-gradient-to-r from-rose-500 to-red-600'
                        }`}
                        style={{ width: `${hook.green_percentage}%` }}
                      />
                    </div>
                    <span
                      className={`text-sm font-bold ${
                        hook.green_percentage >= 60
                          ? 'text-green-600 dark:text-green-400'
                          : hook.green_percentage >= 40
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {hook.green_percentage.toFixed(0)}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  {hook.is_flagged ? (
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-rose-500/20 to-red-500/20 text-rose-700 dark:text-rose-300 shadow-sm">
                        🚩 Flagged
                      </span>
                      <button
                        onClick={() => handleUnflag(hook.id)}
                        className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                      >
                        Unflag
                      </button>
                    </div>
                  ) : (
                    <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-700 dark:text-emerald-300 shadow-sm">
                      ✓ Active
                    </span>
                  )}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-right">
                  <button
                    onClick={() => handleDelete(hook.id, hook.text)}
                    disabled={deletingId === hook.id}
                    className="px-4 py-2 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:text-white hover:bg-gradient-to-r hover:from-rose-500 hover:to-red-600 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
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
