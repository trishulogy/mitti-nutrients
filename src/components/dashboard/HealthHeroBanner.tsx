import { motion } from 'framer-motion';
import { useLocaleStore } from '../../store/useLocaleStore';
import { LastSyncDisplay } from './LastSyncDisplay';
import type { HealthHeroBannerProps, LocaleCode, OverallHealth } from '../../types';

// Translated labels for the overall health state
const HEALTH_LABELS: Record<OverallHealth, Record<LocaleCode, string>> = {
  healthy: {
    en: 'Field is Healthy',
    hi: 'खेत स्वस्थ है',
    ta: 'வயல் ஆரோக்கியமாக உள்ளது',
    te: 'పొలం ఆరోగ్యంగా ఉంది',
    mr: 'शेत निरोगी आहे',
    bn: 'মাঠ সুস্থ আছে',
  },
  attention: {
    en: 'Needs Attention',
    hi: 'ध्यान देने की जरूरत है',
    ta: 'கவனம் தேவை',
    te: 'శ్రద్ధ అవసరం',
    mr: 'लक्ष देण्याची गरज आहे',
    bn: 'মনোযোগ প্রয়োজন',
  },
  critical: {
    en: 'Critical Action Needed',
    hi: 'गंभीर कार्रवाई की जरूरत है',
    ta: 'முக்கிய நடவடிக்கை தேவை',
    te: 'తక్షణ చర్య అవసరం',
    mr: 'तात्काळ कारवाईची गरज आहे',
    bn: 'জরুরী পদক্ষেপ প্রয়োজন',
  }
};

// Map health states to the earthy hero-* gradients defined in index.css
// (was hardcoded emerald/amber/rose — those never touched the theme tokens)
const STYLE_MAP: Record<OverallHealth, { hero: string; icon: string }> = {
  healthy: {
    hero: 'hero-healthy',
    icon: '🌱',
  },
  attention: {
    hero: 'hero-attention',
    icon: '☀️',
  },
  critical: {
    hero: 'hero-critical',
    icon: '⚠️',
  }
};

export function HealthHeroBanner({ overallHealth, lastSyncedAt }: HealthHeroBannerProps) {
  const { activeLocale } = useLocaleStore();
  const styles = STYLE_MAP[overallHealth];
  const labelText = HEALTH_LABELS[overallHealth][activeLocale];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`relative overflow-hidden rounded-card p-6 shadow-elevated ${styles.hero}`}
    >
      <div className="relative z-10 flex flex-col gap-4">
        {/* Main Status Row */}
        <div className="flex items-center gap-4">
          {/* Icon Badge */}
          <div
            className="flex items-center justify-center w-16 h-16 rounded-pill bg-white/15 backdrop-blur-sm border border-white/20 text-4xl"
            role="img"
            aria-label={`Status: ${overallHealth}`}
          >
            {styles.icon}
          </div>

          {/* Main Label */}
          <div className="flex-1">
            <h2 className="text-3xl font-extrabold sm:text-4xl leading-tight tracking-tight text-text-inverse">
              {labelText}
            </h2>
          </div>
        </div>

        {/* Sync Info Footer */}
        <div className="mt-2 pt-4 border-t border-white/20 flex items-center justify-between text-text-inverse">
          <LastSyncDisplay lastSyncedAt={lastSyncedAt} />
        </div>
      </div>
    </motion.div>
  );
}