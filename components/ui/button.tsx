import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  icon?: ReactNode
  loading?: boolean
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'btn-premium relative inline-flex items-center justify-center font-semibold rounded-2xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variantClasses = {
    primary: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-indigo-500/25 hover:shadow-indigo-500/40 focus:ring-indigo-500',
    secondary: 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-slate-200/50 focus:ring-slate-500',
    success: 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-emerald-500/25 hover:shadow-emerald-500/40 focus:ring-emerald-500',
    danger: 'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white shadow-rose-500/25 hover:shadow-rose-500/40 focus:ring-rose-500',
    warning: 'bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white shadow-amber-500/25 hover:shadow-amber-500/40 focus:ring-amber-500',
    ghost: 'bg-transparent text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-none focus:ring-slate-500'
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm gap-2',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-3',
    xl: 'px-10 py-6 text-xl gap-4'
  }

  const hoverScale = disabled || loading ? '' : 'hover:scale-105 active:scale-95'

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${hoverScale} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
      ) : (
        <>
          {icon && <span className="inline-flex items-center">{icon}</span>}
          {children}
        </>
      )}
    </button>
  )
}
