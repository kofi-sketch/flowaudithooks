import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
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
  const baseClasses = 'relative inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none'

  const variantClasses = {
    primary: 'bg-[#353535] border border-[#404040] text-white hover:brightness-110 active:scale-98',
    secondary: 'bg-transparent border border-[#353535] text-[#a0a0a0] hover:bg-[#2d2d2d] hover:text-white active:scale-98',
    outline: 'bg-transparent border border-[#353535] text-white hover:bg-[#2d2d2d] active:scale-98',
    ghost: 'bg-transparent text-[#a0a0a0] hover:bg-[#2d2d2d] hover:text-white active:scale-98',
    danger: 'bg-[#2d2d2d] border border-[#404040] text-[#ff6b6b] hover:brightness-110 active:scale-98'
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-2',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-3',
    xl: 'px-8 py-4 text-xl gap-4'
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-[#a0a0a0]/30 border-t-[#a0a0a0]" />
      ) : (
        <>
          {icon && <span className="inline-flex items-center">{icon}</span>}
          {children}
        </>
      )}
    </button>
  )
}
