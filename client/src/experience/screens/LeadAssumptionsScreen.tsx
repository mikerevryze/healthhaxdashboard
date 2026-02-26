import { motion } from "framer-motion";
import { ArrowRight, Users, Handshake, Target } from "lucide-react";
import type { LeadAssumptionsData, UserPath } from "../types";

interface LeadAssumptionsScreenProps {
  data: LeadAssumptionsData;
  userPath: UserPath;
  onChange: (updates: Partial<LeadAssumptionsData>) => void;
  onNext: () => void;
}

export function LeadAssumptionsScreen({
  data,
  userPath,
  onChange,
  onNext,
}: LeadAssumptionsScreenProps) {
  const totalOrganicLeads = data.b2bLeads + data.communityPopupLeads;
  const contextText =
    userPath === "franchisor"
      ? "What do you prescribe for your franchisees to generate outside of paid ads?"
      : "Beyond paid ads — what organic leads do you expect to generate?";

  return (
    <div className="mx-auto max-w-lg px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="mb-2 text-2xl font-bold text-text-primary">
          Lead Assumptions
        </h2>
        <p className="text-sm text-text-secondary">{contextText}</p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 rounded-lg border border-warning/20 bg-warning-dim px-4 py-3"
        >
          <p className="text-xs text-warning">
            Most owners overestimate organic leads by 40-60%.
            Be conservative here — your financial reality depends on it.
          </p>
        </motion.div>
      </motion.div>

      <div className="space-y-6">
        {/* B2B Leads */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <label className="mb-1.5 flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-text-muted">
            <Handshake size={12} />
            B2B / Corporate Partnership Leads
          </label>
          <input
            type="number"
            min={0}
            value={data.b2bLeads}
            onChange={(e) =>
              onChange({ b2bLeads: Math.max(0, parseInt(e.target.value) || 0) })
            }
            className="w-full rounded-lg border border-border-line bg-surface-2 px-4 py-3 text-sm text-text-primary outline-none transition-all focus:border-brand/40 focus:ring-1 focus:ring-brand/20"
          />
          <p className="mt-1 text-xs text-text-muted">
            Leads from local businesses, corporate wellness, employer partnerships
          </p>
        </motion.div>

        {/* Community / Pop-up Leads */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <label className="mb-1.5 flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-text-muted">
            <Users size={12} />
            Community / Pop-Up Event Leads
          </label>
          <input
            type="number"
            min={0}
            value={data.communityPopupLeads}
            onChange={(e) =>
              onChange({
                communityPopupLeads: Math.max(0, parseInt(e.target.value) || 0),
              })
            }
            className="w-full rounded-lg border border-border-line bg-surface-2 px-4 py-3 text-sm text-text-primary outline-none transition-all focus:border-brand/40 focus:ring-1 focus:ring-brand/20"
          />
          <p className="mt-1 text-xs text-text-muted">
            Pop-up workouts, community events, referral drives, local activations
          </p>
        </motion.div>

        {/* Close Rate */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <label className="mb-1.5 flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-text-muted">
            <Target size={12} />
            Expected Close Rate (%)
          </label>
          <div className="relative">
            <input
              type="number"
              min={1}
              max={100}
              value={data.expectedCloseRate}
              onChange={(e) =>
                onChange({
                  expectedCloseRate: Math.min(
                    100,
                    Math.max(1, parseInt(e.target.value) || 1)
                  ),
                })
              }
              className="w-full rounded-lg border border-border-line bg-surface-2 py-3 pl-4 pr-10 text-sm text-text-primary outline-none transition-all focus:border-brand/40 focus:ring-1 focus:ring-brand/20"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-text-muted">
              %
            </span>
          </div>
          <p className="mt-1 text-xs text-text-muted">
            Industry average presale close rate: 12-18%
          </p>
        </motion.div>
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="mt-6 rounded-xl border border-border-line bg-surface-2 p-4"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Total organic lead estimate:</span>
          <span className="font-mono text-lg font-bold text-text-primary">
            {totalOrganicLeads}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-xs text-text-muted">At {data.expectedCloseRate}% close rate:</span>
          <span className="font-mono text-sm text-brand">
            ~{Math.floor(totalOrganicLeads * (data.expectedCloseRate / 100))} conversions
          </span>
        </div>
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
          Continue to Financial Reality
          <ArrowRight size={16} />
        </button>
      </motion.div>
    </div>
  );
}
