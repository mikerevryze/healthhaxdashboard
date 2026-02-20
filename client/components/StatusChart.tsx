import type { StatusBreakdown } from "../../shared/types";

interface Props {
  byStatus: StatusBreakdown[];
}

const statusColors: Record<string, string> = {
  open: "bg-yellow-500",
  won: "bg-green-500",
  lost: "bg-red-500",
  abandoned: "bg-gray-500",
};

export function StatusChart({ byStatus }: Props) {
  const total = byStatus.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-white mb-4">By Status</h2>

      {/* Stacked bar */}
      <div className="flex rounded-full h-4 overflow-hidden mb-4">
        {byStatus.map((s) => (
          <div
            key={s.status}
            className={statusColors[s.status] || "bg-gray-600"}
            style={{ width: `${(s.count / total) * 100}%` }}
            title={`${s.status}: ${s.count}`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {byStatus.map((s) => (
          <div key={s.status} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${statusColors[s.status] || "bg-gray-600"}`}
              />
              <span className="text-gray-300 capitalize">{s.status}</span>
            </div>
            <span className="text-gray-400">
              {s.count} ({((s.count / total) * 100).toFixed(0)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
