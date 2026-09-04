// ============================================================================
// Nutrient Threshold Lookup Tables
// ============================================================================
// These thresholds define the boundary values for mapping raw sensor readings
// to traffic-light severity levels (optimal / warning / critical).
//
// Source: Generic Indian soil guidelines (ICAR). These should be replaced
// with agronomist-validated, crop-specific tables in production.
// ============================================================================

import type { ThresholdMap, ThresholdRange, NutrientKey, SeverityLevel } from '../types';

/**
 * Default threshold table — suitable for general-purpose crops (rice/wheat).
 * Each range defines: criticalLow < warningLow < optimalLow .. optimalHigh < warningHigh < criticalHigh
 */
export const DEFAULT_THRESHOLDS: ThresholdMap = {
  nitrogen: {
    criticalLow: 20,
    warningLow: 35,
    optimalLow: 50,
    optimalHigh: 120,
    warningHigh: 150,
    criticalHigh: 200,
    unit: 'mg/kg',
  },
  phosphorus: {
    criticalLow: 5,
    warningLow: 12,
    optimalLow: 20,
    optimalHigh: 60,
    warningHigh: 80,
    criticalHigh: 120,
    unit: 'mg/kg',
  },
  potassium: {
    criticalLow: 50,
    warningLow: 100,
    optimalLow: 150,
    optimalHigh: 300,
    warningHigh: 400,
    criticalHigh: 500,
    unit: 'mg/kg',
  },
  ph: {
    criticalLow: 4.0,
    warningLow: 5.5,
    optimalLow: 6.0,
    optimalHigh: 7.5,
    warningHigh: 8.0,
    criticalHigh: 9.0,
    unit: '',
  },
  ec: {
    criticalLow: 0.1,
    warningLow: 0.3,
    optimalLow: 0.5,
    optimalHigh: 1.5,
    warningHigh: 2.0,
    criticalHigh: 3.0,
    unit: 'mS/cm',
  },
};

/**
 * Maps a raw sensor value to a SeverityLevel using the threshold range.
 */
export function mapSeverity(value: number, range: ThresholdRange): SeverityLevel {
  if (value <= range.criticalLow || value >= range.criticalHigh) {
    return 'critical';
  }
  if (value <= range.warningLow || value >= range.warningHigh) {
    return 'warning';
  }
  if (value >= range.optimalLow && value <= range.optimalHigh) {
    return 'optimal';
  }
  // Edge case: falls between criticalLow–warningLow or warningHigh–criticalHigh
  return 'warning';
}

/**
 * Normalizes a raw value to a 0–1 position on the full range bar.
 * 0 = criticalLow, 1 = criticalHigh.
 * Clamped so values outside the range don't break the bar.
 */
export function normalizeToRange(value: number, range: ThresholdRange): number {
  const min = range.criticalLow;
  const max = range.criticalHigh;
  if (max === min) return 0.5;
  const normalized = (value - min) / (max - min);
  return Math.max(0, Math.min(1, normalized));
}

/**
 * Convenience: get severity for a specific nutrient key.
 */
export function getNutrientSeverity(
  key: NutrientKey,
  value: number,
  thresholds: ThresholdMap = DEFAULT_THRESHOLDS
): SeverityLevel {
  return mapSeverity(value, thresholds[key]);
}

/**
 * Convenience: get normalized range position for a specific nutrient key.
 */
export function getNutrientRangePosition(
  key: NutrientKey,
  value: number,
  thresholds: ThresholdMap = DEFAULT_THRESHOLDS
): number {
  return normalizeToRange(value, thresholds[key]);
}
