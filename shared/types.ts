// Shared types for the dashboard stats API

export interface DashboardKPIs {
  totalDeals: number;
  wonDeals: number;
  lostDeals: number;
  openDeals: number;
  totalValue: number;
  lastActivity: string | null;
}

export interface FunnelStage {
  pipelineName: string;
  stageName: string;
  count: number;
  totalValue: number;
}

export interface StatusBreakdown {
  status: string;
  count: number;
}

export interface RecentDeal {
  name: string;
  stageName: string;
  status: string;
  value: number;
  updatedAt: string | null;
}

export interface DashboardStats {
  kpis: DashboardKPIs;
  funnel: FunnelStage[];
  byStatus: StatusBreakdown[];
  recent: RecentDeal[];
}
