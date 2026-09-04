import { Globe } from 'lucide-react';
import type { LanguageToggleProps } from '../../types';

export function LanguageToggle({
  activeLocale,
  onLocaleChange,
  availableLocales,
}: LanguageToggleProps) {
  return (
    <div className="relative flex items-center group">
      <Globe 
        className="absolute left-3 w-5 h-5 text-text-secondary pointer-events-none" 
        aria-hidden="true" 
      />
      <select
        value={activeLocale}
        onChange={(e) => onLocaleChange(e.target.value as LanguageToggleProps['activeLocale'])}
        className="appearance-none bg-surface-card hover:bg-surface-card-hover border border-slate-300 text-text-primary text-base font-bold rounded-pill pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-status-optimal focus:border-transparent cursor-pointer shadow-sm min-h-[var(--spacing-tap)] min-w-[var(--spacing-tap)] transition-colors"
        aria-label="Select Language"
      >
        {availableLocales.map((locale) => (
          <option key={locale.code} value={locale.code}>
            {locale.label}
          </option>
        ))}
      </select>
      {/* Custom dropdown arrow to replace the native one */}
      <div className="absolute right-3 pointer-events-none text-text-secondary">
        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
}
