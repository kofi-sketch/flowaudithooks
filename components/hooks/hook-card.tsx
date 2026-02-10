'use client'

import { useState, useEffect } from 'react'
import { submitVote } from '@/lib/actions/votes'
import { getRandomHook } from '@/lib/actions/hooks'
import { getSessionId } from '@/lib/utils/session'
import { toast } from 'sonner'
import type { Hook } from '@/lib/types/database'

interface HookCardProps {
  initialHook: Hook
}

export default function HookCard({ initialHook }: HookCardProps) {
  const [hook, setHook] = useState<Hook>(initialHook)
  const [recentIds, setRecentIds] = useState<string[]>([initialHook.id])
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string>('')

  useEffect(() => {
    setSessionId(getSessionId())
  }, [])

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

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Hook Display Card */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6 min-h-[280px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-2xl md:text-3xl font-semibold text-gray-900 leading-relaxed">
            {hook.text}
          </p>

          {/* Stats Display (small, subtle) */}
          <div className="flex justify-center gap-4 text-sm text-gray-500 pt-4">
            <span>
              {hook.total_votes} {hook.total_votes === 1 ? 'vote' : 'votes'}
            </span>
            {hook.total_votes > 0 && (
              <>
                <span>•</span>
                <span className="text-green-600 font-medium">
                  {hook.green_percentage.toFixed(0)}% positive
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Voting Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <button
          onClick={() => handleVote('green')}
          disabled={loading}
          className="group relative bg-green-500 hover:bg-green-600 text-white font-semibold py-6 px-6 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-4xl">✅</span>
            <span className="text-lg">Worked!</span>
          </div>
        </button>

        <button
          onClick={() => handleVote('red')}
          disabled={loading}
          className="group relative bg-red-500 hover:bg-red-600 text-white font-semibold py-6 px-6 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-4xl">❌</span>
            <span className="text-lg">Didn't Work</span>
          </div>
        </button>
      </div>

      {/* Secondary Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleVote('star')}
          disabled={loading}
          className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-medium py-4 px-6 rounded-xl shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">⭐</span>
            <span>Save for Later</span>
          </div>
        </button>

        <button
          onClick={handleSkip}
          disabled={loading}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-4 px-6 rounded-xl shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">→</span>
            <span>Skip</span>
          </div>
        </button>
      </div>

      {loading && (
        <div className="text-center mt-6 text-gray-500">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
        </div>
      )}
    </div>
  )
}
