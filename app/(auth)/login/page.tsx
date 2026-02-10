'use client'

import { useState, useEffect } from 'react'
import { signIn, signUp } from '@/lib/actions/auth'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import GradientBackground from '@/components/ui/gradient-background'
import Button from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setIsLoggedIn(true)
        router.push('/test')
      }
    }
    checkAuth()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = isSignUp
        ? await signUp(email, password)
        : await signIn(email, password)

      if ('error' in result) {
        toast.error(result.error)
      } else {
        toast.success(isSignUp ? 'Account created successfully!' : 'Signed in successfully!')
        router.push('/test')
        router.refresh()
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <GradientBackground />
      <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full space-y-8 animate-[scale-in_0.5s_ease-out]">
          <div className="glass-premium p-10 rounded-3xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">🪝</div>
              <h2 className="text-4xl font-bold gradient-text mb-3">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {isSignUp
                  ? 'Sign up to start testing hooks'
                  : 'Sign in to your account'}
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-4 py-3 glass rounded-xl border-2 border-transparent focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none transition-all duration-200 text-slate-900 dark:text-slate-100 placeholder-slate-400"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-4 py-3 glass rounded-xl border-2 border-transparent focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none transition-all duration-200 text-slate-900 dark:text-slate-100 placeholder-slate-400"
                    placeholder="••••••••"
                    minLength={6}
                  />
                  {isSignUp && (
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      Password must be at least 6 characters
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  variant="primary"
                  size="lg"
                  className="w-full"
                  loading={loading}
                >
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                </Button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                >
                  {isSignUp
                    ? 'Already have an account? Sign in'
                    : "Don't have an account? Sign up"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
