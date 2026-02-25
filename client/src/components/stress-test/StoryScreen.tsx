import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { StressTestResults, StressTestData } from "./types";

interface StoryScreenProps {
  results: StressTestResults;
  data: StressTestData;
  onContinue: () => void;
}

function AnimatedCounter({
  target,
  prefix = "",
  suffix = "",
  duration = 2000,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const steps = 60;
    const increment = target / steps;
    const interval = duration / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, interval);
    return () => clearInterval(timer);
  }, [target, duration]);
  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

function AnxiousFace() {
  return (
    <motion.svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      <motion.circle
        cx="60"
        cy="60"
        r="55"
        fill="none"
        stroke="#ef4444"
        strokeWidth="3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8 }}
      />
      <motion.circle
        cx="42"
        cy="48"
        r="6"
        fill="#ef4444"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.3, 1] }}
        transition={{ delay: 0.4, duration: 0.4 }}
      />
      <motion.circle
        cx="78"
        cy="48"
        r="6"
        fill="#ef4444"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.3, 1] }}
        transition={{ delay: 0.5, duration: 0.4 }}
      />
      {/* Eyebrows - worried */}
      <motion.line
        x1="32"
        y1="38"
        x2="48"
        y2="35"
        stroke="#ef4444"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      />
      <motion.line
        x1="88"
        y1="38"
        x2="72"
        y2="35"
        stroke="#ef4444"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      />
      {/* Frown */}
      <motion.path
        d="M 38 82 Q 60 68 82 82"
        fill="none"
        stroke="#ef4444"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      />
    </motion.svg>
  );
}

function HappyFace() {
  return (
    <motion.svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      <motion.circle
        cx="60"
        cy="60"
        r="55"
        fill="none"
        stroke="#10E29C"
        strokeWidth="3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8 }}
      />
      <motion.circle
        cx="42"
        cy="48"
        r="6"
        fill="#10E29C"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.3, 1] }}
        transition={{ delay: 0.4, duration: 0.4 }}
      />
      <motion.circle
        cx="78"
        cy="48"
        r="6"
        fill="#10E29C"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.3, 1] }}
        transition={{ delay: 0.5, duration: 0.4 }}
      />
      {/* Smile */}
      <motion.path
        d="M 38 72 Q 60 92 82 72"
        fill="none"
        stroke="#10E29C"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      />
    </motion.svg>
  );
}

function MemberGauge({
  projected,
  threshold,
}: {
  projected: number;
  threshold: number;
}) {
  const maxDisplay = Math.max(projected, threshold) * 1.3;
  const projectedPct = Math.min((projected / maxDisplay) * 100, 100);
  const thresholdPct = (threshold / maxDisplay) * 100;
  const isAbove = projected >= threshold;

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>0</span>
        <span>{Math.round(maxDisplay)} members</span>
      </div>
      <div className="relative h-8 w-full rounded-full bg-muted overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${isAbove ? "bg-[#10E29C]" : "bg-red-500"}`}
          initial={{ width: 0 }}
          animate={{ width: `${projectedPct}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        {/* Threshold line */}
        <motion.div
          className="absolute top-0 h-full w-0.5 bg-amber-400"
          style={{ left: `${thresholdPct}%` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        />
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className={isAbove ? "text-[#10E29C]" : "text-red-400"}>
          Your projection: {projected} members
        </span>
        <span className="text-amber-400">Threshold: {threshold}</span>
      </div>
    </div>
  );
}

const storyBeats = [
  {
    id: "intro",
    duration: 3500,
  },
  {
    id: "failure",
    duration: 4000,
  },
  {
    id: "success",
    duration: 4000,
  },
  {
    id: "your-numbers",
    duration: 5000,
  },
  {
    id: "projections",
    duration: 0, // stays until user clicks continue
  },
];

export function StoryScreen({ results, data, onContinue }: StoryScreenProps) {
  const [beatIndex, setBeatIndex] = useState(0);

  useEffect(() => {
    const beat = storyBeats[beatIndex];
    if (beat.duration > 0) {
      const timer = setTimeout(() => {
        setBeatIndex((prev) => Math.min(prev + 1, storyBeats.length - 1));
      }, beat.duration);
      return () => clearTimeout(timer);
    }
  }, [beatIndex]);

  const scoreColors: Record<string, string> = {
    critical: "text-red-500",
    at_risk: "text-amber-500",
    healthy: "text-[#10E29C]",
    thriving: "text-[#10E29C]",
  };

  const scoreLabels: Record<string, string> = {
    critical: "Critical Risk",
    at_risk: "At Risk",
    healthy: "Healthy",
    thriving: "Thriving",
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <AnimatePresence mode="wait">
        {/* Beat 0: Intro stat */}
        {beatIndex === 0 && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="space-y-6"
          >
            <motion.p
              className="text-muted-foreground text-lg uppercase tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              The Data Speaks
            </motion.p>
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-foreground"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              We analyzed{" "}
              <span className="text-[#10E29C]">
                <AnimatedCounter target={500} suffix="+" />
              </span>{" "}
              franchise launches
            </motion.h2>
            <motion.div
              className="flex justify-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-[#10E29C]"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.2,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Beat 1: Failure story */}
        {beatIndex === 1 && (
          <motion.div
            key="failure"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="space-y-8"
          >
            <AnxiousFace />
            <motion.h2
              className="text-3xl md:text-4xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="text-red-500">80%</span> of locations that opened
              below{" "}
              <span className="text-red-400">
                150 pre-sale members
              </span>
            </motion.h2>
            <motion.p
              className="text-xl text-red-400/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              failed within 18 months.
            </motion.p>
            <motion.div
              className="flex gap-4 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
            >
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2">
                <p className="text-sm text-muted-foreground">Avg Members</p>
                <p className="text-2xl font-bold text-red-400">87</p>
              </div>
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2">
                <p className="text-sm text-muted-foreground">Failure Rate</p>
                <p className="text-2xl font-bold text-red-400">80%</p>
              </div>
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2">
                <p className="text-sm text-muted-foreground">Avg Loss/mo</p>
                <p className="text-2xl font-bold text-red-400">-$12K</p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Beat 2: Success story */}
        {beatIndex === 2 && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="space-y-8"
          >
            <HappyFace />
            <motion.h2
              className="text-3xl md:text-4xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              But the top{" "}
              <span className="text-[#10E29C]">20%</span> told a
              different story.
            </motion.h2>
            <motion.p
              className="text-xl text-[#10E29C]/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              They averaged{" "}
              <span className="font-bold text-[#10E29C]">170+ members</span> at
              launch — ensuring stable, profitable openings.
            </motion.p>
            <motion.div
              className="flex gap-4 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
            >
              <div className="rounded-lg border border-[#10E29C]/30 bg-[#10E29C]/10 px-4 py-2">
                <p className="text-sm text-muted-foreground">Avg Members</p>
                <p className="text-2xl font-bold text-[#10E29C]">173</p>
              </div>
              <div className="rounded-lg border border-[#10E29C]/30 bg-[#10E29C]/10 px-4 py-2">
                <p className="text-sm text-muted-foreground">Survival Rate</p>
                <p className="text-2xl font-bold text-[#10E29C]">94%</p>
              </div>
              <div className="rounded-lg border border-[#10E29C]/30 bg-[#10E29C]/10 px-4 py-2">
                <p className="text-sm text-muted-foreground">Avg Profit/mo</p>
                <p className="text-2xl font-bold text-[#10E29C]">+$8K</p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Beat 3: Transition to their numbers */}
        {beatIndex === 3 && (
          <motion.div
            key="your-numbers"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -30 }}
            className="space-y-6"
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              So where do{" "}
              <span className="text-[#10E29C]">
                {data.brandName || "your"}
              </span>{" "}
              numbers land?
            </motion.h2>
            <motion.div
              className="w-20 h-1 bg-[#10E29C] mx-auto rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            />
            <motion.p
              className="text-muted-foreground text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              Let's find out...
            </motion.p>
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-[#10E29C] text-4xl"
            >
              &#8595;
            </motion.div>
          </motion.div>
        )}

        {/* Beat 4: Full projections dashboard */}
        {beatIndex === 4 && (
          <motion.div
            key="projections"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-3xl space-y-8"
          >
            <div className="text-left space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold">
                Your Launch Projection
              </h2>
              <p className="text-muted-foreground">
                {data.brandName} &middot; {data.numberOfOpenings} opening
                {data.numberOfOpenings > 1 ? "s" : ""} &middot;{" "}
                {data.populationDensity} market
                {data.numberOfOpenings > 1 ? "s" : ""}
              </p>
            </div>

            {/* Health Score Banner */}
            <motion.div
              className={`rounded-xl border p-4 text-center ${
                results.healthScore === "critical" || results.healthScore === "at_risk"
                  ? "border-red-500/30 bg-red-500/5"
                  : "border-[#10E29C]/30 bg-[#10E29C]/5"
              }`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
                Launch Health Score
              </p>
              <p
                className={`text-3xl font-bold ${scoreColors[results.healthScore]}`}
              >
                {scoreLabels[results.healthScore]}
              </p>
            </motion.div>

            {/* Member Gauge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <MemberGauge
                projected={results.projectedMembersAtLaunch}
                threshold={150}
              />
            </motion.div>

            {/* Key Metrics Grid */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="rounded-lg border border-border bg-card p-3">
                <p className="text-xs text-muted-foreground">
                  Projected Members
                </p>
                <p className="text-xl font-bold">
                  <AnimatedCounter
                    target={results.projectedMembersAtLaunch}
                  />
                </p>
                <p className="text-xs text-muted-foreground">per location</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-3">
                <p className="text-xs text-muted-foreground">Monthly Revenue</p>
                <p className="text-xl font-bold">
                  <AnimatedCounter
                    target={results.monthlyRevenuePerLocation}
                    prefix="$"
                  />
                </p>
                <p className="text-xs text-muted-foreground">per location</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-3">
                <p className="text-xs text-muted-foreground">Total MRR</p>
                <p className="text-xl font-bold text-[#10E29C]">
                  <AnimatedCounter
                    target={results.totalMRR}
                    prefix="$"
                  />
                </p>
                <p className="text-xs text-muted-foreground">
                  across all locations
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-3">
                <p className="text-xs text-muted-foreground">
                  Net per Location
                </p>
                <p
                  className={`text-xl font-bold ${results.netMonthlyPerLocation >= 0 ? "text-[#10E29C]" : "text-red-400"}`}
                >
                  {results.netMonthlyPerLocation >= 0 ? "+" : ""}$
                  {results.netMonthlyPerLocation.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">monthly</p>
              </div>
            </motion.div>

            {/* Detailed Breakdown */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                  Lead Pipeline
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Paid leads/mo
                    </span>
                    <span className="font-medium">
                      {results.paidLeadsPerMonth}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Organic leads/mo
                    </span>
                    <span className="font-medium">
                      {results.organicLeadsPerMonth}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2">
                    <span className="text-muted-foreground">
                      Total leads/mo
                    </span>
                    <span className="font-bold">
                      {results.totalLeadsPerMonth}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Adjusted CPL</span>
                    <span className="font-medium">
                      ${results.adjustedCPL}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                  Unit Economics
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member LTV</span>
                    <span className="font-medium">
                      ${results.ltv.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ROAS Ratio</span>
                    <span className="font-medium">
                      {results.roasRatio.toFixed(1)}x
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2">
                    <span className="text-muted-foreground">Member Gap</span>
                    <span
                      className={`font-bold ${results.memberGap > 0 ? "text-red-400" : "text-[#10E29C]"}`}
                    >
                      {results.memberGap > 0
                        ? `-${results.memberGap} short`
                        : `+${Math.abs(results.memberGap)} above`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Monthly Costs
                    </span>
                    <span className="font-medium">
                      $
                      {(results.totalMonthlyCosts / (data.numberOfOpenings || 1)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Gap Warning or Success Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
            >
              {results.memberGap > 0 ? (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 text-center space-y-2">
                  <p className="text-amber-400 font-semibold text-lg">
                    You're {results.memberGap} members short of the safety
                    threshold.
                  </p>
                  <p className="text-muted-foreground text-sm">
                    We've helped franchises close this gap with our proven
                    launch system. Let's build a plan to get you above 150.
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-[#10E29C]/30 bg-[#10E29C]/5 p-5 text-center space-y-2">
                  <p className="text-[#10E29C] font-semibold text-lg">
                    You're above the threshold — but there's still room to
                    optimize.
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Our top-performing partners push past 200 members per
                    location. Let's maximize your launch.
                  </p>
                </div>
              )}
            </motion.div>

            <motion.button
              onClick={onContinue}
              className="w-full py-4 rounded-xl bg-[#10E29C] text-black font-bold text-lg hover:brightness-110 transition-all"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              See How We Fix This &rarr;
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
