import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Shield,
  Zap,
  Target,
  Users,
} from "lucide-react";
import type { Projections } from "../types";
import { formatCurrency } from "../calculations";
import { PROVEN_SYSTEM_STATS } from "../types";

interface TheSolutionScreenProps {
  projections: Projections;
  brandName: string;
  onNext: () => void;
}

const provenMetrics = [
  {
    icon: Users,
    value: "170+",
    label: "Avg founding members",
    detail: "Per location, before doors open",
  },
  {
    icon: TrendingUp,
    value: "$50K+",
    label: "Avg front-end revenue",
    detail: "Collected before opening day",
  },
  {
    icon: Shield,
    value: "Breakeven",
    label: "Day-one economics",
    detail: "Owners opening cash-flow positive",
  },
  {
    icon: Zap,
    value: "12 wks",
    label: "Execution timeline",
    detail: "Systematic 90-day presale window",
  },
];

const principles = [
  "Execution > marketing. A great ad with no follow-up system is a cash furnace.",
  "Leads ≠ revenue. 1,000 leads with 3% close rate = 30 members. That's survival mode.",
  "Presale is survival economics. The gap between 80 and 170 members is the gap between failure and freedom.",
  "Speed of lead-to-appointment is everything. 5 minutes vs. 5 hours changes close rates by 400%.",
];

export function TheSolutionScreen({
  projections,
  brandName,
  onNext,
}: TheSolutionScreenProps) {
  const improvement =
    PROVEN_SYSTEM_STATS.avgFoundingMembers - projections.projectedFounders;
  const additionalMRR =
    improvement > 0
      ? improvement * (projections.projectedOpeningMRR / Math.max(projections.projectedFounders, 1))
      : 0;

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      {/* Header - Relief */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success-dim"
        >
          <CheckCircle2 className="text-brand" size={28} />
        </motion.div>
        <h2 className="mb-3 text-2xl font-bold text-text-primary sm:text-3xl">
          There's a Proven System for This
        </h2>
        <p className="text-sm text-text-secondary">
          What if {brandName || "your brand"} could open every location with
          170+ founding members and $50K+ in front-end revenue — before the
          doors ever open?
        </p>
      </motion.div>

      {/* Proven Metrics Grid */}
      <div className="mb-10 grid grid-cols-2 gap-4">
        {provenMetrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="rounded-xl border border-brand/20 bg-success-dim p-5"
          >
            <metric.icon size={20} className="mb-3 text-brand" />
            <p className="font-mono text-2xl font-bold text-brand">
              {metric.value}
            </p>
            <p className="mt-1 text-sm font-medium text-text-primary">
              {metric.label}
            </p>
            <p className="mt-0.5 text-xs text-text-muted">{metric.detail}</p>
          </motion.div>
        ))}
      </div>

      {/* Your gap vs proven */}
      {improvement > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-10 rounded-xl border border-border-line bg-surface-2 p-6"
        >
          <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase text-text-secondary">
            Your gap vs. proven average
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-text-muted">Your projection</p>
              <p className="font-mono text-2xl font-bold text-warning">
                {projections.projectedFounders}
              </p>
              <p className="text-xs text-text-muted">founding members</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Proven system average</p>
              <p className="font-mono text-2xl font-bold text-brand">
                {PROVEN_SYSTEM_STATS.avgFoundingMembers}+
              </p>
              <p className="text-xs text-text-muted">founding members</p>
            </div>
          </div>
          <div className="mt-4 rounded-lg bg-surface-3 px-4 py-3">
            <p className="text-sm text-text-secondary">
              Closing that gap means{" "}
              <span className="font-mono font-bold text-brand">
                +{improvement} members
              </span>{" "}
              and an additional{" "}
              <span className="font-mono font-bold text-brand">
                {formatCurrency(additionalMRR)}
              </span>{" "}
              in monthly recurring revenue on opening day.
            </p>
          </div>
        </motion.div>
      )}

      {/* Principles */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mb-10"
      >
        <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase text-text-secondary">
          The principles that separate survivors from casualties
        </h3>
        <div className="space-y-3">
          {principles.map((principle, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 + i * 0.1 }}
              className="flex items-start gap-3 rounded-lg border border-border-line bg-surface-2 px-4 py-3"
            >
              <Target size={14} className="mt-0.5 shrink-0 text-brand" />
              <p className="text-sm text-text-secondary">{principle}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Urgency */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mb-8 text-center"
      >
        <p className="text-sm text-text-muted">
          Every week without a proven presale system is another week closer
          to opening with a revenue gap you can't recover from.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        <button
          onClick={onNext}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-semibold text-surface-0 transition-all duration-200 hover:bg-brand-dim"
        >
          See Your Options
          <ArrowRight size={16} />
        </button>
      </motion.div>
    </div>
  );
}
