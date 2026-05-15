import React from "react";

const StatusView = ({ status, error }) => {
  if (status === "idle") return null;

  return (
    <div className="mb-4 animate-in fade-in zoom-in duration-300">
      {status === "scanning" && (
        <div className="bg-pattern-text/5 border border-pattern-text/10 rounded-2xl p-4 flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pattern-text opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-pattern-text"></span>
          </div>
          <div className="text-[13px] font-medium text-pattern-text">
            Analyzing page elements...
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="bg-scarcity/10 border border-scarcity/20 rounded-2xl p-4 flex items-start gap-3">
          <span className="text-lg mt-0.5">⚠️</span>
          <div>
            <div className="text-[13px] font-bold text-scarcity">
              Scan Failed
            </div>
            <div className="text-[11.5px] text-scarcity/80 leading-relaxed">
              {error || "Something went wrong."}
            </div>
          </div>
        </div>
      )}

      {status === "success" && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 flex items-center gap-3">
          <span className="text-lg">✨</span>
          <div className="text-[13px] font-medium text-green-700">
            Analysis complete! Results updated.
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusView;
