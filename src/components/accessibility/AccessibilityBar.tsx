import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Accessibility } from 'lucide-react';
import { useLocaleStore, SUPPORTED_LOCALES } from '../../store/useLocaleStore';
import { useConnectivityStore } from '../../store/useConnectivityStore';
import { LanguageToggle } from './LanguageToggle';
import { TextToSpeechButton } from './TextToSpeechButton';
import { OfflineIndicator } from './OfflineIndicator';

interface AccessibilityBarProps {
  /**
   * The text that should be read aloud when the TTS button is clicked.
   * This is passed from the parent component which knows the current advisories.
   */
  textToRead: string;
}

const panelVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.15, ease: 'easeOut' as const },
  },
  exit: {
    opacity: 0,
    y: 12,
    scale: 0.95,
    transition: { duration: 0.15, ease: 'easeOut' as const },
  },
};

export function AccessibilityBar({ textToRead }: AccessibilityBarProps) {
  const { activeLocale, setLocale } = useLocaleStore();
  const { isOnline, lastOnlineAt } = useConnectivityStore();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="fixed bottom-6 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="accessibility-panel"
            role="dialog"
            aria-label="Accessibility and language options"
            variants={panelVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="absolute bottom-full right-0 mb-3 flex w-max max-w-[calc(100vw-2rem)] flex-col items-end gap-2 border border-line bg-surface-card p-3 rounded-card shadow-elevated"
          >
            <LanguageToggle
              activeLocale={activeLocale}
              onLocaleChange={setLocale}
              availableLocales={SUPPORTED_LOCALES}
            />
            <OfflineIndicator
              isOnline={isOnline}
              lastOnlineAt={lastOnlineAt ?? undefined}
            />
            <TextToSpeechButton textToRead={textToRead} locale={activeLocale} />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={`Accessibility and language options. ${isOnline ? 'Online' : 'Offline'}`}
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
        className={`relative flex w-tap h-tap items-center justify-center rounded-pill border shadow-elevated ${
          isOnline
            ? 'border-line bg-surface-primary text-text-primary'
            : 'border-offline-badge bg-offline-badge-light text-offline-badge'
        }`}
      >
        <Accessibility className="w-6 h-6" aria-hidden="true" />
        <span
          className={`absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-pill border-2 border-surface-primary ${
            isOnline ? 'bg-status-optimal' : 'bg-text-muted'
          }`}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
