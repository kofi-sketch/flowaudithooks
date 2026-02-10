'use client'

import { useEffect, useState } from 'react'

interface StatsCardProps {
  label: string
  value: number
  suffix?: string
  icon?: string
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  animate?: boolean
}

export default function StatsCard({
  label,
  value,
  suffix = '',
  icon,
  variant = 'default',
  animate = true
}: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState(animate ? 0 : value)

  useEffect(() => {
    if (!animate) return

    const duration = 1000
    const steps = 30
    const increment = value / steps
    const stepDuration = duration / steps

    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [value, animate])

  const variantClasses = {
    default: 'from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 text-indigo-600 dark:text-indigo-400',
    success: 'from-emerald-500/10 to-green-500/10 dark:from-emerald-500/20 dark:to-green-500/20 text-emerald-600 dark:text-emerald-400',
    warning: 'from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20 text-amber-600 dark:text-amber-400',
    error: 'from-rose-500/10 to-red-500/10 dark:from-rose-500/20 dark:to-red-500/20 text-rose-600 dark:text-rose-400',
    info: 'from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 text-blue-600 dark:text-blue-400'
  }

  const iconClasses = {
    default: 'from-indigo-500 to-purple-600',
    success: 'from-emerald-500 to-green-600',
    warning: 'from-amber-400 to-orange-500',
    error: 'from-rose-500 to-red-600',
    info: 'from-blue-500 to-cyan-600'
  }

  return (
    <div className="group relative">
      <div className={`glass-premium rounded-2xl p-6 bg-gradient-to-br ${variantClasses[variant]} transition-all duration-300 hover:scale-105 hover:shadow-2xl`}>
        {icon && (
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${iconClasses[variant]} text-white text-2xl mb-4 shadow-lg`}>
            {icon}
          </div>
        )}

        <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
          {label}
        </div>

        <div className={`text-4xl font-bold ${variantClasses[variant].split(' ').pop()}`}>
          {displayValue}{suffix}
        </div>
      </div>

      {/* Hover glow effect */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${iconClasses[variant]} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300 -z-10`} />
    </div>
  )
}
