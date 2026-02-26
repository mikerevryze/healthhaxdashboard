import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

interface NarrationToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export function NarrationToggle({ enabled, onToggle }: NarrationToggleProps) {
  return (
    <motion.button
      onClick={onToggle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className={`fixed right-6 top-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 ${
        enabled
          ? "border-brand/30 bg-brand/10 text-brand"
          : "border-border-line bg-surface-2 text-text-muted hover:text-text-secondary"
      }`}
      title={enabled ? "Disable narration" : "Enable narration"}
    >
      {enabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
    </motion.button>
  );
}
