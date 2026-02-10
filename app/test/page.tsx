import { getRandomHook } from '@/lib/actions/hooks'
import { redirect } from 'next/navigation'
import HookCard from '@/components/hooks/hook-card'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/actions/auth'

export default async function TestPage() {
  const initialHook = await getRandomHook()

  if (!initialHook) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 px-4">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">No Hooks Available</h1>
          <p className="text-gray-600">
            There are no hooks in the system yet. Please ask an admin to add some hooks.
          </p>
        </div>
      </div>
    )
  }

  const user = await getCurrentUser()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 px-4 py-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Hook Tester
            </h1>
            <p className="text-gray-600">
              Vote on marketing hooks to find the winners
            </p>
          </div>

          <div className="flex items-center gap-4">
            {user?.is_admin && (
              <Link
                href="/admin"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors"
              >
                Admin Dashboard
              </Link>
            )}
            {user ? (
              <div className="text-sm text-gray-600">
                {user.email}
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg shadow-md transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <HookCard initialHook={initialHook} />
      </div>

      {/* Instructions */}
      <div className="max-w-2xl mx-auto mt-12 bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">How It Works</h2>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span>Click <strong className="text-green-600">"Worked!"</strong> if the hook caught your attention and would make you engage</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500 font-bold">✗</span>
            <span>Click <strong className="text-red-600">"Didn't Work"</strong> if the hook feels weak or uninteresting</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500 font-bold">⭐</span>
            <span>Click <strong className="text-yellow-600">"Save for Later"</strong> to bookmark without voting (doesn't affect stats)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-500 font-bold">→</span>
            <span>Click <strong className="text-gray-600">"Skip"</strong> to see a different hook without voting</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
