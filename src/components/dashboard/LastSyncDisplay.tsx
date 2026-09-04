import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { useLocaleStore } from '../../store/useLocaleStore';
import type { LocaleCode } from '../../types';

interface LastSyncDisplayProps {
  lastSyncedAt: string;
}

// Simple time formatter
const getRelativeTimeString = (date: Date, locale: LocaleCode): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

  if (diffInMinutes < 1) {
    const translations: Record<LocaleCode, string> = {
      en: 'Just now', hi: 'अभी-अभी', ta: 'இப்போது', te: 'ఇప్పుడే', mr: 'आत्ताच', bn: 'এইমাত্র'
    };
    return translations[locale] || translations.en;
  }
  
  if (diffInMinutes < 60) {
    const translations: Record<LocaleCode, string> = {
      en: `Updated ${diffInMinutes} min ago`,
      hi: `${diffInMinutes} मिनट पहले अपडेट हुआ`,
      ta: `${diffInMinutes} நிமிடம் முன் புதுப்பிக்கப்பட்டது`,
      te: `${diffInMinutes} నిమిషాల క్రితం నవీకరించబడింది`,
      mr: `${diffInMinutes} मिनिटांपूर्वी अपडेट केले`,
      bn: `${diffInMinutes} মিনিট আগে আপডেট হয়েছে`
    };
    return translations[locale] || translations.en;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    const translations: Record<LocaleCode, string> = {
      en: `Updated ${diffInHours} hr ago`,
      hi: `${diffInHours} घंटे पहले अपडेट हुआ`,
      ta: `${diffInHours} மணிநேரம் முன் புதுப்பிக்கப்பட்டது`,
      te: `${diffInHours} గంటల క్రితం నవీకరించబడింది`,
      mr: `${diffInHours} तासांपूर्वी अपडेट केले`,
      bn: `${diffInHours} ঘন্টা আগে আপডেট হয়েছে`
    };
    return translations[locale] || translations.en;
  }

  return date.toLocaleDateString();
};

export function LastSyncDisplay({ lastSyncedAt }: LastSyncDisplayProps) {
  const { activeLocale } = useLocaleStore();
  const [relativeTime, setRelativeTime] = useState('');
  const [isStale, setIsStale] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const syncDate = new Date(lastSyncedAt);
      setRelativeTime(getRelativeTimeString(syncDate, activeLocale));
      
      const diffInMinutes = Math.floor((new Date().getTime() - syncDate.getTime()) / 60000);
      setIsStale(diffInMinutes > 30);
    };

    updateTime();
    // Update every minute
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [lastSyncedAt, activeLocale]);

  if (!lastSyncedAt) return null;

  return (
    <div className={`flex items-center text-sm font-medium transition-colors ${
      isStale ? 'text-status-warning' : 'opacity-80'
    }`}>
      <Clock className="w-4 h-4 mr-1.5" aria-hidden="true" />
      <span>{relativeTime}</span>
      {isStale && (
        <span className="ml-2 px-2 py-0.5 rounded-full bg-status-warning/20 text-xs border border-status-warning/40">
          Data may be outdated
        </span>
      )}
    </div>
  );
}
