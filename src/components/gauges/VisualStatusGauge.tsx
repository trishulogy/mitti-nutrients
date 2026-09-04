import { useLocaleStore } from '../../store/useLocaleStore';
import { TrafficLightIndicator } from './TrafficLightIndicator';
import type { VisualStatusGaugeProps, LocaleCode, SeverityLevel } from '../../types';

const getStatusLabel = (severity: SeverityLevel, rangePosition: number, locale: LocaleCode) => {
  if (severity === 'optimal') {
    const optimalLabels: Record<LocaleCode, string> = {
      en: 'Good', hi: 'उत्तम', ta: 'நல்லது', te: 'మంచిది', mr: 'उत्तम', bn: 'ভালো',
    };
    return optimalLabels[locale];
  }

  if (rangePosition < 0.5) {
    const lowLabels: Record<LocaleCode, string> = {
      en: 'Low', hi: 'कम', ta: 'குறைவு', te: 'తక్కువ', mr: 'कमी', bn: 'কম',
    };
    return lowLabels[locale];
  }

  const highLabels: Record<LocaleCode, string> = {
    en: 'High', hi: 'अधिक', ta: 'அதிகம்', te: 'ఎక్కువ', mr: 'जास्त', bn: 'বেশি',
  };
  return highLabels[locale];
};

export function VisualStatusGauge({ nutrient }: VisualStatusGaugeProps) {
  const { activeLocale } = useLocaleStore();
  const statusLabel = getStatusLabel(nutrient.severity, nutrient.rangePosition, activeLocale);

  const borderStyles = {
    optimal: 'border-l-status-optimal',
    warning: 'border-l-status-warning',
    critical: 'border-l-status-critical',
  };

  return (
    <div
      className={`card-surface w-full flex flex-col gap-4 p-5 rounded-card border border-line border-l-4 ${borderStyles[nutrient.severity]}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-bold text-text-primary leading-snug break-words">
            {nutrient.label}
          </h3>
          <p className="mt-0.5 text-sm font-medium text-text-secondary">
            {nutrient.descriptor}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 bg-surface-page px-3 py-2 rounded-pill border border-line">
          <TrafficLightIndicator severity={nutrient.severity} size="lg" />
          <span className="whitespace-nowrap text-base font-bold text-text-primary">
            {statusLabel}
          </span>
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-raw-value text-3xl text-text-primary leading-none">
          {nutrient.value}
        </span>
        <span className="text-sm font-medium text-text-secondary">{nutrient.unit}</span>
      </div>
    </div>
  );
}