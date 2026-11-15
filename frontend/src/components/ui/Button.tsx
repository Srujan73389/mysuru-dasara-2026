import { ReactNode } from 'react'
import { motion } from 'framer-motion'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  disabled?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
  fullWidth?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'text-midnight bg-gradient-to-r from-[#D4A017] to-[#F5C842] hover:from-[#F5C842] hover:to-[#D4A017] text-[#0A0F2C] font-semibold shadow-lg',
  secondary:
    'border-2 border-[#D4A017] text-[#D4A017] hover:bg-[#D4A017] hover:text-[#0A0F2C] bg-transparent font-semibold',
  ghost:
    'text-[#FFF8E7] hover:bg-white/10 bg-transparent',
  danger:
    'bg-red-600 hover:bg-red-700 text-white font-semibold',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-base rounded-xl',
  lg: 'px-8 py-3.5 text-lg rounded-xl',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
  fullWidth = false,
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileHover={isDisabled ? {} : { scale: 1.03 }}
      whileTap={isDisabled ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={[
        'inline-flex items-center justify-center gap-2 transition-all duration-200',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? 'w-full' : '',
        isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        className,
      ].join(' ')}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : (
        icon && iconPosition === 'left' && <span>{icon}</span>
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && <span>{icon}</span>}
    </motion.button>
  )
}
