import { motion } from "framer-motion";

interface SurvivalMeterProps {
  score: number; // 0-100
  projectedFounders: number;
  threshold: number;
}

export function SurvivalMeter({
  score,
  projectedFounders,
  threshold,
}: SurvivalMeterProps) {
  const isAbove = projectedFounders >= threshold;
  const meterColor = isAbove ? "bg-brand" : score > 60 ? "bg-warning" : "bg-danger";
  const glowClass = isAbove ? "brand-glow" : "danger-glow";
  const label = isAbove ? "SURPLUS" : score > 60 ? "AT RISK" : "SURVIVAL MODE";

  return (
    <div className={`rounded-xl border border-border-line p-6 ${glowClass} bg-surface-2`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-wider uppercase text-text-secondary">
          Opening Survival Meter
        </h3>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold tracking-wider ${
            isAbove
              ? "bg-success-dim text-brand"
              : score > 60
                ? "bg-warning-dim text-warning"
                : "bg-danger-dim text-danger"
          }`}
        >
          {label}
        </span>
      </div>

      <div className="relative mb-3 h-4 w-full overflow-hidden rounded-full bg-surface-3">
        <motion.div
          className={`absolute inset-y-0 left-0 rounded-full ${meterColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(score, 100)}%` }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
        {/* Threshold marker */}
        <div
          className="absolute top-0 h-full w-0.5 bg-text-primary/40"
          style={{ left: "100%" }}
        />
      </div>

      <div className="flex items-end justify-between">
        <div>
          <span className="font-mono text-3xl font-bold text-text-primary">
            {projectedFounders}
          </span>
          <span className="ml-2 text-sm text-text-muted">
            projected founding members
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs text-text-muted">
            Survival threshold:{" "}
            <span className="font-semibold text-text-secondary">{threshold}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
