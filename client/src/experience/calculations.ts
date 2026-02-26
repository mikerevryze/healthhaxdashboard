import type { ExperienceState, Projections, PopulationDensity } from "./types";
import { PROVEN_SYSTEM_STATS } from "./types";

const CPL_BY_DENSITY: Record<PopulationDensity, number> = {
  low: 42,
  medium: 26,
  high: 15,
};

export function getCPL(density: PopulationDensity, adSpend: number): number {
  const baseCpl = CPL_BY_DENSITY[density];
  if (density === "low" && adSpend > 15000) {
    return baseCpl + (adSpend - 15000) * 0.0005;
  }
  if (density === "high" && adSpend > 20000) {
    return Math.max(10, baseCpl - (adSpend - 20000) * 0.0002);
  }
  return baseCpl;
}

export function calculateProjections(state: ExperienceState): Projections {
  const { launchPlan, leadAssumptions, financials } = state;

  const cpl = getCPL(launchPlan.populationDensity, launchPlan.adSpendPerOpening);

  const totalPaidLeads =
    launchPlan.adSpendPerOpening > 0
      ? Math.floor(launchPlan.adSpendPerOpening / cpl)
      : 0;

  const organicLeads =
    leadAssumptions.b2bLeads + leadAssumptions.communityPopupLeads;
  const totalLeadsPerOpening = totalPaidLeads + organicLeads;

  const closeRate = leadAssumptions.expectedCloseRate / 100;
  const projectedFounders = Math.floor(totalLeadsPerOpening * closeRate);

  const projectedOpeningMRR = projectedFounders * financials.avgMemberValue;

  const requiredMembersFor30K =
    financials.avgMemberValue > 0
      ? Math.ceil(30000 / financials.avgMemberValue)
      : 0;

  const monthlyOpex = financials.monthlyOpex;
  const opexRunwayRatio =
    monthlyOpex > 0 ? projectedOpeningMRR / monthlyOpex : 0;

  const paidConversions = Math.floor(totalPaidLeads * closeRate);
  const cac =
    paidConversions > 0 ? launchPlan.adSpendPerOpening / paidConversions : 0;

  const ltv = financials.avgMemberValue * financials.avgMemberLifetimeMonths;

  const ltvCacRatio = cac > 0 ? ltv / cac : 0;

  const targetFounders = PROVEN_SYSTEM_STATS.avgFoundingMembers;
  const memberGap = Math.max(0, targetFounders - projectedFounders);
  const revenueLeftOnTable =
    memberGap * financials.avgMemberValue * financials.avgMemberLifetimeMonths;

  const totalFrontEndRevenue = projectedFounders * financials.avgMemberValue;

  const units = launchPlan.numOpenings;
  const multiUnitTotalFounders = projectedFounders * units;
  const multiUnitTotalMRR = projectedOpeningMRR * units;
  const multiUnitTotalFrontEnd = totalFrontEndRevenue * units;

  const survivalScore = Math.min(
    100,
    Math.round(
      (projectedFounders / PROVEN_SYSTEM_STATS.survivalThreshold) * 100
    )
  );

  const isAboveSurvivalThreshold =
    projectedFounders >= PROVEN_SYSTEM_STATS.survivalThreshold;

  return {
    cpl,
    totalPaidLeads,
    totalLeadsPerOpening,
    projectedFounders,
    projectedOpeningMRR,
    requiredMembersFor30K,
    monthlyOpex,
    opexRunwayRatio,
    cac,
    ltv,
    ltvCacRatio,
    revenueLeftOnTable,
    totalFrontEndRevenue,
    multiUnitTotalFounders,
    multiUnitTotalMRR,
    multiUnitTotalFrontEnd,
    survivalScore,
    memberGap,
    isAboveSurvivalThreshold,
  };
}

export function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}
