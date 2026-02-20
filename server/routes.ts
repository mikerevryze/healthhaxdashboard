import { Router, type Request, Response } from "express";
import { query } from "./snowflake";
import type { DashboardStats } from "../shared/types";

export const router = Router();

router.get("/api/stats", async (_req: Request, res: Response) => {
  try {
    // KPI summary
    const kpiRows = await query<{
      TOTAL_DEALS: number;
      WON_DEALS: number;
      LOST_DEALS: number;
      OPEN_DEALS: number;
      TOTAL_VALUE: number;
      LAST_ACTIVITY: string | null;
    }>(`
      SELECT
        COUNT(*)                                           AS TOTAL_DEALS,
        SUM(CASE WHEN STATUS = 'won' THEN 1 ELSE 0 END)   AS WON_DEALS,
        SUM(CASE WHEN STATUS = 'lost' THEN 1 ELSE 0 END)  AS LOST_DEALS,
        SUM(CASE WHEN STATUS = 'open' THEN 1 ELSE 0 END)  AS OPEN_DEALS,
        SUM(MONETARY_VALUE)                                AS TOTAL_VALUE,
        MAX(UPDATED_AT_TS)                                 AS LAST_ACTIVITY
      FROM GHL_OPPORTUNITIES
    `);

    // Pipeline funnel (active deals, exclude lost)
    const funnelRows = await query<{
      PIPELINE_NAME: string;
      PIPELINE_STAGE_NAME: string;
      OPP_COUNT: number;
      TOTAL_VALUE: number;
    }>(`
      SELECT
        PIPELINE_NAME,
        PIPELINE_STAGE_NAME,
        COUNT(*)            AS OPP_COUNT,
        SUM(MONETARY_VALUE) AS TOTAL_VALUE
      FROM GHL_OPPORTUNITIES
      WHERE STATUS != 'lost'
      GROUP BY PIPELINE_NAME, PIPELINE_STAGE_NAME
      ORDER BY PIPELINE_NAME, OPP_COUNT DESC
    `);

    // Deals by status
    const statusRows = await query<{
      STATUS: string;
      CNT: number;
    }>(`
      SELECT STATUS, COUNT(*) AS CNT
      FROM GHL_OPPORTUNITIES
      GROUP BY STATUS
      ORDER BY CNT DESC
    `);

    // Recent deals (last 10 updated)
    const recentRows = await query<{
      NAME: string;
      PIPELINE_STAGE_NAME: string;
      STATUS: string;
      MONETARY_VALUE: number;
      UPDATED_AT_TS: string | null;
    }>(`
      SELECT NAME, PIPELINE_STAGE_NAME, STATUS, MONETARY_VALUE, UPDATED_AT_TS
      FROM GHL_OPPORTUNITIES
      ORDER BY UPDATED_AT_TS DESC
      LIMIT 10
    `);

    const kpi = kpiRows[0];

    const stats: DashboardStats = {
      kpis: {
        totalDeals: kpi?.TOTAL_DEALS ?? 0,
        wonDeals: kpi?.WON_DEALS ?? 0,
        lostDeals: kpi?.LOST_DEALS ?? 0,
        openDeals: kpi?.OPEN_DEALS ?? 0,
        totalValue: kpi?.TOTAL_VALUE ?? 0,
        lastActivity: kpi?.LAST_ACTIVITY ?? null,
      },
      funnel: funnelRows.map((r) => ({
        pipelineName: r.PIPELINE_NAME,
        stageName: r.PIPELINE_STAGE_NAME,
        count: r.OPP_COUNT,
        totalValue: r.TOTAL_VALUE ?? 0,
      })),
      byStatus: statusRows.map((r) => ({
        status: r.STATUS,
        count: r.CNT,
      })),
      recent: recentRows.map((r) => ({
        name: r.NAME,
        stageName: r.PIPELINE_STAGE_NAME,
        status: r.STATUS,
        value: r.MONETARY_VALUE ?? 0,
        updatedAt: r.UPDATED_AT_TS ?? null,
      })),
    };

    res.json(stats);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stats API error:", message);
    res.status(500).json({ error: "Failed to load stats", detail: message });
  }
});
