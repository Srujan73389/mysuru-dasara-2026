import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  title?: string
  subtitle?: string
  image?: string
  tags?: string[]
  footer?: ReactNode
  children?: ReactNode
  onClick?: () => void
  className?: string
  glowing?: boolean
}

export default function Card({
  title,
  subtitle,
  image,
  tags,
  footer,
  children,
  onClick,
  className = '',
  glowing = false,
}: CardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={[
        'glass rounded-2xl overflow-hidden',
        onClick ? 'cursor-pointer' : '',
        glowing ? 'shadow-[0_0_20px_rgba(212,160,23,0.3)]' : '',
        className,
      ].join(' ')}
      style={{ border: '1px solid rgba(212,160,23,0.2)' }}
    >
      {image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={title || ''}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(10,15,44,0.8) 0%, transparent 60%)',
            }}
          />
          {tags && tags.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    background: 'rgba(212,160,23,0.9)',
                    color: '#0A0F2C',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="p-5">
        {!image && tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: 'rgba(212,160,23,0.2)', color: 'var(--color-gold)' }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {title && (
          <h3
            className="font-playfair text-lg font-bold mb-1"
            style={{ color: 'var(--color-cream)' }}
          >
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-sm mb-3" style={{ color: 'rgba(255,248,231,0.65)' }}>
            {subtitle}
          </p>
        )}
        {children && <div>{children}</div>}
      </div>

      {footer && (
        <div
          className="px-5 py-3"
          style={{ borderTop: '1px solid rgba(212,160,23,0.15)' }}
        >
          {footer}
        </div>
      )}
    </motion.div>
  )
}
