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
      className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
    >
      {label}
      {sortField === field && (
        <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
      )}
    </button>
  )

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="text" label="Hook Text" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="total_votes" label="Total Votes" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="green_votes" label="Green" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="red_votes" label="Red" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="green_percentage" label="Success Rate" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="is_flagged" label="Status" />
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedHooks.map((hook) => (
              <tr key={hook.id} className={hook.is_flagged ? 'bg-red-50' : ''}>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-md">{hook.text}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{hook.total_votes}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-green-600 font-medium">{hook.green_votes}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-red-600 font-medium">{hook.red_votes}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className={`text-sm font-semibold ${
                      hook.green_percentage >= 60
                        ? 'text-green-600'
                        : hook.green_percentage >= 40
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {hook.green_percentage.toFixed(0)}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {hook.is_flagged ? (
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        Flagged
                      </span>
                      <button
                        onClick={() => handleUnflag(hook.id)}
                        className="text-xs text-indigo-600 hover:text-indigo-800"
                      >
                        Unflag
                      </button>
                    </div>
                  ) : (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDelete(hook.id, hook.text)}
                    disabled={deletingId === hook.id}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
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
