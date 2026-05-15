import React, { useEffect, useState } from "react";

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.get(["scanHistory"], (data) => {
        if (data.scanHistory) setHistory(data.scanHistory);
      });
    }
  }, []);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="sec-label text-[10px] font-semibold tracking-widest uppercase text-pattern-muted mb-[18px] flex justify-between">
        Recent Scans{" "}
        <span className="chip text-[10px] bg-white/55 border border-border-sub rounded-full px-[10px] py-[3px]">
          {history.length} sites
        </span>
      </div>
      <div className="history-list flex flex-col gap-[10px]">
        {history.length === 0 ? (
          <div className="text-center py-10 text-pattern-light italic text-xs">
            No scan history found
          </div>
        ) : (
          history.map((item, idx) => (
            <div
              key={idx}
              className="h-card bg-white/68 border border-white/90 rounded-[16px] p-[13px_15px] flex items-center gap-3 hover:-translate-y-0.5 transition-all cursor-pointer shadow-sm"
            >
              <div
                className={`h-icon w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 ${item.total > 10 ? "bg-red-50 text-scarcity" : "bg-green-50 text-green-600"}`}
              >
                {item.total > 10 ? "⚠️" : "✅"}
              </div>
              <div className="h-body flex-1 min-w-0">
                <div className="h-site text-[12.5px] font-semibold truncate">
                  {item.url}
                </div>
                <div className="h-meta text-[11px] text-pattern-muted">
                  {item.date} · {item.total} patterns found
                </div>
              </div>
              <span
                className={`h-badge text-[10.5px] font-bold px-[9px] py-[3px] rounded-full ${item.total > 10 ? "bg-red-100 text-scarcity" : "bg-green-100 text-green-600"}`}
              >
                {item.total > 10 ? "High" : "Safe"}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
