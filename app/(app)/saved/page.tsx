'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSavedHooks, unsaveHook } from '@/lib/actions/saved-hooks'
import { getCurrentUser } from '@/lib/actions/auth'
import type { ContentType } from '@/lib/types/database'
import { CONTENT_TYPE_LABELS } from '@/lib/constants/content-types'
import { toast } from 'sonner'
import Button from '@/components/ui/button'
import LoadingSpinner from '@/components/ui/loading-spinner'
import Link from 'next/link'
import { ArrowLeft, Bookmark } from 'lucide-react'

interface SavedHook {
  id: string
  created_at: string
  hook_id: string
  content_type: ContentType
  hooks: {
    id: string
    text: string
    total_votes: number
    green_votes: number
    red_votes: number
    green_percentage: number
    is_flagged: boolean
    created_at: string
    content_type: ContentType
  }
}

type FilterType = ContentType | 'all'

export default function SavedHooksPage() {
  const router = useRouter()
  const [savedHooks, setSavedHooks] = useState<SavedHook[]>([])
  const [contentTypeFilter, setContentTypeFilter] = useState<FilterType>('all')
  const [loading, setLoading] = useState(true)

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser()
      if (!user) {
        router.push('/login')
      }
    }
    checkAuth()
  }, [router])

  useEffect(() => {
    loadSavedHooks()
  }, [contentTypeFilter])

  const loadSavedHooks = async () => {
    setLoading(true)
    try {
      const filterType = contentTypeFilter === 'all' ? undefined : contentTypeFilter
      const result = await getSavedHooks(filterType)
      if (result.data) {
        // Transform Supabase data to match our interface
        const transformedData = result.data
          .map((item: any) => ({
            id: item.id,
            created_at: item.created_at,
            hook_id: item.hook_id,
            content_type: item.content_type,
            hooks: Array.isArray(item.hooks) ? item.hooks[0] : item.hooks
          }))
          .filter((item: any) => item.hooks) as SavedHook[]

        setSavedHooks(transformedData)
      } else if (result.error) {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('Failed to load saved hooks')
    } finally {
      setLoading(false)
    }
  }

  const handleUnsave = async (hookId: string) => {
    try {
      const result = await unsaveHook(hookId)
      if ('error' in result) {
        toast.error(result.error)
      } else {
        setSavedHooks(prev => prev.filter(sh => sh.hook_id !== hookId))
        toast.success('Content unsaved')
      }
    } catch (error) {
      toast.error('Failed to unsave content')
    }
  }

  return (
    <div className="space-y-8">
      {/* Header with Filter */}
      <div className="animate-[slide-up_0.5s_ease-out]">
        <div className="mb-4">
          <Link href="/test/hooks">
            <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
              Back to Testing
            </Button>
          </Link>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-[32px] font-semibold text-white mb-2 flex items-center gap-3">
              <Bookmark className="w-8 h-8" />
              Saved Content
            </h1>
            <p className="text-base text-[#a0a0a0]">
              Your bookmarked marketing content
            </p>
          </div>

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
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : savedHooks.length === 0 ? (
        <div className="crm-card text-center py-16 animate-[scale-in_0.5s_ease-out]">
          <h2 className="text-2xl font-semibold text-white mb-4">
            No saved {contentTypeFilter === 'all' ? 'content' : CONTENT_TYPE_LABELS[contentTypeFilter].toLowerCase()} yet
          </h2>
          <p className="text-base text-[#a0a0a0] mb-8">
            Save content while testing to keep track of your favorites!
          </p>
          <Link href="/test/hooks">
            <Button variant="primary" size="lg">
              Start Testing
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 animate-[slide-up_0.5s_ease-out]">
          {savedHooks.map((savedHook, index) => (
            <div
              key={savedHook.id}
              className="crm-card crm-hover"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                {/* Hook Text */}
                <div className="flex-1">
                  <p className="text-xl font-normal text-white mb-4 leading-relaxed">
                    {savedHook.hooks.text}
                  </p>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-3">
                    <div className="px-3 py-1.5 rounded-lg bg-[#2a2a2a] border border-[#353535]">
                      <span className="text-sm font-medium text-white">
                        {CONTENT_TYPE_LABELS[savedHook.content_type]}
                      </span>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-[#353535] border border-[#404040]">
                      <span className="text-sm text-white">
                        {savedHook.hooks.total_votes} votes
                      </span>
                    </div>
                    {savedHook.hooks.total_votes > 0 && (
                      <div className="px-3 py-1.5 rounded-lg bg-[#353535] border border-[#404040]">
                        <span className="text-sm font-medium text-white">
                          {savedHook.hooks.green_percentage.toFixed(0)}% positive
                        </span>
                      </div>
                    )}
                    {savedHook.hooks.is_flagged && (
                      <div className="px-3 py-1.5 rounded-lg bg-[#353535] border border-[#404040]">
                        <span className="text-sm font-medium text-[#a0a0a0]">
                          Flagged
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleUnsave(savedHook.hook_id)}
                    variant="danger"
                    size="md"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
