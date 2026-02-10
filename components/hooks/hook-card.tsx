'use client'

import { useState, useEffect } from 'react'
import { submitVote } from '@/lib/actions/votes'
import { getRandomHook } from '@/lib/actions/hooks'
import { saveHook, unsaveHook, isSaved } from '@/lib/actions/saved-hooks'
import { getSessionId } from '@/lib/utils/session'
import { toast } from 'sonner'
import type { Hook } from '@/lib/types/database'
import Button from '@/components/ui/button'
import LoadingSpinner from '@/components/ui/loading-spinner'

interface HookCardProps {
  initialHook: Hook
}

export default function HookCard({ initialHook }: HookCardProps) {
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
    const result = await isSaved(hook.id)
    setSaved(result.isSaved)
  }

  const loadNextHook = async () => {
    setLoading(true)
    try {
      // Exclude the last 10 hooks
      const excludeIds = recentIds.slice(-10)
      const nextHook = await getRandomHook(excludeIds)

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
        : await saveHook(hook.id)

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
      {/* Hook Display Card - Premium Glassmorphic Design */}
      <div className="group relative mb-8">
        <div className="glass-premium rounded-3xl p-10 md:p-12 min-h-[320px] flex items-center justify-center transition-all duration-500 hover:shadow-2xl">
          <div className="text-center space-y-6">
            <p className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 leading-relaxed tracking-tight">
              {hook.text}
            </p>

            {/* Stats Display - Enhanced with gradients */}
            <div className="flex justify-center gap-6 text-sm pt-6">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800/50">
                <span className="text-slate-600 dark:text-slate-400">
                  {hook.total_votes} {hook.total_votes === 1 ? 'vote' : 'votes'}
                </span>
              </div>
              {hook.total_votes > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-green-500/10 dark:from-emerald-500/20 dark:to-green-500/20">
                  <span className="font-semibold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    {hook.green_percentage.toFixed(0)}% positive
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Glow effect on hover */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500 -z-10" />
      </div>

      {/* Voting Buttons - Premium with gradients */}
      <div className="grid grid-cols-2 gap-5 mb-5">
        <Button
          onClick={() => handleVote('green')}
          disabled={loading}
          variant="success"
          size="xl"
          className="flex-col !py-8"
        >
          <span className="text-5xl mb-2">✅</span>
          <span className="text-xl">Worked!</span>
        </Button>

        <Button
          onClick={() => handleVote('red')}
          disabled={loading}
          variant="danger"
          size="xl"
          className="flex-col !py-8"
        >
          <span className="text-5xl mb-2">❌</span>
          <span className="text-xl">Didn't Work</span>
        </Button>
      </div>

      {/* Secondary Actions */}
      <div className="grid grid-cols-2 gap-5">
        <Button
          onClick={handleSaveToggle}
          disabled={loading || savingLoading}
          variant={saved ? "success" : "warning"}
          size="lg"
        >
          <span className="text-3xl">{saved ? '💾' : '⭐'}</span>
          <span>{saved ? 'Saved!' : 'Save'}</span>
        </Button>

        <Button
          onClick={handleSkip}
          disabled={loading}
          variant="ghost"
          size="lg"
        >
          <span className="text-3xl">→</span>
          <span>Skip</span>
        </Button>
      </div>

      {loading && (
        <div className="mt-8">
          <LoadingSpinner size="lg" />
        </div>
      )}
    </div>
  )
}
