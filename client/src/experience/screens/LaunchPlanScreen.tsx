import { motion } from "framer-motion";
import { ArrowRight, MapPin, DollarSign, Store } from "lucide-react";
import type { LaunchPlanData, PopulationDensity, UserPath } from "../types";
import { getCPL } from "../calculations";

interface LaunchPlanScreenProps {
  data: LaunchPlanData;
  userPath: UserPath;
  onChange: (updates: Partial<LaunchPlanData>) => void;
  onNext: () => void;
}

const densityOptions: { value: PopulationDensity; label: string; desc: string; cplHint: string }[] = [
  { value: "low", label: "Low Density", desc: "Rural / suburban fringe", cplHint: "~$40+ CPL" },
  { value: "medium", label: "Medium Density", desc: "Suburban / mid-market", cplHint: "~$26 CPL" },
  { value: "high", label: "High Density", desc: "Urban / metro center", cplHint: "~$15 CPL" },
];

export function LaunchPlanScreen({
  data,
  userPath,
  onChange,
  onNext,
}: LaunchPlanScreenProps) {
  const currentCPL = getCPL(data.populationDensity, data.adSpendPerOpening);
  const estimatedPaidLeads =
    data.adSpendPerOpening > 0 ? Math.floor(data.adSpendPerOpening / currentCPL) : 0;

  const contextPrefix =
    userPath === "franchisor"
      ? "What do you prescribe per franchisee opening?"
      : "What are you planning for your next opening?";

  return (
    <div className="mx-auto max-w-lg px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="mb-2 text-2xl font-bold text-text-primary">
          Launch Planning
        </h2>
        <p className="text-sm text-text-secondary">{contextPrefix}</p>
      </motion.div>

      <div className="space-y-6">
        {/* Number of Openings */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="mb-1.5 flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-text-muted">
            <Store size={12} />
            Openings in next 12 months
          </label>
          <input
            type="number"
            min={1}
            max={100}
            value={data.numOpenings}
            onChange={(e) =>
              onChange({ numOpenings: Math.max(1, parseInt(e.target.value) || 1) })
            }
            className="w-full rounded-lg border border-border-line bg-surface-2 px-4 py-3 text-sm text-text-primary outline-none transition-all focus:border-brand/40 focus:ring-1 focus:ring-brand/20"
          />
          {data.numOpenings > 1 && (
            <p className="mt-1 text-xs text-brand">
              Multi-unit impact will be calculated across {data.numOpenings} locations.
            </p>
          )}
        </motion.div>

        {/* Ad Spend */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="mb-1.5 flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-text-muted">
            <DollarSign size={12} />
            Ad spend per opening
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-text-muted">
              $
            </span>
            <input
              type="number"
              min={0}
              step={1000}
              value={data.adSpendPerOpening}
              onChange={(e) =>
                onChange({
                  adSpendPerOpening: Math.max(0, parseInt(e.target.value) || 0),
                })
              }
              className="w-full rounded-lg border border-border-line bg-surface-2 py-3 pl-8 pr-4 text-sm text-text-primary outline-none transition-all focus:border-brand/40 focus:ring-1 focus:ring-brand/20"
            />
          </div>
          <div className="mt-2 flex items-center justify-between rounded-lg bg-surface-3 px-3 py-2">
            <span className="text-xs text-text-muted">Estimated paid leads:</span>
            <span className="font-mono text-sm font-semibold text-brand">
              {estimatedPaidLeads}
            </span>
          </div>
        </motion.div>

        {/* Population Density */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="mb-3 flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-text-muted">
            <MapPin size={12} />
            Market Population Density
          </label>
          <div className="grid grid-cols-3 gap-3">
            {densityOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onChange({ populationDensity: opt.value })}
                className={`rounded-xl border p-4 text-center transition-all duration-200 ${
                  data.populationDensity === opt.value
                    ? "border-brand/40 bg-brand/10"
                    : "border-border-line bg-surface-2 hover:bg-surface-3"
                }`}
              >
                <span className="block text-sm font-semibold text-text-primary">
                  {opt.label}
                </span>
                <span className="mt-1 block text-xs text-text-muted">
                  {opt.desc}
                </span>
                <span className="mt-2 block font-mono text-xs text-text-secondary">
                  {opt.cplHint}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between rounded-lg bg-surface-3 px-3 py-2">
            <span className="text-xs text-text-muted">Dynamic CPL:</span>
            <span className="font-mono text-sm font-semibold text-text-primary">
              ${currentCPL.toFixed(2)}
            </span>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <button
          onClick={onNext}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-semibold text-surface-0 transition-all duration-200 hover:bg-brand-dim"
        >
          Continue to Lead Assumptions
          <ArrowRight size={16} />
        </button>
      </motion.div>
    </div>
  );
}
