// ============================================================================
// Sensor Data Store (Zustand)
// ============================================================================
// Manages raw sensor readings, fetch lifecycle, and IndexedDB persistence.
// This is the single source of truth for all telemetry data in the app.
// ============================================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';
import type { SensorState, SensorPayload, FetchStatus } from '../types';

/**
 * Custom IndexedDB storage adapter for Zustand's persist middleware.
 * Falls back gracefully if IndexedDB is unavailable.
 */
const indexedDBStorage = createJSONStorage(() => ({
  getItem: async (name: string): Promise<string | null> => {
    try {
      return (await get(name)) ?? null;
    } catch {
      console.warn('[SensorStore] IndexedDB read failed, returning null');
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await set(name, value);
    } catch {
      console.warn('[SensorStore] IndexedDB write failed');
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await del(name);
    } catch {
      console.warn('[SensorStore] IndexedDB delete failed');
    }
  },
}));

export const useSensorStore = create<SensorState>()(
  persist(
    (set) => ({
      // ── Initial State ──────────────────────────────────────────────
      raw: null,
      history: [],
      deviceId: null,
      lastFetchedAt: null,
      fetchStatus: 'idle' as FetchStatus,
      error: null,

      // ── Actions ────────────────────────────────────────────────────

      setSensorData: (payload: SensorPayload) =>
        set({
          raw: payload.latest,
          history: payload.history.slice(-168), // keep last 7 days (hourly)
          deviceId: payload.deviceId,
          lastFetchedAt: payload.serverTimestamp,
          fetchStatus: 'success',
          error: null,
        }),

      setFetchStatus: (status: FetchStatus) =>
        set({ fetchStatus: status }),

      setError: (error: string | null) =>
        set({ error, fetchStatus: 'error' }),
    }),
    {
      name: 'nutrient-panel-sensor-cache',
      storage: indexedDBStorage,
      // Only persist data fields, not transient fetch state
      partialize: (state) => ({
        raw: state.raw,
        history: state.history,
        deviceId: state.deviceId,
        lastFetchedAt: state.lastFetchedAt,
      }),
    }
  )
);
