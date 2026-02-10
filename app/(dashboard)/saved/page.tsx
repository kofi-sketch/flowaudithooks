'use client'

import { useState, useEffect } from 'react'
import { getSavedHooks, unsaveHook } from '@/lib/actions/saved-hooks'
import { toast } from 'sonner'
import Button from '@/components/ui/button'
import LoadingSpinner from '@/components/ui/loading-spinner'
import GradientBackground from '@/components/ui/gradient-background'
import Link from 'next/link'

interface SavedHook {
  id: string
  created_at: string
  hook_id: string
  hooks: {
    id: string
    text: string
    total_votes: number
    green_votes: number
    red_votes: number
    green_percentage: number
    is_flagged: boolean
    created_at: string
  }
}

export default function SavedHooksPage() {
  const [savedHooks, setSavedHooks] = useState<SavedHook[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSavedHooks()
  }, [])

  const loadSavedHooks = async () => {
    setLoading(true)
    try {
      const result = await getSavedHooks()
      if (result.data) {
        setSavedHooks(result.data as SavedHook[])
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
        toast.success('Hook unsaved')
      }
    } catch (error) {
      toast.error('Failed to unsave hook')
    }
  }

  return (
    <>
      <GradientBackground />
      <div className="relative min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-[slide-up_0.5s_ease-out]">
            <div className="inline-block mb-4">
              <Link href="/test">
                <Button variant="ghost" size="sm">
                  <span className="text-2xl mr-2">←</span>
                  Back to Testing
                </Button>
              </Link>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-4">
              💾 Your Saved Hooks
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Your collection of favorite hooks
            </p>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="xl" />
            </div>
          ) : savedHooks.length === 0 ? (
            <div className="text-center py-20 animate-[scale-in_0.5s_ease-out]">
              <div className="glass-premium rounded-3xl p-12 max-w-2xl mx-auto">
                <div className="text-7xl mb-6">📭</div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                  No saved hooks yet
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                  Save hooks while testing to keep track of your favorites!
                </p>
                <Link href="/test">
                  <Button variant="primary" size="lg">
                    Start Testing Hooks
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 animate-[slide-up_0.5s_ease-out]">
              {savedHooks.map((savedHook, index) => (
                <div
                  key={savedHook.id}
                  className="glass-premium rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    {/* Hook Text */}
                    <div className="flex-1">
                      <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                        {savedHook.hooks.text}
                      </p>

                      {/* Stats */}
                      <div className="flex flex-wrap gap-3">
                        <div className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800/50">
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {savedHook.hooks.total_votes} votes
                          </span>
                        </div>
                        {savedHook.hooks.total_votes > 0 && (
                          <div className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-green-500/10">
                            <span className="text-sm font-semibold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                              {savedHook.hooks.green_percentage.toFixed(0)}% positive
                            </span>
                          </div>
                        )}
                        {savedHook.hooks.is_flagged && (
                          <div className="px-4 py-2 rounded-full bg-red-500/10">
                            <span className="text-sm font-semibold text-red-600">
                              🚩 Flagged
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
      </div>
    </>
  )
}
