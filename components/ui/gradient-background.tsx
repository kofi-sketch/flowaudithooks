'use client'

export default function GradientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />

      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-indigo-400/30 to-purple-400/30 dark:from-indigo-600/20 dark:to-purple-600/20 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite]" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-br from-pink-400/30 to-rose-400/30 dark:from-pink-600/20 dark:to-rose-600/20 rounded-full blur-3xl animate-[float_10s_ease-in-out_infinite_2s]" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 dark:from-purple-600/15 dark:to-indigo-600/15 rounded-full blur-3xl animate-[float_12s_ease-in-out_infinite_4s]" />

      {/* Subtle grain texture */}
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.025]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`
      }} />
    </div>
  )
}
