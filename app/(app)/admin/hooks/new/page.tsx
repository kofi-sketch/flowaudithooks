'use client'

import { useState } from 'react'
import { createHook } from '@/lib/actions/hooks'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'
import Button from '@/components/ui/button'
import { ArrowLeft, Lightbulb, Target, Upload } from 'lucide-react'
import type { ContentType } from '@/lib/types/database'
import { CONTENT_TYPE_SINGULAR_LABELS } from '@/lib/constants/content-types'

export default function NewHookPage() {
  const [text, setText] = useState('')
  const [contentType, setContentType] = useState<ContentType>('hook')
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
      const result = await createHook(text.trim(), contentType)

      if (result.success) {
        toast.success(`${CONTENT_TYPE_SINGULAR_LABELS[contentType]} added successfully!`)
        router.push('/admin')
        router.refresh()
      } else {
        toast.error(result.error || `Failed to add ${CONTENT_TYPE_SINGULAR_LABELS[contentType].toLowerCase()}`)
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
          <h1 className="text-[32px] font-semibold text-white mb-2">Add New Content</h1>
          <p className="text-base text-[#a0a0a0]">
            Add cold call content to test with your audience
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin">
            <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
          </Link>
        </div>
      </div>

      {/* Import Links */}
      <div className="flex gap-3 animate-[slide-up_0.4s_ease-out_0.05s] opacity-0" style={{ animation: 'slide-up 0.4s ease-out 0.05s forwards' }}>
        <Link href="/admin/hooks/import" className="flex-1">
          <Button variant="outline" size="sm" icon={<Upload className="w-4 h-4" />} className="w-full">
            Import Hooks CSV
          </Button>
        </Link>
        <Link href="/admin/bridges/import" className="flex-1">
          <Button variant="outline" size="sm" icon={<Upload className="w-4 h-4" />} className="w-full">
            Import Bridges CSV
          </Button>
        </Link>
        <Link href="/admin/follow-ups/import" className="flex-1">
          <Button variant="outline" size="sm" icon={<Upload className="w-4 h-4" />} className="w-full">
            Import Follow-ups CSV
          </Button>
        </Link>
      </div>

      {/* Form */}
      <div className="crm-card animate-[slide-up_0.5s_ease-out_0.1s] opacity-0" style={{ animation: 'slide-up 0.5s ease-out 0.1s forwards' }}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="content-type" className="block text-sm font-medium text-white mb-3">
              Content Type
            </label>
            <select
              id="content-type"
              value={contentType}
              onChange={(e) => setContentType(e.target.value as ContentType)}
              className="block w-full px-5 py-4 bg-[#2a2a2a] border border-[#353535] rounded-lg focus:border-[#404040] focus:outline-none transition-colors text-white text-base"
            >
              <option value="hook">Hook</option>
              <option value="bridge">Bridge</option>
              <option value="followup">Follow-up</option>
            </select>
          </div>

          <div>
            <label htmlFor="hook-text" className="block text-sm font-medium text-white mb-3">
              {CONTENT_TYPE_SINGULAR_LABELS[contentType]} Text
            </label>
            <textarea
              id="hook-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              className="block w-full px-5 py-4 bg-[#2a2a2a] border border-[#353535] rounded-lg focus:border-[#404040] focus:outline-none transition-colors text-white placeholder-[#6b6b6b] resize-none text-base"
              placeholder={`Enter your ${CONTENT_TYPE_SINGULAR_LABELS[contentType].toLowerCase()} here...`}
              required
            />
            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm text-[#a0a0a0]">
                {text.length} characters
              </p>
              <div className={`text-sm font-medium ${text.length > 200 ? 'text-[#a0a0a0]' : 'text-white'}`}>
                {text.length > 200 ? '⚠ Consider shortening' : '✓ Good length'}
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
              Add {CONTENT_TYPE_SINGULAR_LABELS[contentType]}
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
      <div className="crm-card bg-[#2a2a2a] animate-[slide-up_0.5s_ease-out_0.2s] opacity-0" style={{ animation: 'slide-up 0.5s ease-out 0.2s forwards' }}>
        <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
          <Lightbulb className="w-6 h-6" />
          Example Hook Templates
        </h2>
        <p className="text-sm text-[#a0a0a0] mb-5">
          Click on any example to use it as a starting point:
        </p>
        <div className="space-y-3">
          {exampleHooks.map((example, index) => (
            <button
              key={index}
              onClick={() => setText(example)}
              className="block w-full text-left px-5 py-4 bg-[#2d2d2d] border border-[#353535] rounded-lg hover:bg-[#3a3a3a] transition-colors text-sm text-white"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="crm-card bg-[#2a2a2a] animate-[slide-up_0.5s_ease-out_0.3s] opacity-0" style={{ animation: 'slide-up 0.5s ease-out 0.3s forwards' }}>
        <h2 className="text-xl font-semibold text-white mb-5 flex items-center gap-2">
          <Target className="w-6 h-6" />
          Tips for Great Hooks
        </h2>
        <ul className="space-y-4">
          <li className="flex items-start gap-4 p-4 rounded-lg bg-[#2d2d2d] border border-[#353535]">
            <span className="text-white">✓</span>
            <span className="flex-1 text-[#a0a0a0]">
              <strong className="text-white">Be specific and concrete</strong> - use numbers, timeframes, outcomes
            </span>
          </li>
          <li className="flex items-start gap-4 p-4 rounded-lg bg-[#2d2d2d] border border-[#353535]">
            <span className="text-white">✓</span>
            <span className="flex-1 text-[#a0a0a0]">
              <strong className="text-white">Trigger curiosity or emotion</strong>
            </span>
          </li>
          <li className="flex items-start gap-4 p-4 rounded-lg bg-[#2d2d2d] border border-[#353535]">
            <span className="text-white">✓</span>
            <span className="flex-1 text-[#a0a0a0]">
              <strong className="text-white">Address a specific pain point</strong> or desire
            </span>
          </li>
          <li className="flex items-start gap-4 p-4 rounded-lg bg-[#2d2d2d] border border-[#353535]">
            <span className="text-white">✓</span>
            <span className="flex-1 text-[#a0a0a0]">
              <strong className="text-white">Keep it under 200 characters</strong> for best results
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}
