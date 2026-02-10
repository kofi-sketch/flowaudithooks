'use client'

import { useState, useEffect } from 'react'
import { submitVote } from '@/lib/actions/votes'
import { getRandomHook } from '@/lib/actions/hooks'
import { saveHook, unsaveHook, isSaved } from '@/lib/actions/saved-hooks'
import { getSessionId } from '@/lib/utils/session'
import { toast } from 'sonner'
import type { Hook, ContentType } from '@/lib/types/database'
import Button from '@/components/ui/button'
import LoadingSpinner from '@/components/ui/loading-spinner'
import { ThumbsUp, ThumbsDown, Bookmark } from 'lucide-react'

interface HookCardProps {
  initialHook: Hook
  contentType: ContentType
}

export default function HookCard({ initialHook, contentType }: HookCardProps) {
  const [hook, setHook] = useState<Hook>(initialHook)
  const [recentIds, setRecentIds] = useState<string[]>([initialHook.id])
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string>('')
  const [saved, setSaved] = useState(false)
  const [savingLoading, setSavingLoading] = useState(false)

  useEffect(() => {
    setSessionId(getSessionId())
    checkIfSaved()
  }, [])

  useEffect(() => {
    checkIfSaved()
  }, [hook.id])

  const checkIfSaved = async () => {
    const result = await isSaved(hook.id, contentType)
    setSaved(result.isSaved)
  }

  const loadNextHook = async () => {
    setLoading(true)
    try {
      // Exclude the last 10 hooks
      const excludeIds = recentIds.slice(-10)
      const nextHook = await getRandomHook(excludeIds, contentType)

      if (nextHook) {
        setHook(nextHook)
        setRecentIds(prev => [...prev.slice(-9), nextHook.id])
      } else {
        toast.error('No more hooks available')
      }
    } catch (error) {
      toast.error('Failed to load next hook')
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (voteType: 'green' | 'red' | 'star') => {
    if (!sessionId) {
      toast.error('Session not initialized')
      return
    }

    setLoading(true)
    try {
      const result = await submitVote(hook.id, voteType, sessionId)

      if (result.success) {
        if (voteType === 'green') {
          toast.success('Marked as working!')
        } else if (voteType === 'red') {
          toast.error('Marked as not working')
        } else {
          toast('Starred for later review')
        }

        // Update the current hook stats before loading next
        if (result.hook) {
          setHook(result.hook)
        }

        // Auto-load next hook after voting
        setTimeout(() => {
          loadNextHook()
        }, 500)
      } else {
        toast.error(result.error || 'Failed to submit vote')
        setLoading(false)
      }
    } catch (error) {
      toast.error('An error occurred')
      setLoading(false)
    }
  }

  const handleSkip = () => {
    loadNextHook()
  }

  const handleSaveToggle = async () => {
    setSavingLoading(true)
    try {
      const result = saved
        ? await unsaveHook(hook.id)
        : await saveHook(hook.id, contentType)

      if ('error' in result) {
        toast.error(result.error)
      } else {
        setSaved(!saved)
        toast.success(saved ? 'Hook unsaved' : 'Hook saved!')
      }
    } catch (error) {
      toast.error('Failed to save hook')
    } finally {
      setSavingLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto animate-[slide-up_0.5s_ease-out]">
      {/* Hook Display Card */}
      <div className="crm-card mb-6">
        <p className="text-2xl font-normal text-white leading-relaxed text-center">
          {hook.text}
        </p>
        <div className="flex gap-4 mt-6 text-sm text-[#a0a0a0] justify-center">
          <span>{hook.total_votes} {hook.total_votes === 1 ? 'vote' : 'votes'}</span>
          {hook.total_votes > 0 && (
            <span>{hook.green_percentage.toFixed(0)}% positive</span>
          )}
        </div>
      </div>

      {/* Voting Interface */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <button
          onClick={() => handleVote('green')}
          disabled={loading}
          className="crm-card crm-hover flex flex-col items-center gap-3 py-8 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ThumbsUp className="w-8 h-8 text-[#a0a0a0]" />
          <span className="text-base text-white">This Hook Works</span>
        </button>
        <button
          onClick={() => handleVote('red')}
          disabled={loading}
          className="crm-card crm-hover flex flex-col items-center gap-3 py-8 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ThumbsDown className="w-8 h-8 text-[#a0a0a0]" />
          <span className="text-base text-white">Needs Improvement</span>
        </button>
      </div>

      {/* Secondary Actions */}
      <div className="flex items-center justify-between">
        <Button
          onClick={handleSaveToggle}
          disabled={loading || savingLoading}
          variant={saved ? "primary" : "outline"}
          size="md"
          icon={<Bookmark className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />}
        >
          {saved ? 'Saved' : 'Save Hook'}
        </Button>

        <button
          onClick={handleSkip}
          disabled={loading}
          className="text-sm text-[#6b6b6b] hover:text-white transition-colors duration-150 disabled:opacity-50"
        >
          Skip this hook
        </button>
      </div>

      {loading && (
        <div className="mt-8 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      )}
    </div>
  )
}
