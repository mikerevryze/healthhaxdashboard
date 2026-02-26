import { useState, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import type {
  ExperienceState,
  UserPath,
  ProfileData,
  LaunchPlanData,
  LeadAssumptionsData,
  FinancialData,
} from "./types";
import { INITIAL_STATE } from "./types";
import { calculateProjections } from "./calculations";
import { ProgressBar } from "./components/ProgressBar";
import { ScreenTransition } from "./components/ScreenTransition";
import { NarrationToggle } from "./components/NarrationToggle";
import { WelcomeScreen } from "./screens/WelcomeScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { LaunchPlanScreen } from "./screens/LaunchPlanScreen";
import { LeadAssumptionsScreen } from "./screens/LeadAssumptionsScreen";
import { FinancialRealityScreen } from "./screens/FinancialRealityScreen";
import { RevenueExposureScreen } from "./screens/RevenueExposureScreen";
import { TheSolutionScreen } from "./screens/TheSolutionScreen";
import { FinalScreen } from "./screens/FinalScreen";

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || "";

export function ExperienceFlow() {
  const [state, setState] = useState<ExperienceState>(INITIAL_STATE);

  const updateState = useCallback(
    (updates: Partial<ExperienceState>) =>
      setState((prev) => ({ ...prev, ...updates })),
    []
  );

  // Capture partial data on any screen change (even if incomplete)
  useEffect(() => {
    if (
      state.profile.email ||
      state.profile.firstName ||
      state.profile.brandName
    ) {
      try {
        sessionStorage.setItem(
          "revryze_partial",
          JSON.stringify({
            profile: state.profile,
            userPath: state.userPath,
            timestamp: new Date().toISOString(),
          })
        );
      } catch {
        // sessionStorage not available
      }
    }
  }, [state.profile, state.userPath]);

  const goNext = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentScreen: Math.min(prev.currentScreen + 1, 7),
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const selectPath = useCallback(
    (path: UserPath) => {
      updateState({ userPath: path, currentScreen: 1 });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [updateState]
  );

  const updateProfile = useCallback(
    (updates: Partial<ProfileData>) =>
      setState((prev) => ({
        ...prev,
        profile: { ...prev.profile, ...updates },
      })),
    []
  );

  const updateLaunchPlan = useCallback(
    (updates: Partial<LaunchPlanData>) =>
      setState((prev) => ({
        ...prev,
        launchPlan: { ...prev.launchPlan, ...updates },
      })),
    []
  );

  const updateLeadAssumptions = useCallback(
    (updates: Partial<LeadAssumptionsData>) =>
      setState((prev) => ({
        ...prev,
        leadAssumptions: { ...prev.leadAssumptions, ...updates },
      })),
    []
  );

  const updateFinancials = useCallback(
    (updates: Partial<FinancialData>) =>
      setState((prev) => ({
        ...prev,
        financials: { ...prev.financials, ...updates },
      })),
    []
  );

  const toggleNarration = useCallback(
    () =>
      setState((prev) => ({
        ...prev,
        narrationEnabled: !prev.narrationEnabled,
      })),
    []
  );

  const projections = calculateProjections(state);

  const submitToWebhook = useCallback(async () => {
    const payload = {
      userPath: state.userPath,
      profile: state.profile,
      launchPlan: state.launchPlan,
      leadAssumptions: state.leadAssumptions,
      financials: state.financials,
      projections: {
        projectedFounders: projections.projectedFounders,
        projectedOpeningMRR: projections.projectedOpeningMRR,
        cpl: projections.cpl,
        cac: projections.cac,
        ltv: projections.ltv,
        ltvCacRatio: projections.ltvCacRatio,
        opexRunwayRatio: projections.opexRunwayRatio,
        revenueLeftOnTable: projections.revenueLeftOnTable,
        survivalScore: projections.survivalScore,
        memberGap: projections.memberGap,
        multiUnitTotalFounders: projections.multiUnitTotalFounders,
        multiUnitTotalMRR: projections.multiUnitTotalMRR,
      },
      submittedAt: new Date().toISOString(),
    };

    if (N8N_WEBHOOK_URL) {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Webhook submission failed");
      }
    }

    // Also try the local API proxy
    try {
      await fetch("/api/submit-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      // Non-critical: local proxy may not be running
    }

    // Clear partial capture
    try {
      sessionStorage.removeItem("revryze_partial");
    } catch {
      // ignore
    }
  }, [state, projections]);

  const renderScreen = () => {
    switch (state.currentScreen) {
      case 0:
        return <WelcomeScreen onSelectPath={selectPath} />;
      case 1:
        return (
          <ProfileScreen
            profile={state.profile}
            userPath={state.userPath!}
            onChange={updateProfile}
            onNext={goNext}
          />
        );
      case 2:
        return (
          <LaunchPlanScreen
            data={state.launchPlan}
            userPath={state.userPath!}
            onChange={updateLaunchPlan}
            onNext={goNext}
          />
        );
      case 3:
        return (
          <LeadAssumptionsScreen
            data={state.leadAssumptions}
            userPath={state.userPath!}
            onChange={updateLeadAssumptions}
            onNext={goNext}
          />
        );
      case 4:
        return (
          <FinancialRealityScreen
            data={state.financials}
            userPath={state.userPath!}
            onChange={updateFinancials}
            onNext={goNext}
          />
        );
      case 5:
        return (
          <RevenueExposureScreen
            projections={projections}
            numOpenings={state.launchPlan.numOpenings}
            onNext={goNext}
          />
        );
      case 6:
        return (
          <TheSolutionScreen
            projections={projections}
            brandName={state.profile.brandName}
            onNext={goNext}
          />
        );
      case 7:
        return (
          <FinalScreen
            state={state}
            projections={projections}
            onSubmit={submitToWebhook}
          />
        );
      default:
        return <WelcomeScreen onSelectPath={selectPath} />;
    }
  };

  return (
    <div className="grid-bg min-h-screen">
      {/* Narration Toggle */}
      <NarrationToggle
        enabled={state.narrationEnabled}
        onToggle={toggleNarration}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border-line bg-surface-0/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand">
              <span className="text-sm font-black text-surface-0">R</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-text-primary">
              Revryze
            </span>
          </div>
          {state.currentScreen > 0 && (
            <button
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  currentScreen: Math.max(0, prev.currentScreen - 1),
                }))
              }
              className="text-xs text-text-muted transition-colors hover:text-text-secondary"
            >
              Back
            </button>
          )}
        </div>
        {state.currentScreen > 0 && (
          <ProgressBar currentScreen={state.currentScreen} />
        )}
      </header>

      {/* Screen Content */}
      <main className="relative">
        <AnimatePresence mode="wait">
          <ScreenTransition screenKey={state.currentScreen}>
            {renderScreen()}
          </ScreenTransition>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-line py-6 text-center">
        <p className="text-xs text-text-muted">
          &copy; {new Date().getFullYear()} Revryze. Prelaunch Revenue Audit.
        </p>
      </footer>
    </div>
  );
}
