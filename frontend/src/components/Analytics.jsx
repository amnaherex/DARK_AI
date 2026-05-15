import React, { useEffect, useState } from "react";

const Analytics = () => {
  const [stats, setStats] = useState({
    urgency: 0,
    social: 0,
    scarcity: 0,
    hidden: 0,
    total: 0,
  });

  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.get(["scanHistory"], (data) => {
        if (data.scanHistory) {
          const totals = data.scanHistory.reduce(
            (acc, curr) => {
              acc.urgency += curr.breakdown?.urgency || 0;
              acc.social += curr.breakdown?.social || 0;
              acc.scarcity += curr.breakdown?.scarcity || 0;
              acc.hidden += curr.breakdown?.hidden || 0;
              acc.total += curr.total || 0;
              return acc;
            },
            { urgency: 0, social: 0, scarcity: 0, hidden: 0, total: 0 },
          );
          setStats(totals);
        }
      });
    }
  }, []);

  const getPct = (val) =>
    stats.total > 0 ? Math.round((val / stats.total) * 100) : 0;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="sec-label text-[10px] font-semibold tracking-widest uppercase text-pattern-muted mb-1">
        Data Visualization
      </div>
      <h2 className="analytics-title font-serif text-2xl mb-5 text-pattern-text">
        Threat Distribution
      </h2>

      <div className="donut-wrap bg-white/55 border border-white/90 rounded-pattern p-5 flex items-center gap-5 mb-[14px]">
        <svg
          className="donut-svg shrink-0 w-[110px] h-[110px]"
          viewBox="0 0 110 110"
        >
          <circle
            cx="55"
            cy="55"
            r="40"
            fill="none"
            stroke="rgba(15,22,35,.07)"
            strokeWidth="13"
          />
          <text
            x="55"
            y="50"
            textAnchor="middle"
            className="font-serif text-[17px]"
            fill="#0f1623"
          >
            {stats.total}
          </text>
          <text
            x="55"
            y="63"
            textAnchor="middle"
            className="font-sans text-[7.5px] font-bold tracking-widest text-pattern-muted"
          >
            TOTAL
          </text>
        </svg>
        <div className="donut-legend flex-1 flex flex-col gap-[9px]">
          <div className="legend-row flex items-center gap-2">
            <div className="legend-dot w-2 h-2 rounded-full bg-urgency"></div>
            <span className="legend-name text-[11.5px] text-pattern-muted flex-1">
              Urgency
            </span>
            <span className="legend-pct text-xs font-semibold">
              {getPct(stats.urgency)}%
            </span>
          </div>
          <div className="legend-row flex items-center gap-2">
            <div className="legend-dot w-2 h-2 rounded-full bg-social"></div>
            <span className="legend-name text-[11.5px] text-pattern-muted flex-1">
              Social Proof
            </span>
            <span className="legend-pct text-xs font-semibold">
              {getPct(stats.social)}%
            </span>
          </div>
          <div className="legend-row flex items-center gap-2">
            <div className="legend-dot w-2 h-2 rounded-full bg-scarcity"></div>
            <span className="legend-name text-[11.5px] text-pattern-muted flex-1">
              Scarcity
            </span>
            <span className="legend-pct text-xs font-semibold">
              {getPct(stats.scarcity)}%
            </span>
          </div>
        </div>
      </div>

      <div className="stats-row flex gap-[10px]">
        <div className="stat-card flex-1 bg-white/60 border border-white/90 rounded-2xl p-[13px_14px]">
          <div className="stat-label text-[9.5px] font-semibold tracking-widest uppercase text-pattern-muted mb-[5px]">
            Peak
          </div>
          <div className="stat-val font-serif text-[21px]">
            {stats.total > 20 ? "High" : "Low"}
          </div>
        </div>
        <div className="stat-card flex-1 bg-white/60 border border-white/90 rounded-2xl p-[13px_14px]">
          <div className="stat-label text-[9.5px] font-semibold tracking-widest uppercase text-pattern-muted mb-[5px]">
            Risk
          </div>
          <div className="stat-val font-serif text-[21px]">
            {stats.total > 15 ? "88%" : "12%"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
