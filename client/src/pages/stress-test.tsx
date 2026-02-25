import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Building2,
  Network,
  ArrowRight,
  ArrowLeft,
  Volume2,
  VolumeX,
  MapPin,
  TreePine,
  Building,
  Loader2,
  CalendarCheck,
  CheckCircle2,
} from "lucide-react";
import {
  type StressTestData,
  type StressTestResults,
  type UserPath,
  type PopulationDensity,
  initialStressTestData,
  calculateResults,
  NARRATION_SCRIPTS,
} from "@/components/stress-test/types";
import { useNarration } from "@/components/stress-test/useNarration";
import { StoryScreen } from "@/components/stress-test/StoryScreen";

const TOTAL_STEPS = 8;

const pageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

const pageTransition = { type: "spring", stiffness: 300, damping: 30 };

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          className={`h-1 rounded-full flex-1 ${
            i <= step ? "bg-[#10E29C]" : "bg-muted"
          }`}
          initial={false}
          animate={{ scaleX: i <= step ? 1 : 0.8, opacity: i <= step ? 1 : 0.4 }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  );
}

function CurrencyInput({
  value,
  onChange,
  label,
  id,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
  id: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          $
        </span>
        <Input
          id={id}
          type="number"
          min={0}
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="pl-7"
        />
      </div>
    </div>
  );
}

export default function StressTest() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<StressTestData>(initialStressTestData);
  const [results, setResults] = useState<StressTestResults | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { isEnabled, isSpeaking, speak, toggle } = useNarration();

  const update = useCallback((partial: Partial<StressTestData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  }, []);

  const next = useCallback(() => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  // Narrate on step change
  useEffect(() => {
    if (isEnabled && NARRATION_SCRIPTS[step]) {
      speak(NARRATION_SCRIPTS[step]);
    }
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  // Calculate results when reaching story screen
  useEffect(() => {
    if (step === 6) {
      setResults(calculateResults(data));
    }
  }, [step, data]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = { ...data, results: calculateResults(data) };
      await fetch("/api/stress-test/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setIsSubmitted(true);
    } catch {
      // Still show success UI — n8n webhook is fire-and-forget
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validation per step
  const canProceed = (): boolean => {
    switch (step) {
      case 0:
        return data.path !== null;
      case 1:
        return (
          data.brandName.trim().length > 0 &&
          data.firstName.trim().length > 0 &&
          data.email.trim().length > 0
        );
      case 2:
        return data.numberOfOpenings > 0;
      case 3:
        return data.expectedCloseRate > 0;
      case 4:
        return data.avgMemberValue > 0 && data.memberLifetimeMonths > 0;
      case 5:
        return true;
      default:
        return true;
    }
  };

  const pathLabel = data.path === "franchisor" ? "prescribe" : "run";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#10E29C]">
              <span className="text-sm font-black text-black">R</span>
            </div>
            <span className="text-sm font-semibold text-foreground">
              Launch Stress Test
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted"
            >
              {isEnabled ? (
                <>
                  <Volume2 className={`w-4 h-4 ${isSpeaking ? "text-[#10E29C]" : ""}`} />
                  <span>Audio {isSpeaking ? "playing" : "on"}</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>Audio off</span>
                </>
              )}
            </button>
            {step > 0 && step < 7 && (
              <span className="text-xs text-muted-foreground">
                {step + 1}/{TOTAL_STEPS}
              </span>
            )}
          </div>
        </div>
        {step > 0 && (
          <div className="px-4 pb-2 max-w-3xl mx-auto">
            <ProgressBar step={step} total={TOTAL_STEPS} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center pt-24 pb-32 px-4">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait" custom={direction}>
            {/* ========== Screen 0: Path Selection ========== */}
            {step === 0 && (
              <motion.div
                key="path"
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={pageTransition}
                className="space-y-8 text-center"
              >
                <div className="space-y-3">
                  <motion.h1
                    className="text-3xl md:text-4xl font-bold"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Can your franchise survive{" "}
                    <span className="text-[#10E29C]">launch day</span>?
                  </motion.h1>
                  <motion.p
                    className="text-muted-foreground text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Find out in 3 minutes. Choose your path:
                  </motion.p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <motion.button
                    className={`relative group rounded-xl border-2 p-6 text-left transition-all ${
                      data.path === "franchisee"
                        ? "border-[#10E29C] bg-[#10E29C]/5"
                        : "border-border hover:border-muted-foreground/50"
                    }`}
                    onClick={() => update({ path: "franchisee" })}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Building2 className="w-10 h-10 mb-3 text-[#10E29C]" />
                    <h3 className="text-lg font-bold mb-1">
                      I'm a Franchisee
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Operating 5+ units. I want to stress-test my own launch
                      strategy.
                    </p>
                    {data.path === "franchisee" && (
                      <motion.div
                        className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#10E29C] flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <CheckCircle2 className="w-4 h-4 text-black" />
                      </motion.div>
                    )}
                  </motion.button>

                  <motion.button
                    className={`relative group rounded-xl border-2 p-6 text-left transition-all ${
                      data.path === "franchisor"
                        ? "border-[#10E29C] bg-[#10E29C]/5"
                        : "border-border hover:border-muted-foreground/50"
                    }`}
                    onClick={() => update({ path: "franchisor" })}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Network className="w-10 h-10 mb-3 text-[#10E29C]" />
                    <h3 className="text-lg font-bold mb-1">
                      I'm a Franchisor
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Guiding my network. I want to stress-test what we
                      prescribe to franchisees.
                    </p>
                    {data.path === "franchisor" && (
                      <motion.div
                        className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#10E29C] flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <CheckCircle2 className="w-4 h-4 text-black" />
                      </motion.div>
                    )}
                  </motion.button>
                </div>

                {data.path && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Button
                      onClick={next}
                      size="lg"
                      className="bg-[#10E29C] text-black hover:brightness-110 font-bold px-8"
                    >
                      Let's Go <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ========== Screen 1: Brand & Contact ========== */}
            {step === 1 && (
              <motion.div
                key="contact"
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={pageTransition}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h2 className="text-2xl md:text-3xl font-bold">
                    Let's tailor this for{" "}
                    <span className="text-[#10E29C]">
                      {data.brandName || "your brand"}
                    </span>
                  </h2>
                  <p className="text-muted-foreground">
                    We'll customize the entire analysis for your franchise
                    system.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="brandName">Franchise Brand *</Label>
                    <Input
                      id="brandName"
                      placeholder="e.g. F45 Training, OrangeTheory, Club Pilates"
                      value={data.brandName}
                      onChange={(e) => update({ brandName: e.target.value })}
                      className="text-lg h-12"
                      autoFocus
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        placeholder="First name"
                        value={data.firstName}
                        onChange={(e) => update({ firstName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Last name"
                        value={data.lastName}
                        onChange={(e) => update({ lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={data.email}
                      onChange={(e) => update({ email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 000-0000"
                      value={data.phone}
                      onChange={(e) => update({ phone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedIn">
                      LinkedIn{" "}
                      <span className="text-muted-foreground text-xs">
                        (optional — helps us prep your audit)
                      </span>
                    </Label>
                    <Input
                      id="linkedIn"
                      placeholder="linkedin.com/in/yourprofile"
                      value={data.linkedIn}
                      onChange={(e) => update({ linkedIn: e.target.value })}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ========== Screen 2: Growth Plans ========== */}
            {step === 2 && (
              <motion.div
                key="growth"
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={pageTransition}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="text-2xl md:text-3xl font-bold">
                    Growth Plans
                  </h2>
                  <p className="text-muted-foreground">
                    How many locations {data.path === "franchisor" ? "is your network" : "are you"} opening in the next 12 months?
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <Label>Number of Openings</Label>
                      <span className="text-3xl font-bold text-[#10E29C]">
                        {data.numberOfOpenings}
                      </span>
                    </div>
                    <Slider
                      value={[data.numberOfOpenings]}
                      onValueChange={([v]) =>
                        update({ numberOfOpenings: v })
                      }
                      min={1}
                      max={50}
                      step={1}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1</span>
                      <span>50</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Primary Market Type</Label>
                    <p className="text-sm text-muted-foreground">
                      This adjusts your cost-per-lead estimates.
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {(
                        [
                          {
                            key: "urban" as PopulationDensity,
                            icon: Building,
                            label: "Urban",
                            desc: "Dense metro",
                            cpl: "$25 CPL",
                          },
                          {
                            key: "suburban" as PopulationDensity,
                            icon: MapPin,
                            label: "Suburban",
                            desc: "Mid-density",
                            cpl: "$35 CPL",
                          },
                          {
                            key: "rural" as PopulationDensity,
                            icon: TreePine,
                            label: "Rural",
                            desc: "Low density",
                            cpl: "$50 CPL",
                          },
                        ] as const
                      ).map(({ key, icon: Icon, label, desc, cpl }) => (
                        <button
                          key={key}
                          className={`rounded-xl border-2 p-4 text-center transition-all ${
                            data.populationDensity === key
                              ? "border-[#10E29C] bg-[#10E29C]/5"
                              : "border-border hover:border-muted-foreground/50"
                          }`}
                          onClick={() =>
                            update({ populationDensity: key })
                          }
                        >
                          <Icon className="w-6 h-6 mx-auto mb-2 text-[#10E29C]" />
                          <p className="font-semibold text-sm">{label}</p>
                          <p className="text-xs text-muted-foreground">
                            {desc}
                          </p>
                          <p className="text-xs text-[#10E29C] mt-1 font-medium">
                            ~{cpl}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ========== Screen 3: Marketing ========== */}
            {step === 3 && (
              <motion.div
                key="marketing"
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={pageTransition}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="text-2xl md:text-3xl font-bold">
                    Marketing Engine
                  </h2>
                  <p className="text-muted-foreground">
                    What do you {pathLabel} for pre-sale lead generation?
                  </p>
                </div>

                <div className="space-y-6">
                  <CurrencyInput
                    id="adSpend"
                    label="Monthly Digital Ad Spend (per location)"
                    value={data.monthlyAdSpend}
                    onChange={(v) => update({ monthlyAdSpend: v })}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="popups">Pop-up Events / Month</Label>
                      <p className="text-xs text-muted-foreground">
                        ~15 leads per event
                      </p>
                      <Input
                        id="popups"
                        type="number"
                        min={0}
                        value={data.popupLeadsPerMonth}
                        onChange={(e) =>
                          update({
                            popupLeadsPerMonth: Number(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="b2b">B2B Events / Month</Label>
                      <p className="text-xs text-muted-foreground">
                        ~25 leads per event
                      </p>
                      <Input
                        id="b2b"
                        type="number"
                        min={0}
                        value={data.b2bEventsPerMonth}
                        onChange={(e) =>
                          update({
                            b2bEventsPerMonth: Number(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <Label>Expected Close Rate</Label>
                      <span className="text-2xl font-bold text-[#10E29C]">
                        {data.expectedCloseRate}%
                      </span>
                    </div>
                    <Slider
                      value={[data.expectedCloseRate]}
                      onValueChange={([v]) =>
                        update({ expectedCloseRate: v })
                      }
                      min={1}
                      max={40}
                      step={1}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1%</span>
                      <span>Industry avg: 10-15%</span>
                      <span>40%</span>
                    </div>
                  </div>

                  {/* Live preview */}
                  <motion.div
                    className="rounded-lg border border-[#10E29C]/20 bg-[#10E29C]/5 p-4"
                    layout
                  >
                    <p className="text-sm text-muted-foreground mb-2">
                      Quick preview
                    </p>
                    <div className="flex justify-between text-sm">
                      <span>Paid leads/mo</span>
                      <span className="font-bold">
                        {data.monthlyAdSpend > 0
                          ? Math.floor(
                              data.monthlyAdSpend /
                                (data.populationDensity === "urban"
                                  ? 25
                                  : data.populationDensity === "suburban"
                                    ? 35
                                    : 50),
                            )
                          : 0}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Organic leads/mo</span>
                      <span className="font-bold">
                        {data.popupLeadsPerMonth * 15 +
                          data.b2bEventsPerMonth * 25}
                      </span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* ========== Screen 4: Revenue ========== */}
            {step === 4 && (
              <motion.div
                key="revenue"
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={pageTransition}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="text-2xl md:text-3xl font-bold">
                    Revenue Model
                  </h2>
                  <p className="text-muted-foreground">
                    What does a pre-launch member look like for{" "}
                    {data.brandName || "your brand"}?
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="memberValue">
                      Avg Monthly Member Value
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      The monthly membership fee a pre-launch member pays
                    </p>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="memberValue"
                        type="number"
                        min={1}
                        value={data.avgMemberValue}
                        onChange={(e) =>
                          update({
                            avgMemberValue: Number(e.target.value) || 0,
                          })
                        }
                        className="pl-7 text-lg h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <Label>Average Member Lifetime</Label>
                      <span className="text-2xl font-bold text-[#10E29C]">
                        {data.memberLifetimeMonths} months
                      </span>
                    </div>
                    <Slider
                      value={[data.memberLifetimeMonths]}
                      onValueChange={([v]) =>
                        update({ memberLifetimeMonths: v })
                      }
                      min={1}
                      max={48}
                      step={1}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1 mo</span>
                      <span>Industry avg: 12-18 mo</span>
                      <span>48 mo</span>
                    </div>
                  </div>

                  <motion.div
                    className="rounded-lg border border-[#10E29C]/20 bg-[#10E29C]/5 p-4"
                    layout
                  >
                    <p className="text-sm text-muted-foreground mb-2">
                      Member Lifetime Value
                    </p>
                    <p className="text-3xl font-bold text-[#10E29C]">
                      $
                      {(
                        data.avgMemberValue * data.memberLifetimeMonths
                      ).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      ${data.avgMemberValue}/mo &times;{" "}
                      {data.memberLifetimeMonths} months
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* ========== Screen 5: Costs ========== */}
            {step === 5 && (
              <motion.div
                key="costs"
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={pageTransition}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="text-2xl md:text-3xl font-bold">
                    Monthly Costs
                  </h2>
                  <p className="text-muted-foreground">
                    What does it cost to {pathLabel} a location per month?
                  </p>
                </div>

                <div className="space-y-5">
                  <CurrencyInput
                    id="rent"
                    label="Rent / Lease"
                    value={data.monthlyRent}
                    onChange={(v) => update({ monthlyRent: v })}
                  />
                  <CurrencyInput
                    id="payroll"
                    label="Payroll"
                    value={data.monthlyPayroll}
                    onChange={(v) => update({ monthlyPayroll: v })}
                  />
                  <CurrencyInput
                    id="other"
                    label="Other Costs (utilities, software, insurance, etc.)"
                    value={data.monthlyOtherCosts}
                    onChange={(v) => update({ monthlyOtherCosts: v })}
                  />

                  <motion.div
                    className="rounded-lg border border-border bg-card p-4"
                    layout
                  >
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">
                        Rent
                      </span>
                      <span>${data.monthlyRent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">
                        Payroll
                      </span>
                      <span>${data.monthlyPayroll.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">
                        Other
                      </span>
                      <span>${data.monthlyOtherCosts.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold border-t border-border pt-2 mt-2">
                      <span>Total / Location</span>
                      <span className="text-[#10E29C]">
                        $
                        {(
                          data.monthlyRent +
                          data.monthlyPayroll +
                          data.monthlyOtherCosts
                        ).toLocaleString()}
                        /mo
                      </span>
                    </div>
                    {data.numberOfOpenings > 1 && (
                      <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>
                          &times; {data.numberOfOpenings} locations
                        </span>
                        <span>
                          $
                          {(
                            (data.monthlyRent +
                              data.monthlyPayroll +
                              data.monthlyOtherCosts) *
                            data.numberOfOpenings
                          ).toLocaleString()}
                          /mo
                        </span>
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* ========== Screen 6: Story / Results ========== */}
            {step === 6 && results && (
              <motion.div
                key="story"
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={pageTransition}
              >
                <StoryScreen
                  results={results}
                  data={data}
                  onContinue={next}
                />
              </motion.div>
            )}

            {/* ========== Screen 7: CTA / Book Call ========== */}
            {step === 7 && (
              <motion.div
                key="cta"
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={pageTransition}
                className="space-y-8 text-center"
              >
                {!isSubmitted ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <CalendarCheck className="w-16 h-16 text-[#10E29C] mx-auto mb-4" />
                    </motion.div>

                    <motion.div
                      className="space-y-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h2 className="text-2xl md:text-3xl font-bold">
                        Let's Build Your Launch Playbook
                      </h2>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Book a free{" "}
                        <span className="text-[#10E29C] font-semibold">
                          Launch Audit Call
                        </span>{" "}
                        with our team. We'll review your numbers, research
                        your brand, and deliver a custom strategy to hit
                        170+ members per opening.
                      </p>
                    </motion.div>

                    {results && (
                      <motion.div
                        className="grid grid-cols-3 gap-3 max-w-md mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <div className="rounded-lg border border-border bg-card p-3">
                          <p className="text-xs text-muted-foreground">
                            Projected
                          </p>
                          <p className="text-lg font-bold">
                            {results.projectedMembersAtLaunch}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            members
                          </p>
                        </div>
                        <div className="rounded-lg border border-border bg-card p-3">
                          <p className="text-xs text-muted-foreground">MRR</p>
                          <p className="text-lg font-bold text-[#10E29C]">
                            ${results.totalMRR.toLocaleString()}
                          </p>
                        </div>
                        <div className="rounded-lg border border-border bg-card p-3">
                          <p className="text-xs text-muted-foreground">
                            Health
                          </p>
                          <p
                            className={`text-lg font-bold ${
                              results.healthScore === "critical" ||
                              results.healthScore === "at_risk"
                                ? "text-red-400"
                                : "text-[#10E29C]"
                            }`}
                          >
                            {results.healthScore === "critical"
                              ? "Critical"
                              : results.healthScore === "at_risk"
                                ? "At Risk"
                                : results.healthScore === "healthy"
                                  ? "Healthy"
                                  : "Thriving"}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    <motion.div
                      className="space-y-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <motion.button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full max-w-md mx-auto block py-4 rounded-xl bg-[#10E29C] text-black font-bold text-lg hover:brightness-110 transition-all disabled:opacity-50"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Preparing your audit...
                          </span>
                        ) : (
                          "Book My Launch Audit Call"
                        )}
                      </motion.button>
                      <p className="text-xs text-muted-foreground">
                        We'll email you a custom PDF report and research on
                        your brand within 24 hours.
                      </p>
                    </motion.div>
                  </>
                ) : (
                  <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <motion.div
                      className="w-20 h-20 rounded-full bg-[#10E29C]/10 flex items-center justify-center mx-auto"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 12 }}
                    >
                      <CheckCircle2 className="w-10 h-10 text-[#10E29C]" />
                    </motion.div>
                    <h2 className="text-2xl md:text-3xl font-bold">
                      You're All Set, {data.firstName || "there"}!
                    </h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Our team is already researching{" "}
                      <span className="text-[#10E29C] font-semibold">
                        {data.brandName}
                      </span>{" "}
                      and preparing your custom Launch Audit report. Check
                      your email for next steps.
                    </p>
                    <div className="rounded-xl border border-[#10E29C]/20 bg-[#10E29C]/5 p-6 max-w-md mx-auto text-left space-y-3">
                      <h3 className="font-semibold">What happens next:</h3>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p className="flex gap-2">
                          <span className="text-[#10E29C]">1.</span> We
                          research your brand and market
                        </p>
                        <p className="flex gap-2">
                          <span className="text-[#10E29C]">2.</span> You
                          receive a custom PDF stress-test report
                        </p>
                        <p className="flex gap-2">
                          <span className="text-[#10E29C]">3.</span> We
                          hop on a call and build your launch playbook
                        </p>
                      </div>
                    </div>
                    <a
                      href="https://calendly.com/revryze/launch-audit"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <Button
                        size="lg"
                        className="bg-[#10E29C] text-black hover:brightness-110 font-bold px-8"
                      >
                        <CalendarCheck className="mr-2 w-5 h-5" />
                        Schedule Your Call Now
                      </Button>
                    </a>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Navigation (not shown on path selection, story, or CTA screens) */}
      {step >= 1 && step <= 5 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border">
          <div className="mx-auto max-w-2xl px-4 py-4 flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={prev}
              className="text-muted-foreground"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back
            </Button>
            <Button
              onClick={next}
              disabled={!canProceed()}
              className="bg-[#10E29C] text-black hover:brightness-110 font-bold px-8"
            >
              {step === 5 ? "See My Results" : "Continue"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
