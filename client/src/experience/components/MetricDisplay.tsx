import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface MetricDisplayProps {
  label: string;
  value: string;
  subtext?: string;
  icon?: ReactNode;
  variant?: "default" | "danger" | "success" | "warning";
  delay?: number;
}

const variantStyles = {
  default: {
    border: "border-border-line",
    bg: "bg-surface-2",
    valueColor: "text-text-primary",
    iconBg: "bg-surface-3",
  },
  danger: {
    border: "border-danger/20",
    bg: "bg-danger-dim",
    valueColor: "text-danger",
    iconBg: "bg-danger/10",
  },
  success: {
    border: "border-brand/20",
    bg: "bg-success-dim",
    valueColor: "text-brand",
    iconBg: "bg-brand/10",
  },
  warning: {
    border: "border-warning/20",
    bg: "bg-warning-dim",
    valueColor: "text-warning",
    iconBg: "bg-warning/10",
  },
};

export function MetricDisplay({
  label,
  value,
  subtext,
  icon,
  variant = "default",
  delay = 0,
}: MetricDisplayProps) {
  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`rounded-xl border ${styles.border} ${styles.bg} p-5`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium tracking-wider uppercase text-text-muted">
          {label}
        </span>
        {icon && (
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${styles.iconBg}`}
          >
            {icon}
          </div>
        )}
      </div>
      <div className={`font-mono text-2xl font-bold ${styles.valueColor}`}>
        {value}
      </div>
      {subtext && (
        <p className="mt-1 text-xs text-text-muted">{subtext}</p>
      )}
    </motion.div>
  );
}
