import { useEffect, useMemo, useState } from 'react';
import { AccessibilityBar } from '../components/accessibility/AccessibilityBar';
import { HealthHeroBanner } from '../components/dashboard/HealthHeroBanner';
import { NutrientGrid } from '../components/gauges/NutrientGrid';
import { useConnectivityStore } from '../store/useConnectivityStore';
import { useLocaleStore } from '../store/useLocaleStore';
import { useSensorStore } from '../store/useSensorStore';
import {
  selectAdvisories,
  selectNutrientStatuses,
  selectOverallHealth,
} from '../store/selectors';
import {
  MOCK_SENSOR_PAYLOAD,
  MOCK_SENSOR_PAYLOAD_CRITICAL,
  MOCK_SENSOR_PAYLOAD_HEALTHY,
  MOCK_SENSOR_PAYLOAD_STALE,
} from '../data/mockSensorData';
import type { LocaleCode, OverallHealth, SensorPayload } from '../types';

const SECTION_TITLE: Record<LocaleCode, string> = {
  en: 'Soil Health Parameters',
  hi: 'मिट्टी स्वास्थ्य मापदंड',
  ta: 'மண் ஆரோக்கிய அளவுகள்',
  te: 'మట్టి ఆరోగ్య పరామితులు',
  mr: 'माती आरोग्य मापदंड',
  bn: 'মাটির স্বাস্থ্য পরামিতি',
};

const LOADING_LABEL: Record<LocaleCode, string> = {
  en: 'Loading field data…',
  hi: 'खेत का डेटा लोड हो रहा है…',
  ta: 'வயல் தரவு ஏற்றப்படுகிறது…',
  te: 'పొలం డేటా లోడ్ అవుతోంది…',
  mr: 'शेताचा डेटा लोड होत आहे…',
  bn: 'মাঠের তথ্য লোড হচ্ছে…',
};

const CACHED_HINT: Record<LocaleCode, string> = {
  en: 'Showing last saved field reading',
  hi: 'आखिरी सहेजी गई रीडिंग दिख रही है',
  ta: 'கடைசியாக சேமித்த வாசிப்பு காட்டப்படுகிறது',
  te: 'చివరిగా సేవ్ చేసిన రీడింగ్ చూపబడుతోంది',
  mr: 'शेवटची जतन केलेली रीडिंग दाखवली आहे',
  bn: 'শেষ সেভ করা রিডিং দেখানো হচ্ছে',
};

const HEALTH_SPEECH: Record<OverallHealth, Record<LocaleCode, string>> = {
  healthy: {
    en: 'Field is healthy',
    hi: 'खेत स्वस्थ है',
    ta: 'வயல் ஆரோக்கியமாக உள்ளது',
    te: 'పొలం ఆరోగ్యంగా ఉంది',
    mr: 'शेत निरोगी आहे',
    bn: 'মাঠ সুস্থ আছে',
  },
  attention: {
    en: 'Field needs attention',
    hi: 'खेत को ध्यान देने की जरूरत है',
    ta: 'வயலுக்கு கவனம் தேவை',
    te: 'పొలానికి శ్రద్ధ అవసరం',
    mr: 'शेताकडे लक्ष देण्याची गरज आहे',
    bn: 'মাঠে মনোযোগ প্রয়োজন',
  },
  critical: {
    en: 'Critical action needed',
    hi: 'गंभीर कार्रवाई की जरूरत है',
    ta: 'முக்கிய நடவடிக்கை தேவை',
    te: 'తక్షణ చర్య అవసరం',
    mr: 'तात्काळ कारवाईची गरज आहे',
    bn: 'জরুরী পদক্ষেপ প্রয়োজন',
  },
};

function useSensorHydration() {
  const [hydrated, setHydrated] = useState(() => useSensorStore.persist.hasHydrated());

  useEffect(() => {
    if (hydrated) return;
    return useSensorStore.persist.onFinishHydration(() => setHydrated(true));
  }, [hydrated]);

  return hydrated;
}

function applyLiveTimestamp(payload: SensorPayload): SensorPayload {
  const now = new Date().toISOString();
  return {
    ...payload,
    serverTimestamp: now,
    latest: { ...payload.latest, timestamp: now },
  };
}

export function NutrientDashboardPage() {
  const hydrated = useSensorHydration();
  const activeLocale = useLocaleStore((state) => state.activeLocale);
  const { isOnline, setOnline, incrementPendingSync, resetPendingSync, pendingSyncCount } =
    useConnectivityStore();
  const raw = useSensorStore((state) => state.raw);
  const lastFetchedAt = useSensorStore((state) => state.lastFetchedAt);
  const setSensorData = useSensorStore((state) => state.setSensorData);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnline]);

  useEffect(() => {
    if (!hydrated) return;
    if (!useSensorStore.getState().raw) {
      setSensorData(MOCK_SENSOR_PAYLOAD_HEALTHY);
    }
  }, [hydrated, setSensorData]);

  const syncIfOnline = (payload: SensorPayload, { stale = false } = {}) => {
    if (!isOnline) {
      incrementPendingSync();
      return;
    }
    setSensorData(stale ? payload : applyLiveTimestamp(payload));
    resetPendingSync();
  };

  const nutrientStatuses = useMemo(
    () => selectNutrientStatuses(raw, activeLocale),
    [raw, activeLocale],
  );
  const advisories = useMemo(
    () => selectAdvisories(raw, activeLocale),
    [raw, activeLocale],
  );
  const overallHealth = useMemo(() => selectOverallHealth(raw), [raw]);

  const ttsText = useMemo(() => {
    const actionItems = advisories
      .filter((item) => item.severity !== 'optimal')
      .map((item) => item.message);
    return [HEALTH_SPEECH[overallHealth][activeLocale], ...actionItems].join('. ');
  }, [activeLocale, advisories, overallHealth]);

  return (
    <div className="min-h-screen bg-surface-page font-sans text-text-primary pb-20">
      <AccessibilityBar textToRead={ttsText || SECTION_TITLE[activeLocale]} />

      <main className="max-w-md mx-auto p-4 space-y-4">
        {!isOnline && raw && (
          <p className="text-sm font-medium text-text-secondary px-1" role="status">
            {CACHED_HINT[activeLocale]}
          </p>
        )}

        <HealthHeroBanner
          overallHealth={overallHealth}
          lastSyncedAt={lastFetchedAt ?? ''}
          isOnline={isOnline}
        />

        <section>
          <h2 className="text-lg font-bold mb-3 px-1 text-text-primary">
            {SECTION_TITLE[activeLocale]}
          </h2>
          {!hydrated || nutrientStatuses.length === 0 ? (
            <p className="text-sm text-text-secondary px-1">{LOADING_LABEL[activeLocale]}</p>
          ) : (
            <NutrientGrid nutrients={nutrientStatuses} />
          )}
        </section>

        <SimulationPanel
          isOnline={isOnline}
          pendingSyncCount={pendingSyncCount}
          overallHealth={overallHealth}
          onSetOnline={setOnline}
          onSyncHealthy={() => syncIfOnline(MOCK_SENSOR_PAYLOAD_HEALTHY)}
          onSyncAttention={() => syncIfOnline(MOCK_SENSOR_PAYLOAD)}
          onSyncCritical={() => syncIfOnline(MOCK_SENSOR_PAYLOAD_CRITICAL)}
          onSyncStale={() => syncIfOnline(MOCK_SENSOR_PAYLOAD_STALE, { stale: true })}
        />
      </main>
    </div>
  );
}

interface SimulationPanelProps {
  isOnline: boolean;
  pendingSyncCount: number;
  overallHealth: OverallHealth;
  onSetOnline: (online: boolean) => void;
  onSyncHealthy: () => void;
  onSyncAttention: () => void;
  onSyncCritical: () => void;
  onSyncStale: () => void;
}

function SimulationPanel({
  isOnline,
  pendingSyncCount,
  overallHealth,
  onSetOnline,
  onSyncHealthy,
  onSyncAttention,
  onSyncCritical,
  onSyncStale,
}: SimulationPanelProps) {
  const buttonBase = 'px-3 py-1.5 text-sm rounded-lg border transition-colors';
  const active = 'text-text-inverse border-transparent';
  const idle = 'bg-surface-page text-text-secondary border-line hover:bg-surface-card-hover';

  return (
    <div className="card-surface rounded-card p-4 border border-line">
      <h3 className="text-sm font-bold text-text-primary mb-3">Simulation controls</h3>

      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold text-text-secondary mb-2">Connectivity</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onSetOnline(true)}
              className={`${buttonBase} ${isOnline ? `bg-status-optimal ${active}` : idle}`}
            >
              Online
            </button>
            <button
              type="button"
              onClick={() => onSetOnline(false)}
              className={`${buttonBase} ${!isOnline ? `bg-text-primary ${active}` : idle}`}
            >
              Offline
            </button>
          </div>
          {!isOnline && (
            <p className="mt-2 text-xs text-text-muted">
              Cached IndexedDB readings stay on screen. Sync taps queue until you go back online
              {pendingSyncCount > 0 ? ` (${pendingSyncCount} queued)` : ''}.
            </p>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold text-text-secondary mb-2">Mock field sync</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onSyncHealthy}
              className={`${buttonBase} ${overallHealth === 'healthy' ? `bg-status-optimal ${active}` : idle}`}
            >
              Healthy
            </button>
            <button
              type="button"
              onClick={onSyncAttention}
              className={`${buttonBase} ${overallHealth === 'attention' ? `bg-status-warning ${active}` : idle}`}
            >
              Attention
            </button>
            <button
              type="button"
              onClick={onSyncCritical}
              className={`${buttonBase} ${overallHealth === 'critical' ? `bg-status-critical ${active}` : idle}`}
            >
              Critical
            </button>
            <button type="button" onClick={onSyncStale} className={`${buttonBase} ${idle}`}>
              Stale cache
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}