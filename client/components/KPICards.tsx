import type { DashboardKPIs } from "../../shared/types";

interface Props {
  kpis: DashboardKPIs;
}

export function KPICards({ kpis }: Props) {
  const conversionRate =
    kpis.totalDeals > 0
      ? ((kpis.wonDeals / kpis.totalDeals) * 100).toFixed(1)
      : "0.0";

  const cards = [
    { label: "Total Deals", value: kpis.totalDeals, color: "text-blue-400" },
    { label: "Open Deals", value: kpis.openDeals, color: "text-yellow-400" },
    { label: "Won Deals", value: kpis.wonDeals, color: "text-green-400" },
    { label: "Lost Deals", value: kpis.lostDeals, color: "text-red-400" },
    { label: "Conversion Rate", value: `${conversionRate}%`, color: "text-purple-400" },
    {
      label: "Total Value",
      value: `$${(kpis.totalValue ?? 0).toLocaleString()}`,
      color: "text-emerald-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-gray-900 border border-gray-800 rounded-lg p-4"
        >
          <div className="text-gray-400 text-xs uppercase tracking-wide mb-1">
            {card.label}
          </div>
          <div className={`text-2xl font-bold ${card.color}`}>
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}
