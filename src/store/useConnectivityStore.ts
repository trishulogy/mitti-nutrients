// ============================================================================
// Connectivity Store (Zustand)
// ============================================================================
// Tracks online/offline state and pending sync queue count.
// Not persisted — connectivity is re-evaluated on every mount.
// ============================================================================

import { create } from 'zustand';
import type { ConnectivityState } from '../types';

export const useConnectivityStore = create<ConnectivityState>((set) => ({
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  lastOnlineAt: typeof navigator !== 'undefined' && navigator.onLine
    ? new Date().toISOString()
    : null,
  pendingSyncCount: 0,

  setOnline: (online: boolean) =>
    set((state) => ({
      isOnline: online,
      lastOnlineAt: online ? new Date().toISOString() : state.lastOnlineAt,
    })),

  incrementPendingSync: () =>
    set((state) => ({ pendingSyncCount: state.pendingSyncCount + 1 })),

  resetPendingSync: () =>
    set({ pendingSyncCount: 0 }),
}));
