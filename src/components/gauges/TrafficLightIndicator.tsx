import type { TrafficLightIndicatorProps } from '../../types';

export function TrafficLightIndicator({ severity, size = 'md', pulse = true }: TrafficLightIndicatorProps) {
  // Map severity to sizes
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  // Map severity to background colors and optional pulsing
  const severityStyles = {
    optimal: 'bg-status-optimal shadow-[0_0_8px_var(--color-status-optimal-glow)]',
    warning: 'bg-status-warning shadow-[0_0_8px_var(--color-status-warning-glow)]',
    critical: `bg-status-critical shadow-[0_0_8px_var(--color-status-critical-glow)] ${pulse ? 'animate-critical-pulse' : ''}`,
  };

  return (
    <div
      className={`rounded-full ${sizeClasses[size]} ${severityStyles[severity]}`}
      role="status"
      aria-label={`Status: ${severity}`}
    />
  );
}
