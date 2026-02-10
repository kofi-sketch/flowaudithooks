'use client'

import { useState } from 'react'
import { createHook } from '@/lib/actions/hooks'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'

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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Hook</h1>
          <p className="text-gray-600 mt-1">
            Add a marketing hook to test with your audience
          </p>
        </div>

        <Link
          href="/admin"
          className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
        >
          ← Back
        </Link>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="hook-text" className="block text-sm font-medium text-gray-700 mb-2">
              Hook Text
            </label>
            <textarea
              id="hook-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              placeholder="Enter your marketing hook here..."
              required
            />
            <p className="mt-2 text-sm text-gray-500">
              {text.length} characters
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !text.trim()}
              className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Hook'}
            </button>

            <button
              type="button"
              onClick={() => setText('')}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Example Hooks */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Example Hook Templates
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Click on any example to use it as a starting point:
        </p>
        <div className="space-y-2">
          {exampleHooks.map((example, index) => (
            <button
              key={index}
              onClick={() => setText(example)}
              className="block w-full text-left px-4 py-3 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-colors text-sm"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Tips for Great Hooks
        </h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Be specific and concrete (use numbers, timeframes, outcomes)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Trigger curiosity or emotion</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Address a specific pain point or desire</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Keep it under 200 characters for best results</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
