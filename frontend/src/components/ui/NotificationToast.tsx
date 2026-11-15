import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/stores/useAppStore'

export default function NotificationToast() {
  const { notifications, removeNotification } = useAppStore()

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((n) => (
          <ToastItem key={n.id} notification={n} onClose={() => removeNotification(n.id)} />
        ))}
      </AnimatePresence>
    </div>
  )
}

interface NotificationItem {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

function ToastItem({
  notification,
  onClose,
}: {
  notification: NotificationItem
  onClose: () => void
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  const colorMap = {
    success: { bg: 'rgba(34,197,94,0.15)', border: '#4ade80', icon: '✓' },
    error: { bg: 'rgba(239,68,68,0.15)', border: '#f87171', icon: '✕' },
    info: { bg: 'rgba(59,130,246,0.15)', border: '#60a5fa', icon: 'ℹ' },
    warning: { bg: 'rgba(234,179,8,0.15)', border: '#facc15', icon: '⚠' },
  }

  const style = colorMap[notification.type]

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="flex items-start gap-3 p-4 rounded-xl backdrop-blur-md"
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        color: 'var(--color-cream)',
      }}
    >
      <span className="text-lg leading-none mt-0.5">{style.icon}</span>
      <p className="flex-1 text-sm">{notification.message}</p>
      <button
        onClick={onClose}
        className="text-xs opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
      >
        ✕
      </button>
    </motion.div>
  )
}
