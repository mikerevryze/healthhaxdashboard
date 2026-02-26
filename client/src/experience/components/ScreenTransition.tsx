import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface ScreenTransitionProps {
  children: ReactNode;
  screenKey: string | number;
}

const variants: Variants = {
  enter: {
    opacity: 0,
    y: 24,
    filter: "blur(4px)",
  },
  center: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
  },
  exit: {
    opacity: 0,
    y: -24,
    filter: "blur(4px)",
  },
};

export function ScreenTransition({ children, screenKey }: ScreenTransitionProps) {
  return (
    <motion.div
      key={screenKey}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
