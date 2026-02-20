import type { FunnelStage } from "../../shared/types";

interface Props {
  funnel: FunnelStage[];
}

export function FunnelTable({ funnel }: Props) {
  if (funnel.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Pipeline Funnel</h2>
        <p className="text-gray-500">No active deals found.</p>
      </div>
    );
  }

  const maxCount = Math.max(...funnel.map((s) => s.count));

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Pipeline Funnel</h2>
      <div className="space-y-3">
        {funnel.map((stage, i) => (
          <div key={`${stage.pipelineName}-${stage.stageName}-${i}`}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300">{stage.stageName}</span>
              <span className="text-gray-400">
                {stage.count} deal{stage.count !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all"
                style={{ width: `${(stage.count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
