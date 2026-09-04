import { WifiOff } from 'lucide-react';
import type { OfflineIndicatorProps } from '../../types';

export function OfflineIndicator({ isOnline, lastOnlineAt }: OfflineIndicatorProps) {
  if (isOnline) {
    return null;
  }

  // Format the time since last online if available
  const timeInfo = lastOnlineAt 
    ? new Date(lastOnlineAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div 
      className="flex items-center bg-offline-badge-light text-offline-badge px-3 py-1.5 rounded-pill border border-offline-badge text-sm font-bold animate-in fade-in duration-300"
      role="status"
      aria-live="polite"
    >
      <div className="relative mr-2 flex items-center justify-center">
        <WifiOff className="w-4 h-4" aria-hidden="true" />
        {/* Pulsing dot indicator */}
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
          <span className="animate-offline-dot absolute inline-flex h-full w-full rounded-full bg-offline-badge opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-offline-badge"></span>
        </span>
      </div>
      <span className="hidden sm:inline">Offline Mode</span>
      <span className="sm:hidden">Offline</span>
      {timeInfo && <span className="ml-1 text-xs opacity-80 hidden md:inline"> (Since {timeInfo})</span>}
    </div>
  );
}
