import { z } from "zod";

export const metricsSchema = z.object({
  total_leads: z.number(),
  closed_won: z.number(),
  open_deals: z.number(),
  lost_deals: z.number(),
  total_value: z.number(),
});

export type Metrics = z.infer<typeof metricsSchema>;

export const metaSchema = z.object({
  total_spend: z.number(),
  total_leads: z.number(),
  cpl: z.number(),
});

export type MetaMetrics = z.infer<typeof metaSchema>;

export const funnelStageSchema = z.object({
  pipeline_name: z.string(),
  stage_name: z.string(),
  count: z.number(),
  total_value: z.number(),
});

export type FunnelStage = z.infer<typeof funnelStageSchema>;

export const leadsBreakdownSchema = z.object({
  total_leads: z.number(),
  meta_leads: z.number(),
  organic_leads: z.number(),
});

export type LeadsBreakdown = z.infer<typeof leadsBreakdownSchema>;

// RecentDeals component type
export const recentDealSchema = z.object({
  name: z.string(),
  stage_name: z.string(),
  status: z.string(),
  value: z.number().nullable(),
  updated_at: z.string().nullable(),
});

export type RecentDeal = z.infer<typeof recentDealSchema>;

// Replit template types (unused by dashboard but required for compilation)
export interface User {
  id: string;
  username: string;
}

export interface InsertUser {
  username: string;
}
