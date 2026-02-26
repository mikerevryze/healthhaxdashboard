import { motion } from "framer-motion";
import { SCREEN_COUNT } from "../types";

interface ProgressBarProps {
  currentScreen: number;
}

const SCREEN_LABELS = [
  "Welcome",
  "Profile",
  "Launch Plan",
  "Leads",
  "Financials",
  "Exposure",
  "Solution",
  "Next Steps",
];

export function ProgressBar({ currentScreen }: ProgressBarProps) {
  const progress = ((currentScreen + 1) / SCREEN_COUNT) * 100;

  return (
    <div className="w-full px-6 py-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium tracking-wider uppercase text-text-secondary">
            {SCREEN_LABELS[currentScreen] || ""}
          </span>
          <span className="font-mono text-xs text-text-muted">
            {currentScreen + 1}/{SCREEN_COUNT}
          </span>
        </div>
        <div className="relative h-1 w-full overflow-hidden rounded-full bg-surface-3">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-brand"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}
