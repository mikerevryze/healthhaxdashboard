import { motion } from "framer-motion";
import { ArrowRight, Wallet, Clock, DollarSign } from "lucide-react";
import type { FinancialData, UserPath } from "../types";

interface FinancialRealityScreenProps {
  data: FinancialData;
  userPath: UserPath;
  onChange: (updates: Partial<FinancialData>) => void;
  onNext: () => void;
}

export function FinancialRealityScreen({
  data,
  userPath,
  onChange,
  onNext,
}: FinancialRealityScreenProps) {
  const annualMemberValue = data.avgMemberValue * data.avgMemberLifetimeMonths;
  const contextText =
    userPath === "franchisor"
      ? "What are the standard unit economics across your franchise network?"
      : "Let's establish your unit economics.";

  return (
    <div className="mx-auto max-w-lg px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="mb-2 text-2xl font-bold text-text-primary">
          Financial Reality
        </h2>
        <p className="text-sm text-text-secondary">{contextText}</p>
        <p className="mt-2 text-xs text-text-muted">
          These numbers define whether your opening survives month one — or bleeds cash.
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* Average Member Value */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="mb-1.5 flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-text-muted">
            <DollarSign size={12} />
            Average Prelaunch Member Value (monthly)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-text-muted">
              $
            </span>
            <input
              type="number"
              min={1}
              step={10}
              value={data.avgMemberValue}
              onChange={(e) =>
                onChange({
                  avgMemberValue: Math.max(1, parseInt(e.target.value) || 1),
                })
              }
              className="w-full rounded-lg border border-border-line bg-surface-2 py-3 pl-8 pr-4 text-sm text-text-primary outline-none transition-all focus:border-brand/40 focus:ring-1 focus:ring-brand/20"
            />
          </div>
          <p className="mt-1 text-xs text-text-muted">
            Typical founding member rate: $99 - $199/mo
          </p>
        </motion.div>

        {/* Member Lifetime */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="mb-1.5 flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-text-muted">
            <Clock size={12} />
            Average Member Lifetime (months)
          </label>
          <input
            type="number"
            min={1}
            max={60}
            value={data.avgMemberLifetimeMonths}
            onChange={(e) =>
              onChange({
                avgMemberLifetimeMonths: Math.min(
                  60,
                  Math.max(1, parseInt(e.target.value) || 1)
                ),
              })
            }
            className="w-full rounded-lg border border-border-line bg-surface-2 px-4 py-3 text-sm text-text-primary outline-none transition-all focus:border-brand/40 focus:ring-1 focus:ring-brand/20"
          />
          <div className="mt-2 flex items-center justify-between rounded-lg bg-surface-3 px-3 py-2">
            <span className="text-xs text-text-muted">Lifetime value per member:</span>
            <span className="font-mono text-sm font-semibold text-brand">
              ${annualMemberValue.toLocaleString()}
            </span>
          </div>
        </motion.div>

        {/* Monthly OPEX */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="mb-1.5 flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-text-muted">
            <Wallet size={12} />
            Monthly OPEX (rent + payroll + other)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-text-muted">
              $
            </span>
            <input
              type="number"
              min={0}
              step={1000}
              value={data.monthlyOpex}
              onChange={(e) =>
                onChange({
                  monthlyOpex: Math.max(0, parseInt(e.target.value) || 0),
                })
              }
              className="w-full rounded-lg border border-border-line bg-surface-2 py-3 pl-8 pr-4 text-sm text-text-primary outline-none transition-all focus:border-brand/40 focus:ring-1 focus:ring-brand/20"
            />
          </div>
          <p className="mt-1 text-xs text-text-muted">
            Combined monthly operating expenses — rent, payroll, insurance, utilities
          </p>
        </motion.div>
      </div>

      {/* Tension Builder */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 rounded-xl border border-warning/20 bg-warning-dim p-4"
      >
        <p className="text-sm font-medium text-warning">
          At ${data.monthlyOpex.toLocaleString()}/mo in OPEX, you need{" "}
          <span className="font-bold">
            {data.avgMemberValue > 0
              ? Math.ceil(data.monthlyOpex / data.avgMemberValue)
              : "—"}
          </span>{" "}
          members just to break even on day one.
        </p>
        <p className="mt-1 text-xs text-text-muted">
          Most owners don't realize this until it's too late.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
      >
        <button
          onClick={onNext}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-semibold text-surface-0 transition-all duration-200 hover:bg-brand-dim"
        >
          Reveal My Financial Exposure
          <ArrowRight size={16} />
        </button>
      </motion.div>
    </div>
  );
}
