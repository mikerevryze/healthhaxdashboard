import { motion } from "framer-motion";
import {
  ArrowRight,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  BarChart3,
  Users,
  Calculator,
} from "lucide-react";
import type { Projections } from "../types";
import { formatCurrency } from "../calculations";
import { SurvivalMeter } from "../components/SurvivalMeter";
import { MetricDisplay } from "../components/MetricDisplay";
import { PROVEN_SYSTEM_STATS } from "../types";

interface RevenueExposureScreenProps {
  projections: Projections;
  numOpenings: number;
  onNext: () => void;
}

export function RevenueExposureScreen({
  projections,
  numOpenings,
  onNext,
}: RevenueExposureScreenProps) {
  const p = projections;
  const isMultiUnit = numOpenings > 1;

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      {/* Dramatic Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-danger-dim"
        >
          <AlertTriangle className="text-danger" size={28} />
        </motion.div>
        <h2 className="mb-2 text-2xl font-bold text-text-primary sm:text-3xl">
          Your Revenue Exposure
        </h2>
        <p className="text-sm text-text-secondary">
          Based on your inputs, here's the financial reality of your opening.
        </p>
      </motion.div>

      {/* Survival Meter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <SurvivalMeter
          score={p.survivalScore}
          projectedFounders={p.projectedFounders}
          threshold={PROVEN_SYSTEM_STATS.survivalThreshold}
        />
      </motion.div>

      {/* OPEX vs MRR Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-8 rounded-xl border border-border-line bg-surface-2 p-6"
      >
        <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase text-text-secondary">
          Opening Day: OPEX vs Revenue
        </h3>
        <div className="space-y-4">
          {/* OPEX Bar */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs text-text-muted">Monthly OPEX</span>
              <span className="font-mono text-sm font-bold text-danger">
                {formatCurrency(p.monthlyOpex)}
              </span>
            </div>
            <div className="h-8 w-full overflow-hidden rounded-lg bg-surface-3">
              <motion.div
                className="flex h-full items-center rounded-lg bg-danger/30 px-3"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <span className="text-xs font-medium text-danger">Burn</span>
              </motion.div>
            </div>
          </div>

          {/* MRR Bar */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs text-text-muted">Projected Opening MRR</span>
              <span
                className={`font-mono text-sm font-bold ${
                  p.opexRunwayRatio >= 1 ? "text-brand" : "text-warning"
                }`}
              >
                {formatCurrency(p.projectedOpeningMRR)}
              </span>
            </div>
            <div className="h-8 w-full overflow-hidden rounded-lg bg-surface-3">
              <motion.div
                className={`flex h-full items-center rounded-lg px-3 ${
                  p.opexRunwayRatio >= 1 ? "bg-brand/30" : "bg-warning/30"
                }`}
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min(100, p.opexRunwayRatio * 100)}%`,
                }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                <span
                  className={`text-xs font-medium ${
                    p.opexRunwayRatio >= 1 ? "text-brand" : "text-warning"
                  }`}
                >
                  {p.opexRunwayRatio >= 1 ? "Covered" : "Gap"}
                </span>
              </motion.div>
            </div>
          </div>

          {/* Gap indicator */}
          {p.opexRunwayRatio < 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="rounded-lg border border-danger/20 bg-danger-dim px-4 py-3"
            >
              <p className="text-sm font-medium text-danger">
                Revenue gap:{" "}
                <span className="font-mono font-bold">
                  {formatCurrency(p.monthlyOpex - p.projectedOpeningMRR)}
                </span>{" "}
                /mo shortfall
              </p>
              <p className="mt-1 text-xs text-text-muted">
                Your opening MRR covers only{" "}
                {Math.round(p.opexRunwayRatio * 100)}% of operating expenses.
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Key Metrics Grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <MetricDisplay
          label="Projected Founders"
          value={p.projectedFounders.toString()}
          subtext={`of ${PROVEN_SYSTEM_STATS.survivalThreshold} needed`}
          icon={<Users size={16} className="text-text-secondary" />}
          variant={p.isAboveSurvivalThreshold ? "success" : "danger"}
          delay={0.6}
        />
        <MetricDisplay
          label="Cost to Acquire"
          value={formatCurrency(p.cac)}
          subtext="per member (CAC)"
          icon={<DollarSign size={16} className="text-text-secondary" />}
          variant="default"
          delay={0.7}
        />
        <MetricDisplay
          label="Lifetime Value"
          value={formatCurrency(p.ltv)}
          subtext={`LTV:CAC = ${p.ltvCacRatio.toFixed(1)}x`}
          icon={<BarChart3 size={16} className="text-text-secondary" />}
          variant={p.ltvCacRatio >= 3 ? "success" : "warning"}
          delay={0.8}
        />
        <MetricDisplay
          label="Front-End Revenue"
          value={formatCurrency(p.totalFrontEndRevenue)}
          subtext="opening month"
          icon={<Calculator size={16} className="text-text-secondary" />}
          variant="default"
          delay={0.9}
        />
        <MetricDisplay
          label="Required for $30K"
          value={`${p.requiredMembersFor30K} members`}
          subtext="to hit $30K MRR"
          icon={<TrendingDown size={16} className="text-text-secondary" />}
          variant={
            p.projectedFounders >= p.requiredMembersFor30K ? "success" : "danger"
          }
          delay={1.0}
        />
        <MetricDisplay
          label="Revenue Left Behind"
          value={formatCurrency(p.revenueLeftOnTable)}
          subtext={`${p.memberGap} member gap vs. proven avg`}
          icon={<AlertTriangle size={16} className="text-text-secondary" />}
          variant={p.memberGap > 0 ? "danger" : "success"}
          delay={1.1}
        />
      </div>

      {/* Multi-Unit Impact */}
      {isMultiUnit && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mb-8 rounded-xl border border-border-line bg-surface-2 p-5"
        >
          <h3 className="mb-3 text-sm font-semibold tracking-wider uppercase text-text-secondary">
            Multi-Unit Impact ({numOpenings} locations)
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="font-mono text-xl font-bold text-text-primary">
                {p.multiUnitTotalFounders}
              </p>
              <p className="text-xs text-text-muted">Total founders</p>
            </div>
            <div>
              <p className="font-mono text-xl font-bold text-text-primary">
                {formatCurrency(p.multiUnitTotalMRR)}
              </p>
              <p className="text-xs text-text-muted">Combined MRR</p>
            </div>
            <div>
              <p className="font-mono text-xl font-bold text-danger">
                {formatCurrency(p.revenueLeftOnTable * numOpenings)}
              </p>
              <p className="text-xs text-text-muted">Total left on table</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stat callout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="mb-8 text-center"
      >
        <p className="text-lg font-medium text-text-secondary">
          <span className="font-bold text-danger">
            {PROVEN_SYSTEM_STATS.failureProbabilityBelowThreshold}%
          </span>{" "}
          of fitness studios that open below{" "}
          <span className="font-bold text-text-primary">
            {PROVEN_SYSTEM_STATS.survivalThreshold} founding members
          </span>{" "}
          fail within 18 months.
        </p>
        <p className="mt-2 text-sm text-text-muted">
          Leads don't equal revenue. Presale is survival economics.
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
          See What Proven Execution Looks Like
          <ArrowRight size={16} />
        </button>
      </motion.div>
    </div>
  );
}
