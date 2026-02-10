'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check initial theme
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)

    if (newIsDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="glass px-4 py-2 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-200 group"
      aria-label="Toggle theme"
    >
      <div className="flex items-center gap-2">
        {isDark ? (
          <>
            <span className="text-xl group-hover:scale-110 transition-transform duration-200">🌙</span>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 hidden sm:inline">
              Dark
            </span>
          </>
        ) : (
          <>
            <span className="text-xl group-hover:scale-110 transition-transform duration-200">☀️</span>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 hidden sm:inline">
              Light
            </span>
          </>
        )}
      </div>
    </button>
  )
}
