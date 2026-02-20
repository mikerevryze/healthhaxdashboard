import type { RecentDeal } from "../../shared/types";

interface Props {
  deals: RecentDeal[];
}

const statusBadge: Record<string, string> = {
  open: "bg-yellow-500/20 text-yellow-400",
  won: "bg-green-500/20 text-green-400",
  lost: "bg-red-500/20 text-red-400",
  abandoned: "bg-gray-500/20 text-gray-400",
};

export function RecentDeals({ deals }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 text-left border-b border-gray-800">
              <th className="pb-2 font-medium">Name</th>
              <th className="pb-2 font-medium">Stage</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium text-right">Value</th>
              <th className="pb-2 font-medium text-right">Updated</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((deal, i) => (
              <tr
                key={i}
                className="border-b border-gray-800/50 hover:bg-gray-800/30"
              >
                <td className="py-2 text-gray-200">{deal.name}</td>
                <td className="py-2 text-gray-400">{deal.stageName}</td>
                <td className="py-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs capitalize ${
                      statusBadge[deal.status] || "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {deal.status}
                  </span>
                </td>
                <td className="py-2 text-right text-gray-300">
                  ${(deal.value ?? 0).toLocaleString()}
                </td>
                <td className="py-2 text-right text-gray-500">
                  {deal.updatedAt
                    ? new Date(deal.updatedAt).toLocaleDateString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
