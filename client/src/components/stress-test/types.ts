export type UserPath = "franchisee" | "franchisor";
export type PopulationDensity = "urban" | "suburban" | "rural";
export type HealthScore = "critical" | "at_risk" | "healthy" | "thriving";

export interface StressTestData {
  path: UserPath | null;
  brandName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  linkedIn: string;
  numberOfOpenings: number;
  populationDensity: PopulationDensity;
  monthlyAdSpend: number;
  popupLeadsPerMonth: number;
  b2bEventsPerMonth: number;
  expectedCloseRate: number;
  avgMemberValue: number;
  memberLifetimeMonths: number;
  monthlyRent: number;
  monthlyPayroll: number;
  monthlyOtherCosts: number;
}

export interface StressTestResults {
  adjustedCPL: number;
  paidLeadsPerMonth: number;
  organicLeadsPerMonth: number;
  totalLeadsPerMonth: number;
  projectedNewMembersPerMonth: number;
  projectedMembersAtLaunch: number;
  monthlyRevenuePerLocation: number;
  totalMRR: number;
  totalMonthlyCosts: number;
  netMonthlyPerLocation: number;
  memberGap: number;
  revenueGapPerLocation: number;
  healthScore: HealthScore;
  ltv: number;
  roasRatio: number;
}

const CPL_BY_DENSITY: Record<PopulationDensity, number> = {
  urban: 25,
  suburban: 35,
  rural: 50,
};

const MEMBER_THRESHOLD = 150;
const PRE_SALE_MONTHS = 3;

export function calculateResults(data: StressTestData): StressTestResults {
  const adjustedCPL = CPL_BY_DENSITY[data.populationDensity];

  const paidLeadsPerMonth =
    data.monthlyAdSpend > 0
      ? Math.floor(data.monthlyAdSpend / adjustedCPL)
      : 0;
  const leadsPerPopup = 15;
  const leadsPerB2BEvent = 25;
  const organicLeadsPerMonth =
    data.popupLeadsPerMonth * leadsPerPopup +
    data.b2bEventsPerMonth * leadsPerB2BEvent;
  const totalLeadsPerMonth = paidLeadsPerMonth + organicLeadsPerMonth;

  const closeRate = data.expectedCloseRate / 100;
  const projectedNewMembersPerMonth = Math.floor(
    totalLeadsPerMonth * closeRate,
  );
  const projectedMembersAtLaunch =
    projectedNewMembersPerMonth * PRE_SALE_MONTHS;

  const monthlyRevenuePerLocation =
    projectedMembersAtLaunch * data.avgMemberValue;
  const totalMRR = monthlyRevenuePerLocation * data.numberOfOpenings;

  const costPerLocation =
    data.monthlyRent + data.monthlyPayroll + data.monthlyOtherCosts;
  const totalMonthlyCosts = costPerLocation * data.numberOfOpenings;
  const netMonthlyPerLocation = monthlyRevenuePerLocation - costPerLocation;

  const memberGap = MEMBER_THRESHOLD - projectedMembersAtLaunch;
  const revenueGapPerLocation = costPerLocation - monthlyRevenuePerLocation;

  const ltv = data.avgMemberValue * data.memberLifetimeMonths;
  const costPerMember =
    totalLeadsPerMonth > 0
      ? data.monthlyAdSpend / (totalLeadsPerMonth * closeRate)
      : 0;
  const roasRatio = costPerMember > 0 ? ltv / costPerMember : 0;

  let healthScore: HealthScore;
  if (projectedMembersAtLaunch < 100) {
    healthScore = "critical";
  } else if (projectedMembersAtLaunch < 150) {
    healthScore = "at_risk";
  } else if (projectedMembersAtLaunch < 200) {
    healthScore = "healthy";
  } else {
    healthScore = "thriving";
  }

  return {
    adjustedCPL,
    paidLeadsPerMonth,
    organicLeadsPerMonth,
    totalLeadsPerMonth,
    projectedNewMembersPerMonth,
    projectedMembersAtLaunch,
    monthlyRevenuePerLocation,
    totalMRR,
    totalMonthlyCosts,
    netMonthlyPerLocation,
    memberGap,
    revenueGapPerLocation,
    healthScore,
    ltv,
    roasRatio,
  };
}

export const NARRATION_SCRIPTS: Record<number, string> = {
  0: "Welcome to the Revryze Launch Stress Test. Are you a franchisee managing five or more units, or a franchisor guiding your network? Choose your path to begin.",
  1: "Great. Let's personalize this experience. Tell us about your brand and how we can reach you. We're tailoring everything specifically for your franchise.",
  2: "Now let's talk growth. How many locations are you opening in the next twelve months, and what kind of markets are they in?",
  3: "Marketing is the engine of your pre-sale. Tell us about your ad budget, grassroots lead generation, and what close rate you're seeing.",
  4: "Revenue modeling time. What's the average monthly value of a pre-launch member, and how long do they typically stay?",
  5: "Let's look at costs. Every location has rent, payroll, and operational expenses. What do yours look like?",
  6: "Here's where it gets real. We analyzed over five hundred franchise launches, and the data tells a clear story.",
  7: "Your results are ready. The next step is a Launch Audit Call where we build your custom playbook.",
};

export const initialStressTestData: StressTestData = {
  path: null,
  brandName: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  linkedIn: "",
  numberOfOpenings: 3,
  populationDensity: "suburban",
  monthlyAdSpend: 5000,
  popupLeadsPerMonth: 4,
  b2bEventsPerMonth: 2,
  expectedCloseRate: 15,
  avgMemberValue: 49,
  memberLifetimeMonths: 14,
  monthlyRent: 8000,
  monthlyPayroll: 12000,
  monthlyOtherCosts: 3000,
};
