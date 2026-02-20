import { useEffect, useState } from "react";
import { KPICards } from "../components/KPICards";
import { FunnelTable } from "../components/FunnelTable";
import { StatusChart } from "../components/StatusChart";
import { RecentDeals } from "../components/RecentDeals";
import type { DashboardStats } from "../../shared/types";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: DashboardStats) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400 text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-red-400 text-lg">Error: {error}</div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-white">Revryze Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">
          GHL Pipeline Stats &middot; Live from Snowflake
        </p>
      </header>

      <KPICards kpis={stats.kpis} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <FunnelTable funnel={stats.funnel} />
        </div>
        <div>
          <StatusChart byStatus={stats.byStatus} />
        </div>
      </div>

      <div className="mt-6">
        <RecentDeals deals={stats.recent} />
      </div>
    </div>
  );
}
