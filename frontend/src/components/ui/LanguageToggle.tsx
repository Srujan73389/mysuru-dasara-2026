import { motion } from 'framer-motion'
import { useAppStore } from '@/stores/useAppStore'

export default function LanguageToggle() {
  const { language, setLanguage } = useAppStore()

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'kn' : 'en')}
      className="relative flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-all"
      style={{
        background: 'rgba(212,160,23,0.15)',
        border: '1px solid rgba(212,160,23,0.3)',
        color: 'var(--color-gold)',
      }}
    >
      <motion.span
        key={language}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={language === 'kn' ? 'kannada' : ''}
      >
        {language === 'en' ? 'EN' : 'ಕನ್ನಡ'}
      </motion.span>
      <span style={{ color: 'rgba(212,160,23,0.4)' }}>|</span>
      <span className={language === 'kn' ? '' : 'kannada'} style={{ opacity: 0.5 }}>
        {language === 'en' ? 'ಕನ್ನಡ' : 'EN'}
      </span>
    </button>
  )
}
