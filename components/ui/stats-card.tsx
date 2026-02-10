'use client'

import { useEffect, useState } from 'react'
import { ReactNode } from 'react'

interface StatsCardProps {
  label: string
  value: number
  suffix?: string
  icon?: ReactNode
  animate?: boolean
}

export default function StatsCard({
  label,
  value,
  suffix = '',
  icon,
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

  return (
    <div className="crm-card crm-hover">
      {icon && (
        <div className="inline-flex items-center justify-center w-12 h-12 mb-4 text-white opacity-80">
          {icon}
        </div>
      )}

      <div className="text-base text-[#a0a0a0] mb-2">
        {label}
      </div>

      <div className="text-[32px] font-semibold text-white">
        {displayValue}{suffix}
      </div>
    </div>
  )
}
