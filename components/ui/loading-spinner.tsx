interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'white'
}

export default function LoadingSpinner({ size = 'md', variant = 'primary' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4'
  }

  const variantClasses = {
    primary: 'border-indigo-200 border-t-indigo-600',
    white: 'border-white/30 border-t-white'
  }

  return (
    <div className="flex items-center justify-center">
      <div className={`animate-spin rounded-full ${sizeClasses[size]} ${variantClasses[variant]}`} />
    </div>
  )
}
