import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ArrowRight,
  Calendar,
  FileText,
  Send,
  Loader2,
} from "lucide-react";
import type { ExperienceState, Projections } from "../types";
import { formatCurrency } from "../calculations";
import { PROVEN_SYSTEM_STATS } from "../types";

interface FinalScreenProps {
  state: ExperienceState;
  projections: Projections;
  onSubmit: () => Promise<void>;
}

export function FinalScreen({ state, projections, onSubmit }: FinalScreenProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit();
      setSubmitted(true);
    } catch {
      // Allow retry
    } finally {
      setSubmitting(false);
    }
  };

  const p = projections;
  const brandName = state.profile.brandName || "Your Brand";

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h2 className="mb-3 text-2xl font-bold text-text-primary sm:text-3xl">
          Your Prelaunch Audit is Complete
        </h2>
        <p className="text-sm text-text-secondary">
          {brandName} — here's your financial summary and what comes next.
        </p>
      </motion.div>

      {/* Executive Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8 rounded-xl border border-border-line bg-surface-2 p-6"
      >
        <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase text-text-secondary">
          Audit Summary
        </h3>
        <div className="space-y-3">
          <SummaryRow
            label="Projected founding members"
            value={p.projectedFounders.toString()}
            highlight={!p.isAboveSurvivalThreshold}
          />
          <SummaryRow
            label="Projected opening MRR"
            value={formatCurrency(p.projectedOpeningMRR)}
          />
          <SummaryRow
            label="Monthly OPEX"
            value={formatCurrency(p.monthlyOpex)}
          />
          <SummaryRow
            label="OPEX coverage ratio"
            value={`${Math.round(p.opexRunwayRatio * 100)}%`}
            highlight={p.opexRunwayRatio < 1}
          />
          <SummaryRow label="CAC" value={formatCurrency(p.cac)} />
          <SummaryRow label="LTV" value={formatCurrency(p.ltv)} />
          <SummaryRow
            label="LTV:CAC ratio"
            value={`${p.ltvCacRatio.toFixed(1)}x`}
          />
          <div className="border-t border-border-line pt-3">
            <SummaryRow
              label="Revenue left on table"
              value={formatCurrency(p.revenueLeftOnTable)}
              highlight={p.revenueLeftOnTable > 0}
              bold
            />
          </div>
          {state.launchPlan.numOpenings > 1 && (
            <div className="border-t border-border-line pt-3">
              <SummaryRow
                label={`Multi-unit impact (${state.launchPlan.numOpenings} locations)`}
                value={formatCurrency(p.revenueLeftOnTable * state.launchPlan.numOpenings)}
                highlight
                bold
              />
            </div>
          )}
        </div>
      </motion.div>

      {/* Two Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-10"
      >
        <p className="mb-6 text-center text-sm font-medium tracking-wider uppercase text-text-muted">
          You now have two options
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Option 1 */}
          <div className="rounded-xl border border-border-line bg-surface-2 p-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-surface-3">
              <FileText size={20} className="text-text-secondary" />
            </div>
            <h4 className="mb-2 text-base font-semibold text-text-primary">
              Execute Internally
            </h4>
            <p className="text-sm text-text-muted">
              Use this audit data to build and manage your presale execution
              in-house. Hire the team, build the systems, manage the timeline.
            </p>
            <ul className="mt-3 space-y-1.5">
              <li className="flex items-start gap-2 text-xs text-text-muted">
                <span className="mt-0.5 text-text-muted">-</span>
                Requires dedicated presale team
              </li>
              <li className="flex items-start gap-2 text-xs text-text-muted">
                <span className="mt-0.5 text-text-muted">-</span>
                6-12 month learning curve
              </li>
              <li className="flex items-start gap-2 text-xs text-text-muted">
                <span className="mt-0.5 text-text-muted">-</span>
                Trial and error on systems
              </li>
            </ul>
          </div>

          {/* Option 2 */}
          <div className="gradient-border rounded-xl p-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10">
              <Zap size={20} className="text-brand" />
            </div>
            <h4 className="mb-2 text-base font-semibold text-text-primary">
              Install a Proven System
            </h4>
            <p className="text-sm text-text-muted">
              Deploy Revryze's presale execution system — the same framework
              averaging {PROVEN_SYSTEM_STATS.avgFoundingMembers}+ founding members
              and ${(PROVEN_SYSTEM_STATS.avgFrontEndRevenue / 1000).toFixed(0)}K+
              front-end revenue per location.
            </p>
            <ul className="mt-3 space-y-1.5">
              <li className="flex items-start gap-2 text-xs text-brand">
                <CheckCircle2 size={12} className="mt-0.5 shrink-0" />
                Proven 90-day execution playbook
              </li>
              <li className="flex items-start gap-2 text-xs text-brand">
                <CheckCircle2 size={12} className="mt-0.5 shrink-0" />
                Dedicated presale operations team
              </li>
              <li className="flex items-start gap-2 text-xs text-brand">
                <CheckCircle2 size={12} className="mt-0.5 shrink-0" />
                Real-time pipeline management
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-center"
      >
        {!submitted ? (
          <>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-8 py-4 text-base font-semibold text-surface-0 transition-all duration-200 hover:bg-brand-dim disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Generating your report...
                </>
              ) : (
                <>
                  <Calendar size={18} />
                  Book Your Free Prelaunch Consultation
                </>
              )}
            </button>
            <p className="mt-3 text-xs text-text-muted">
              We'll send your full audit report and a personalized
              presale roadmap for {brandName}.
            </p>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl border border-brand/30 bg-success-dim p-8"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand/20">
              <Send className="text-brand" size={24} />
            </div>
            <h3 className="mb-2 text-xl font-bold text-text-primary">
              Audit Submitted
            </h3>
            <p className="text-sm text-text-secondary">
              Your full prelaunch revenue audit has been submitted. Our team
              will review your numbers and reach out within 24 hours with
              your personalized presale roadmap.
            </p>
            <p className="mt-4 text-xs text-text-muted">
              Check your email at{" "}
              <span className="text-brand">{state.profile.email}</span> for
              confirmation.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

function Zap(props: { size: number; className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size}
      height={props.size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
  );
}

function SummaryRow({
  label,
  value,
  highlight = false,
  bold = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={`text-sm ${bold ? "font-medium text-text-primary" : "text-text-secondary"}`}
      >
        {label}
      </span>
      <span
        className={`font-mono text-sm ${
          bold ? "text-base font-bold" : "font-semibold"
        } ${highlight ? "text-danger" : "text-text-primary"}`}
      >
        {value}
      </span>
    </div>
  );
}
