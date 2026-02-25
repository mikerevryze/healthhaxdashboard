import { z } from "zod";

export const stressTestSubmissionSchema = z.object({
  path: z.enum(["franchisee", "franchisor"]),
  brandName: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  linkedIn: z.string(),
  numberOfOpenings: z.number().min(1),
  populationDensity: z.enum(["urban", "suburban", "rural"]),
  monthlyAdSpend: z.number().min(0),
  popupLeadsPerMonth: z.number().min(0),
  b2bEventsPerMonth: z.number().min(0),
  expectedCloseRate: z.number().min(0).max(100),
  avgMemberValue: z.number().min(0),
  memberLifetimeMonths: z.number().min(1),
  monthlyRent: z.number().min(0),
  monthlyPayroll: z.number().min(0),
  monthlyOtherCosts: z.number().min(0),
});

export type StressTestSubmission = z.infer<typeof stressTestSubmissionSchema>;
