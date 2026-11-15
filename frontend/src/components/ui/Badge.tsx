type BadgeColor = 'gold' | 'purple' | 'orange' | 'green' | 'red' | 'blue' | 'default'

interface BadgeProps {
  label: string
  color?: BadgeColor
  size?: 'sm' | 'md'
}

const colorMap: Record<BadgeColor, { bg: string; text: string }> = {
  gold: { bg: 'rgba(212,160,23,0.2)', text: '#D4A017' },
  purple: { bg: 'rgba(74,18,89,0.4)', text: '#c084fc' },
  orange: { bg: 'rgba(232,93,4,0.2)', text: '#E85D04' },
  green: { bg: 'rgba(34,197,94,0.15)', text: '#4ade80' },
  red: { bg: 'rgba(239,68,68,0.15)', text: '#f87171' },
  blue: { bg: 'rgba(59,130,246,0.15)', text: '#60a5fa' },
  default: { bg: 'rgba(255,248,231,0.1)', text: 'rgba(255,248,231,0.7)' },
}

export default function Badge({ label, color = 'default', size = 'md' }: BadgeProps) {
  const { bg, text } = colorMap[color]
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'}`}
      style={{ background: bg, color: text }}
    >
      {label}
    </span>
  )
}
