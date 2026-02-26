import { motion } from "framer-motion";
import { Building2, Crown } from "lucide-react";
import type { UserPath } from "../types";

interface WelcomeScreenProps {
  onSelectPath: (path: UserPath) => void;
}

export function WelcomeScreen({ onSelectPath }: WelcomeScreenProps) {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-brand"
        >
          <span className="text-xl font-black text-surface-0">R</span>
        </motion.div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
          Prelaunch Revenue Audit
        </h1>
        <p className="mx-auto max-w-lg text-lg text-text-secondary">
          A confidential financial stress test for franchise operators
          planning their next opening.
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm text-text-muted">
          In the next few minutes, you'll see exactly how your prelaunch
          strategy translates into opening-day revenue — or exposure.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mb-8 text-center"
      >
        <p className="mb-6 text-sm font-medium tracking-wider uppercase text-text-muted">
          I am a...
        </p>
      </motion.div>

      <div className="grid w-full max-w-xl grid-cols-1 gap-4 sm:grid-cols-2">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          whileHover={{ scale: 1.02, borderColor: "rgba(16, 226, 156, 0.4)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectPath("franchisee")}
          className="group flex flex-col items-center rounded-xl border border-border-line bg-surface-2 p-8 text-center transition-all duration-200 hover:bg-surface-3"
        >
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand/20">
            <Building2 size={28} />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-text-primary">
            Franchisee
          </h3>
          <p className="text-sm text-text-muted">
            I operate 5+ units and plan my own presale execution
          </p>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          whileHover={{ scale: 1.02, borderColor: "rgba(16, 226, 156, 0.4)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectPath("franchisor")}
          className="group flex flex-col items-center rounded-xl border border-border-line bg-surface-2 p-8 text-center transition-all duration-200 hover:bg-surface-3"
        >
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand/20">
            <Crown size={28} />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-text-primary">
            Franchisor
          </h3>
          <p className="text-sm text-text-muted">
            I prescribe presale strategy for my franchise network
          </p>
        </motion.button>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-10 text-center text-xs text-text-muted"
      >
        Confidential. Your data is used only for this audit.
      </motion.p>
    </div>
  );
}
