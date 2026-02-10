'use client'

import { useState } from 'react'
import { createHook } from '@/lib/actions/hooks'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'
import Button from '@/components/ui/button'

export default function NewHookPage() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!text.trim()) {
      toast.error('Hook text is required')
      return
    }

    setLoading(true)
    try {
      const result = await createHook(text.trim())

      if (result.success) {
        toast.success('Hook added successfully!')
        router.push('/admin')
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to add hook')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const exampleHooks = [
    '🚀 Transform your business in 30 days or your money back',
    'The secret strategy Fortune 500 companies don\'t want you to know',
    'Why 97% of people fail at [problem] (and how you can be in the 3%)',
    'I tried [method] for 90 days. Here\'s what happened...',
    'The surprising truth about [topic] that experts won\'t tell you',
  ]

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="animate-[slide-up_0.4s_ease-out]">
          <h1 className="text-4xl font-bold gradient-text mb-2">Add New Hook</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Add a marketing hook to test with your audience
          </p>
        </div>

        <Link href="/admin">
          <Button variant="ghost" size="md">
            ← Back
          </Button>
        </Link>
      </div>

      {/* Form */}
      <div className="glass-premium rounded-2xl p-8 animate-[slide-up_0.5s_ease-out_0.1s] opacity-0" style={{ animation: 'slide-up 0.5s ease-out 0.1s forwards' }}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="hook-text" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
              Hook Text
            </label>
            <textarea
              id="hook-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              className="block w-full px-5 py-4 glass rounded-xl border-2 border-transparent focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none transition-all duration-200 text-slate-900 dark:text-slate-100 placeholder-slate-400 resize-none text-lg"
              placeholder="Enter your marketing hook here..."
              required
            />
            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {text.length} characters
              </p>
              <div className={`text-sm font-semibold ${text.length > 200 ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400'}`}>
                {text.length > 200 ? '⚠️ Consider shortening' : '✓ Good length'}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading || !text.trim()}
              variant="primary"
              size="lg"
              className="flex-1"
              loading={loading}
            >
              Add Hook
            </Button>

            <Button
              type="button"
              onClick={() => setText('')}
              variant="ghost"
              size="lg"
            >
              Clear
            </Button>
          </div>
        </form>
      </div>

      {/* Example Hooks */}
      <div className="glass-premium rounded-2xl p-8 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 animate-[slide-up_0.5s_ease-out_0.2s] opacity-0" style={{ animation: 'slide-up 0.5s ease-out 0.2s forwards' }}>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
          <span className="text-2xl">💡</span>
          Example Hook Templates
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
          Click on any example to use it as a starting point:
        </p>
        <div className="space-y-3">
          {exampleHooks.map((example, index) => (
            <button
              key={index}
              onClick={() => setText(example)}
              className="block w-full text-left px-5 py-4 glass rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200 text-sm font-medium text-slate-700 dark:text-slate-300 hover:shadow-lg hover:scale-[1.02]"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="glass-premium rounded-2xl p-8 bg-gradient-to-br from-emerald-500/10 to-green-500/10 dark:from-emerald-500/20 dark:to-green-500/20 animate-[slide-up_0.5s_ease-out_0.3s] opacity-0" style={{ animation: 'slide-up 0.5s ease-out 0.3s forwards' }}>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-5 flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          Tips for Great Hooks
        </h2>
        <ul className="space-y-4">
          <li className="flex items-start gap-4 p-4 rounded-xl bg-white/50 dark:bg-slate-800/30">
            <span className="text-2xl">✓</span>
            <span className="flex-1 pt-1 text-slate-700 dark:text-slate-300">
              <strong className="font-bold text-slate-900 dark:text-slate-100">Be specific and concrete</strong> - use numbers, timeframes, outcomes
            </span>
          </li>
          <li className="flex items-start gap-4 p-4 rounded-xl bg-white/50 dark:bg-slate-800/30">
            <span className="text-2xl">✓</span>
            <span className="flex-1 pt-1 text-slate-700 dark:text-slate-300">
              <strong className="font-bold text-slate-900 dark:text-slate-100">Trigger curiosity or emotion</strong>
            </span>
          </li>
          <li className="flex items-start gap-4 p-4 rounded-xl bg-white/50 dark:bg-slate-800/30">
            <span className="text-2xl">✓</span>
            <span className="flex-1 pt-1 text-slate-700 dark:text-slate-300">
              <strong className="font-bold text-slate-900 dark:text-slate-100">Address a specific pain point</strong> or desire
            </span>
          </li>
          <li className="flex items-start gap-4 p-4 rounded-xl bg-white/50 dark:bg-slate-800/30">
            <span className="text-2xl">✓</span>
            <span className="flex-1 pt-1 text-slate-700 dark:text-slate-300">
              <strong className="font-bold text-slate-900 dark:text-slate-100">Keep it under 200 characters</strong> for best results
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}
