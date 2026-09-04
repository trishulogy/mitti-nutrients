// ============================================================================
// Text-to-Speech Utilities
// ============================================================================
// Wrapper around the Web Speech API for reading advisories aloud.
// Handles language mappings and playback state.
// ============================================================================

import type { LocaleCode } from '../types';

/**
 * Maps our internal LocaleCode to BCP 47 language tags used by SpeechSynthesis.
 */
const LOCALE_TO_VOICE_LANG: Record<LocaleCode, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
};

export const speechUtils = {
  /**
   * Check if speech synthesis is supported by the browser.
   */
  isSupported: (): boolean => 'speechSynthesis' in window,

  /**
   * Speak the given text in the specified locale.
   * Cancels any currently playing speech first.
   */
  speak: (text: string, locale: LocaleCode, onEnd?: () => void, onError?: () => void) => {
    if (!speechUtils.isSupported()) {
      console.warn('Speech synthesis not supported');
      onError?.();
      return;
    }

    // Cancel anything currently playing
    window.speechSynthesis.cancel();

    if (!text.trim()) {
      onEnd?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const targetLang = LOCALE_TO_VOICE_LANG[locale];
    
    // Fetch available voices and try to match the target language exactly, or by primary subtag
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => v.lang === targetLang) 
      || voices.find(v => v.lang.startsWith(targetLang.split('-')[0]));
      
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
    
    utterance.lang = targetLang;
    // Slightly slower rate is usually better for accessibility
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onend = () => {
      onEnd?.();
    };

    utterance.onerror = (e) => {
      console.error('Speech synthesis error', e);
      onError?.();
    };

    window.speechSynthesis.speak(utterance);
  },

  /**
   * Stop any current speech playback.
   */
  stop: () => {
    if (speechUtils.isSupported()) {
      window.speechSynthesis.cancel();
    }
  },
};
