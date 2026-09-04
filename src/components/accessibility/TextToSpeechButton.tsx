import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { speechUtils } from '../../utils/speechUtils';
import type { TextToSpeechButtonProps } from '../../types';

export function TextToSpeechButton({ textToRead, locale }: TextToSpeechButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    setIsSupported(speechUtils.isSupported());
    return () => speechUtils.stop();
  }, []);

  // Re-evaluate supported state if locale changes (some devices don't support all)
  useEffect(() => {
    // For a more robust app, we'd check window.speechSynthesis.getVoices() 
    // to see if the specific locale is supported, but for now we assume it is
    // or fallback gracefully.
    speechUtils.stop();
    setIsPlaying(false);
  }, [locale]);

  if (!isSupported) {
    return null;
  }

  const handleToggle = () => {
    if (isPlaying) {
      speechUtils.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speechUtils.speak(
        textToRead,
        locale,
        () => setIsPlaying(false),
        () => setIsPlaying(false)
      );
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center justify-center rounded-pill shadow-sm transition-colors min-h-[var(--spacing-tap)] min-w-[var(--spacing-tap)] px-4 font-bold border ${
        isPlaying 
          ? 'bg-status-optimal-light border-status-optimal text-status-optimal' 
          : 'bg-surface-card hover:bg-surface-card-hover border-slate-300 text-text-primary'
      }`}
      aria-label={isPlaying ? 'Stop reading aloud' : 'Read advisories aloud'}
      aria-pressed={isPlaying}
    >
      {isPlaying ? (
        <>
          <VolumeX className="w-5 h-5 mr-2" aria-hidden="true" />
          <span className="hidden sm:inline">Stop</span>
        </>
      ) : (
        <>
          <Volume2 className="w-5 h-5 mr-2" aria-hidden="true" />
          <span className="hidden sm:inline">Listen</span>
        </>
      )}
    </button>
  );
}
