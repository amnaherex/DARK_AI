import React, { useEffect, useState } from "react";

const Analytics = () => {
  const [stats, setStats] = useState({
    urgency: 0,
    social: 0,
    scarcity: 0,
    hidden: 0,
    total: 0,
  });

  const fetchData = () => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.get(["scanHistory"], (data) => {
        if (data.scanHistory && Array.isArray(data.scanHistory)) {
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
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetStats = () => {
    if (confirm("Are you sure you want to clear all analytics data?")) {
      chrome.storage.local.set({ scanHistory: [] }, () => {
        setStats({ urgency: 0, social: 0, scarcity: 0, hidden: 0, total: 0 });
      });
    }
  };

  const getPct = (val) =>
    stats.total > 0 ? Math.round((val / stats.total) * 100) : 0;

  // SVG Constants for the Donut Ring
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const dashOffset =
    circumference -
    (getPct(stats.total > 0 ? stats.total : 0) / 100) * circumference;

  return (
    <div className="animate-in fade-in duration-500 p-4">
      <div className="flex justify-between items-start mb-1">
        <div>
          <div className="sec-label text-[10px] font-semibold tracking-widest uppercase text-slate-400">
            Data Visualization
          </div>
          <h2 className="analytics-title font-serif text-2xl mb-5 text-slate-800">
            Threat Distribution
          </h2>
        </div>
        <button
          onClick={resetStats}
          className="text-[10px] font-bold text-red-400 hover:text-red-600 transition-colors uppercase tracking-widest mt-1"
        >
          Reset
        </button>
      </div>

      <div className="donut-wrap bg-white/55 border border-white/90 rounded-2xl p-5 flex items-center gap-5 mb-[14px] shadow-sm">
        <svg
          className="donut-svg shrink-0 w-[110px] h-[110px] -rotate-90"
          viewBox="0 0 110 110"
        >
          {/* Background Circle */}
          <circle
            cx="55"
            cy="55"
            r={radius}
            fill="none"
            stroke="rgba(15,22,35,.07)"
            strokeWidth="12"
          />
          {/* Progress Circle (Total) */}
          <circle
            cx="55"
            cy="55"
            r={radius}
            fill="none"
            stroke="#6366f1"
            strokeWidth="12"
            strokeDasharray={circumference}
            style={{
              strokeDashoffset: stats.total > 0 ? 0 : circumference,
              transition: "stroke-dashoffset 0.5s ease",
            }}
            strokeLinecap="round"
          />
          <text
            x="55"
            y="-50"
            textAnchor="middle"
            className="font-serif text-[17px] fill-slate-800"
            transform="rotate(90)"
          >
            {stats.total}
          </text>
          <text
            x="55"
            y="-38"
            textAnchor="middle"
            className="font-sans text-[7.5px] font-bold tracking-widest fill-slate-400"
            transform="rotate(90)"
          >
            TOTAL
          </text>
        </svg>

        <div className="donut-legend flex-1 flex flex-col gap-[9px]">
          <LegendRow
            label="Urgency"
            pct={getPct(stats.urgency)}
            color="bg-red-400"
          />
          <LegendRow
            label="Social Proof"
            pct={getPct(stats.social)}
            color="bg-blue-400"
          />
          <LegendRow
            label="Scarcity"
            pct={getPct(stats.scarcity)}
            color="bg-amber-400"
          />
        </div>
      </div>

      <div className="stats-row flex gap-[10px]">
        <StatCard
          label="Peak Severity"
          value={stats.total > 20 ? "High" : "Low"}
        />
        <StatCard
          label="Risk Index"
          value={`${stats.total > 15 ? "88" : "12"}%`}
        />
      </div>
    </div>
  );
};

// Small helper components for cleaner code
const LegendRow = ({ label, pct, color }) => (
  <div className="legend-row flex items-center gap-2">
    <div className={`legend-dot w-2 h-2 rounded-full ${color}`}></div>
    <span className="legend-name text-[11.5px] text-slate-500 flex-1">
      {label}
    </span>
    <span className="legend-pct text-xs font-semibold">{pct}%</span>
  </div>
);

const StatCard = ({ label, value }) => (
  <div className="stat-card flex-1 bg-white/60 border border-white/90 rounded-2xl p-[13px_14px] shadow-sm">
    <div className="stat-label text-[9.5px] font-semibold tracking-widest uppercase text-slate-400 mb-[5px]">
      {label}
    </div>
    <div className="stat-val font-serif text-[21px] text-slate-800">
      {value}
    </div>
  </div>
);

export default Analytics;
