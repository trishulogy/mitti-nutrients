// ============================================================================
// Locale Store (Zustand)
// ============================================================================
// Manages the active UI language. Persisted to localStorage so the farmer's
// language preference survives page reloads and offline sessions.
// ============================================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LocaleState, LocaleCode } from '../types';

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      activeLocale: 'en' as LocaleCode,

      setLocale: (locale: LocaleCode) => set({ activeLocale: locale }),
    }),
    {
      name: 'nutrient-panel-locale',
      // Uses default localStorage adapter
    }
  )
);

/**
 * The list of all supported locales with their native-script labels.
 * Used by the <LanguageToggle> component.
 */
export const SUPPORTED_LOCALES: { code: LocaleCode; label: string; labelEn: string }[] = [
  { code: 'en', label: 'English', labelEn: 'English' },
  { code: 'hi', label: 'हिन्दी', labelEn: 'Hindi' },
  { code: 'ta', label: 'தமிழ்', labelEn: 'Tamil' },
  { code: 'te', label: 'తెలుగు', labelEn: 'Telugu' },
  { code: 'mr', label: 'मराठी', labelEn: 'Marathi' },
  { code: 'bn', label: 'বাংলা', labelEn: 'Bengali' },
];
