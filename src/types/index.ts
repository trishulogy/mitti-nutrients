// ============================================================================
// Nutrient Intelligence Panel — Core TypeScript Interfaces
// ============================================================================
// These types model the full data pipeline from raw RS485/analog sensor
// telemetry through to the UI-ready advisory layer.
// ============================================================================

// ── Enums & Literal Types ──────────────────────────────────────────────────

/** Identifiers for each monitored soil parameter */
export type NutrientKey = 'nitrogen' | 'phosphorus' | 'potassium' | 'ph' | 'ec';

/** Traffic-light severity levels driving all visual states */
export type SeverityLevel = 'optimal' | 'warning' | 'critical';

/** Supported regional languages (BCP-47 subtags) */
export type LocaleCode = 'en' | 'hi' | 'ta' | 'te' | 'mr' | 'bn';

/** Aggregate soil-health classification */
export type OverallHealth = 'healthy' | 'attention' | 'critical';

/** API fetch lifecycle */
export type FetchStatus = 'idle' | 'loading' | 'success' | 'error';

// ── Backend Payload Shapes ─────────────────────────────────────────────────

/**
 * A single time-stamped reading from the sensor array.
 * This is the shape returned by `GET /api/sensors/latest`
 * and each element inside `GET /api/sensors/history`.
 */
export interface SensorReading {
  /** ISO-8601 timestamp of the reading */
  timestamp: string;
  /** Nitrogen concentration (mg/kg) — sourced from RS485 NPK sensor */
  nitrogen: number;
  /** Phosphorus concentration (mg/kg) — sourced from RS485 NPK sensor */
  phosphorus: number;
  /** Potassium concentration (mg/kg) — sourced from RS485 NPK sensor */
  potassium: number;
  /** Soil pH (0–14 scale) — sourced from analog pH probe */
  ph: number;
  /** Electrical Conductivity (mS/cm) — sourced from analog EC probe */
  ec: number;
}

/**
 * Full response envelope from `GET /api/sensors/latest`.
 * Wraps the latest reading with device & sync metadata.
 */
export interface SensorPayload {
  /** Whether the backend considers this data fresh */
  success: boolean;
  /** Unique device/gateway identifier */
  deviceId: string;
  /** The most recent sensor reading */
  latest: SensorReading;
  /** Rolling historical readings (last 7 days, one per hour or per fetch) */
  history: SensorReading[];
  /** Server-generated ISO timestamp of this response */
  serverTimestamp: string;
}

// ── Threshold Configuration ────────────────────────────────────────────────

/**
 * Defines the optimal range for a single nutrient.
 * Values below `low` or above `high` are critical;
 * values in the buffer zones are warnings.
 */
export interface ThresholdRange {
  /** Below this value → critical (deficiency) */
  criticalLow: number;
  /** Below this value → warning (low side) */
  warningLow: number;
  /** At or above this value → optimal begins */
  optimalLow: number;
  /** At or below this value → optimal ends */
  optimalHigh: number;
  /** Above this value → warning (high side) */
  warningHigh: number;
  /** Above this value → critical (excess/toxicity) */
  criticalHigh: number;
  /** Engineering unit string for display, e.g. "mg/kg" */
  unit: string;
}

/** Complete threshold table keyed by nutrient */
export type ThresholdMap = Record<NutrientKey, ThresholdRange>;

// ── Derived / UI-Ready Structures ──────────────────────────────────────────

/**
 * Computed status for a single nutrient, ready for the gauge component.
 * Produced by mapping a raw `SensorReading` value through its `ThresholdRange`.
 */
export interface NutrientStatus {
  /** Which nutrient this status represents */
  key: NutrientKey;
  /** The raw sensor value */
  value: number;
  /** Computed traffic-light level */
  severity: SeverityLevel;
  /** Translated nutrient name (e.g., "नाइट्रोजन") */
  label: string;
  /** Plain-language descriptor (e.g., "Soil energy") */
  descriptor: string;
  /** 0–1 normalized position of the value across the full range bar */
  rangePosition: number;
  /** Engineering unit (e.g., "mg/kg") */
  unit: string;
}

/**
 * A single actionable advisory card shown to the farmer.
 */
export interface Advisory {
  /** Unique identifier for React keying & expand-state tracking */
  id: string;
  /** Which nutrient triggered this advisory */
  nutrientKey: NutrientKey;
  /** Severity drives border color & sort order */
  severity: SeverityLevel;
  /** Translated plain-text action instruction */
  message: string;
  /** Optional expanded detail when the card is tapped */
  detailMessage?: string;
  /** Icon identifier for the advisory (e.g., "urea-bag", "water-drop") */
  iconName: string;
  /** Days until this action is due (used for urgency sorting) */
  dueInDays?: number;
}

// ── Component Prop Interfaces ──────────────────────────────────────────────

/** Props for <HealthHeroBanner> */
export interface HealthHeroBannerProps {
  overallHealth: OverallHealth;
  lastSyncedAt: string;
  isOnline: boolean;
}

/** Props for <VisualStatusGauge> */
export interface VisualStatusGaugeProps {
  nutrient: NutrientStatus;
  /** When true, shows the raw number below the gauge (expert mode) */
  showRawValue?: boolean;
  /** Controls entrance animation; default true */
  animate?: boolean;
}

/** Props for <TrafficLightIndicator> */
export interface TrafficLightIndicatorProps {
  severity: SeverityLevel;
  size?: 'sm' | 'md' | 'lg';
  /** When true and severity is critical, the dot pulses */
  pulse?: boolean;
}

/** Props for <RangeBar> */
export interface RangeBarProps {
  /** 0–1 normalized position of the marker */
  rangePosition: number;
  severity: SeverityLevel;
}

/** Props for <ActionableAlert> */
export interface ActionableAlertProps {
  advisory: Advisory;
  onExpand?: (id: string) => void;
}

/** Props for <ActionableAlertPanel> */
export interface ActionableAlertPanelProps {
  alerts: Advisory[];
}

/** Props for <LanguageToggle> */
export interface LanguageToggleProps {
  activeLocale: LocaleCode;
  onLocaleChange: (locale: LocaleCode) => void;
  availableLocales: LocaleOption[];
}

/** A selectable language entry */
export interface LocaleOption {
  code: LocaleCode;
  /** Native-script label (e.g., "हिन्दी") */
  label: string;
  /** English fallback label (e.g., "Hindi") */
  labelEn: string;
}

/** Props for <TextToSpeechButton> */
export interface TextToSpeechButtonProps {
  /** Concatenated advisory text to be read aloud */
  textToRead: string;
  locale: LocaleCode;
}

/** Props for <OfflineIndicator> */
export interface OfflineIndicatorProps {
  isOnline: boolean;
  lastOnlineAt?: string;
}

/** Props for <MiniSparkChart> */
export interface MiniSparkChartProps {
  data: SparkDataPoint[];
  /** Tailwind color class or hex value for the line */
  color: string;
  /** Chart height in pixels; default 40 */
  height?: number;
}

/** A single data point for sparkline rendering */
export interface SparkDataPoint {
  timestamp: string;
  value: number;
}

// ── Store State Interfaces ─────────────────────────────────────────────────

/** Shape of the sensor data Zustand slice */
export interface SensorState {
  raw: SensorReading | null;
  history: SensorReading[];
  deviceId: string | null;
  lastFetchedAt: string | null;
  fetchStatus: FetchStatus;
  error: string | null;

  // Actions
  setSensorData: (payload: SensorPayload) => void;
  setFetchStatus: (status: FetchStatus) => void;
  setError: (error: string | null) => void;
}

/** Shape of the connectivity Zustand slice */
export interface ConnectivityState {
  isOnline: boolean;
  lastOnlineAt: string | null;
  pendingSyncCount: number;

  // Actions
  setOnline: (online: boolean) => void;
  incrementPendingSync: () => void;
  resetPendingSync: () => void;
}

/** Shape of the locale Zustand slice */
export interface LocaleState {
  activeLocale: LocaleCode;

  // Actions
  setLocale: (locale: LocaleCode) => void;
}
