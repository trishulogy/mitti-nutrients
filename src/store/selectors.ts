// ============================================================================
// Derived Selectors
// ============================================================================
// Computes UI-ready data (NutrientStatus[], Advisory[], OverallHealth) by
// combining raw sensor state, threshold tables, and active locale.
// These are pure functions — no store mutations — called from components
// via Zustand selectors for automatic re-render on dependency changes.
// ============================================================================

import type {
  SensorReading,
  NutrientKey,
  NutrientStatus,
  Advisory,
  SeverityLevel,
  OverallHealth,
  LocaleCode,
} from '../types';
import { DEFAULT_THRESHOLDS, getNutrientSeverity, getNutrientRangePosition } from '../utils/thresholds';
import { buildAllAdvisories } from '../utils/buildAdvisories';

// ── Nutrient display metadata ──────────────────────────────────────────────

const NUTRIENT_LABELS: Record<NutrientKey, Record<LocaleCode, string>> = {
  nitrogen: {
    en: 'Nitrogen',
    hi: 'नाइट्रोजन',
    ta: 'நைட்ரஜன்',
    te: 'నత్రజని',
    mr: 'नायट्रोजन',
    bn: 'নাইট্রোজেন',
  },
  phosphorus: {
    en: 'Phosphorus',
    hi: 'फॉस्फोरस',
    ta: 'பாஸ்பரஸ்',
    te: 'భాస్వరం',
    mr: 'फॉस्फरस',
    bn: 'ফসফরাস',
  },
  potassium: {
    en: 'Potassium',
    hi: 'पोटैशियम',
    ta: 'பொட்டாசியம்',
    te: 'పొటాషియం',
    mr: 'पोटॅशियम',
    bn: 'পটাশিয়াম',
  },
  ph: {
    en: 'Soil pH',
    hi: 'मिट्टी का pH',
    ta: 'மண் pH',
    te: 'మట్టి pH',
    mr: 'मातीचा pH',
    bn: 'মাটির pH',
  },
  ec: {
    en: 'Soil EC',
    hi: 'मिट्टी की EC',
    ta: 'மண் EC',
    te: 'మట్టి EC',
    mr: 'मातीची EC',
    bn: 'মাটির EC',
  },
};

const NUTRIENT_DESCRIPTORS: Record<NutrientKey, Record<LocaleCode, string>> = {
  nitrogen: {
    en: 'Growth power',
    hi: 'बढ़त की ताकत',
    ta: 'வளர்ச்சி சக்தி',
    te: 'పెరుగుదల శక్తి',
    mr: 'वाढीची ताकद',
    bn: 'বৃদ্ধির শক্তি',
  },
  phosphorus: {
    en: 'Root strength',
    hi: 'जड़ों की मजबूती',
    ta: 'வேர் வலிமை',
    te: 'వేరు బలం',
    mr: 'मुळांची ताकद',
    bn: 'শিকড়ের শক্তি',
  },
  potassium: {
    en: 'Disease shield',
    hi: 'रोग रक्षा',
    ta: 'நோய் தடுப்பு',
    te: 'వ్యాధి రక్షణ',
    mr: 'रोग संरक्षण',
    bn: 'রোগ প্রতিরোধ',
  },
  ph: {
    en: 'Soil balance',
    hi: 'मिट्टी का संतुलन',
    ta: 'மண் சமநிலை',
    te: 'మట్టి సమతుల్యత',
    mr: 'मातीचा समतोल',
    bn: 'মাটির ভারসাম্য',
  },
  ec: {
    en: 'Salt level',
    hi: 'नमक का स्तर',
    ta: 'உப்பு அளவு',
    te: 'ఉప్పు స్థాయి',
    mr: 'मीठाचे प्रमाण',
    bn: 'লবণের মাত্রা',
  },
};

// ── Selector Functions ─────────────────────────────────────────────────────

const NUTRIENT_KEYS: NutrientKey[] = ['nitrogen', 'phosphorus', 'potassium', 'ph', 'ec'];

/**
 * Derives NutrientStatus[] from a raw sensor reading.
 * Each status contains the severity, translated label, descriptor,
 * and normalized range position for the gauge UI.
 */
export function selectNutrientStatuses(
  raw: SensorReading | null,
  locale: LocaleCode
): NutrientStatus[] {
  if (!raw) return [];

  return NUTRIENT_KEYS.map((key) => {
    const value = raw[key];
    const severity = getNutrientSeverity(key, value);
    const rangePosition = getNutrientRangePosition(key, value);

    return {
      key,
      value,
      severity,
      label: NUTRIENT_LABELS[key][locale],
      descriptor: NUTRIENT_DESCRIPTORS[key][locale],
      rangePosition,
      unit: DEFAULT_THRESHOLDS[key].unit,
    };
  });
}

/**
 * Derives sorted Advisory[] from a raw sensor reading and locale.
 */
export function selectAdvisories(
  raw: SensorReading | null,
  locale: LocaleCode
): Advisory[] {
  if (!raw) return [];

  const severities = Object.fromEntries(
    NUTRIENT_KEYS.map((key) => [key, getNutrientSeverity(key, raw[key])])
  ) as Record<NutrientKey, SeverityLevel>;

  return buildAllAdvisories(severities, locale);
}

/**
 * Computes the aggregate OverallHealth from all nutrient severities.
 *
 * Logic:
 * - If ANY nutrient is critical → 'critical'
 * - If ANY nutrient is warning → 'attention'
 * - Otherwise → 'healthy'
 */
export function selectOverallHealth(raw: SensorReading | null): OverallHealth {
  if (!raw) return 'attention';

  const severities = NUTRIENT_KEYS.map((key) => getNutrientSeverity(key, raw[key]));

  if (severities.includes('critical')) return 'critical';
  if (severities.includes('warning')) return 'attention';
  return 'healthy';
}
