export type UserPath = "franchisee" | "franchisor";

export type PopulationDensity = "low" | "medium" | "high";

export interface ProfileData {
  brandName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  linkedin: string;
}

export interface LaunchPlanData {
  numOpenings: number;
  adSpendPerOpening: number;
  populationDensity: PopulationDensity;
}

export interface LeadAssumptionsData {
  b2bLeads: number;
  communityPopupLeads: number;
  expectedCloseRate: number;
}

export interface FinancialData {
  avgMemberValue: number;
  avgMemberLifetimeMonths: number;
  monthlyOpex: number;
}

export interface ExperienceState {
  currentScreen: number;
  userPath: UserPath | null;
  profile: ProfileData;
  launchPlan: LaunchPlanData;
  leadAssumptions: LeadAssumptionsData;
  financials: FinancialData;
  narrationEnabled: boolean;
}

export interface Projections {
  cpl: number;
  totalPaidLeads: number;
  totalLeadsPerOpening: number;
  projectedFounders: number;
  projectedOpeningMRR: number;
  requiredMembersFor30K: number;
  monthlyOpex: number;
  opexRunwayRatio: number;
  cac: number;
  ltv: number;
  ltvCacRatio: number;
  revenueLeftOnTable: number;
  totalFrontEndRevenue: number;
  multiUnitTotalFounders: number;
  multiUnitTotalMRR: number;
  multiUnitTotalFrontEnd: number;
  survivalScore: number;
  memberGap: number;
  isAboveSurvivalThreshold: boolean;
}

export const INITIAL_STATE: ExperienceState = {
  currentScreen: 0,
  userPath: null,
  profile: {
    brandName: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    linkedin: "",
  },
  launchPlan: {
    numOpenings: 1,
    adSpendPerOpening: 10000,
    populationDensity: "medium",
  },
  leadAssumptions: {
    b2bLeads: 20,
    communityPopupLeads: 30,
    expectedCloseRate: 15,
  },
  financials: {
    avgMemberValue: 150,
    avgMemberLifetimeMonths: 8,
    monthlyOpex: 25000,
  },
  narrationEnabled: false,
};

export const SCREEN_COUNT = 8;

export const PROVEN_SYSTEM_STATS = {
  avgFoundingMembers: 170,
  avgFrontEndRevenue: 50000,
  survivalThreshold: 150,
  failureProbabilityBelowThreshold: 80,
};
