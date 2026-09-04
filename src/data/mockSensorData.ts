// ============================================================================
// Mock Backend Data
// ============================================================================
// Simulates the payload from GET /api/sensors/latest on the Express backend.
// Contains realistic NPK, EC, pH readings along with 7-day history.
//
// This file is used for local development only and will be replaced by
// actual API calls in production.
// ============================================================================

import type { SensorPayload, SensorReading } from '../types';

/**
 * Helper to generate an ISO timestamp offset by `hoursAgo` hours from now.
 */
function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

/**
 * Generates a 7-day rolling history with hourly readings (168 data points).
 * Each parameter fluctuates around a base value with realistic sensor noise.
 */
function generateHistory(): SensorReading[] {
  const history: SensorReading[] = [];

  // Base values representing a field that starts low-nitrogen and gradually recovers
  const bases = {
    nitrogen: 38,     // starts in warning zone, trends up
    phosphorus: 28,   // optimal
    potassium: 180,   // optimal
    ph: 6.8,          // optimal
    ec: 0.9,          // optimal
  };

  for (let i = 168; i >= 0; i--) {
    // Simulate gradual nitrogen recovery (farmer applied urea 4 days ago)
    const nitrogenTrend = i > 96 ? bases.nitrogen : bases.nitrogen + (96 - i) * 0.15;
    // Add sensor noise ±3%
    const noise = () => 0.97 + Math.random() * 0.06;

    history.push({
      timestamp: hoursAgo(i),
      nitrogen: Math.round(nitrogenTrend * noise() * 10) / 10,
      phosphorus: Math.round(bases.phosphorus * noise() * 10) / 10,
      potassium: Math.round(bases.potassium * noise() * 10) / 10,
      ph: Math.round(bases.ph * noise() * 100) / 100,
      ec: Math.round(bases.ec * noise() * 100) / 100,
    });
  }

  return history;
}

// ── Primary Mock: Mixed Scenario ───────────────────────────────────────────
// This simulates a realistic field where nitrogen is recovering from a
// deficiency, phosphorus and potassium are healthy, pH is fine, and EC
// is slightly elevated.

const history = generateHistory();
const latestReading = history[history.length - 1];

export const MOCK_SENSOR_PAYLOAD: SensorPayload = {
  success: true,
  deviceId: 'FIELD-UNIT-KA-4821',
  latest: {
    timestamp: new Date().toISOString(),
    nitrogen: 42,       // WARNING — slightly low (warningLow=35, optimalLow=50)
    phosphorus: 35,     // OPTIMAL — well within range
    potassium: 210,     // OPTIMAL — well within range
    ph: 6.5,            // OPTIMAL — ideal
    ec: 1.8,            // WARNING — slightly high (optimalHigh=1.5, warningHigh=2.0)
  },
  history,
  serverTimestamp: new Date().toISOString(),
};

// ── Alternative Scenario: Critical Field ───────────────────────────────────
// Used for testing critical alert rendering.

export const MOCK_SENSOR_PAYLOAD_CRITICAL: SensorPayload = {
  success: true,
  deviceId: 'FIELD-UNIT-TN-0912',
  latest: {
    timestamp: new Date().toISOString(),
    nitrogen: 15,       // CRITICAL — severe deficiency
    phosphorus: 8,      // CRITICAL — very low
    potassium: 310,     // WARNING — slightly high
    ph: 5.2,            // WARNING — acidic
    ec: 2.5,            // CRITICAL — high salinity
  },
  history: generateHistory(),
  serverTimestamp: new Date().toISOString(),
};

// ── Alternative Scenario: Healthy Field ────────────────────────────────────
// Used for testing the "all green" state.

export const MOCK_SENSOR_PAYLOAD_HEALTHY: SensorPayload = {
  success: true,
  deviceId: 'FIELD-UNIT-MH-7734',
  latest: {
    timestamp: new Date().toISOString(),
    nitrogen: 75,       // OPTIMAL
    phosphorus: 40,     // OPTIMAL
    potassium: 220,     // OPTIMAL
    ph: 6.8,            // OPTIMAL
    ec: 0.8,            // OPTIMAL
  },
  history: generateHistory(),
  serverTimestamp: new Date().toISOString(),
};

// ── Stale / Offline Scenario ───────────────────────────────────────────────
// Simulates cached data that is 2 hours old (for testing offline indicator).

export const MOCK_SENSOR_PAYLOAD_STALE: SensorPayload = {
  success: true,
  deviceId: 'FIELD-UNIT-AP-3301',
  latest: {
    timestamp: hoursAgo(2),
    nitrogen: 55,
    phosphorus: 22,
    potassium: 165,
    ph: 7.2,
    ec: 1.1,
  },
  history: generateHistory(),
  serverTimestamp: hoursAgo(2),
};
