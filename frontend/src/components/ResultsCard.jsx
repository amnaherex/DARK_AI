import React from "react";

const ResultsCard = ({ results }) => {
  const categories = [
    {
      id: "urgency",
      name: "Fake Urgency",
      sub: "Artificial time pressure tactics",
      color: "urgency",
    },
    {
      id: "social",
      name: "Fake Social Proof",
      sub: "Misleading popularity claims",
      color: "social",
    },
    {
      id: "scarcity",
      name: "False Scarcity",
      sub: "Fabricated low-stock warnings",
      color: "scarcity",
    },
  ];

  const totalFound = results
    ? Object.values(results).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="results-stack flex flex-col gap-[10px]">
        {categories.map((cat) => {
          const count = results ? results[cat.id] || 0 : 0;
          return (
            <div
              key={cat.id}
              className={`pattern-card group ${cat.color} bg-white/72 border border-white/90 rounded-pattern p-[17px_18px] flex items-center gap-[13px] relative overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg`}
            >
              <div className="dot w-[9px] h-[9px] rounded-full shrink-0"></div>
              <div className="card-text flex-1">
                <span className="p-name block text-[13px] font-semibold mb-0.5">
                  {cat.name}
                </span>
                <span className="p-sub text-[11.5px] text-pattern-muted">
                  {cat.sub}
                </span>
              </div>
              <span
                className={`p-count font-serif text-[28px] leading-none ${count === 0 ? "text-pattern-light" : "text-pattern-text"}`}
              >
                {count}
              </span>
            </div>
          );
        })}
      </div>

      <div className="summary-box mt-[18px] bg-black/5 border border-border-sub rounded-pattern p-[18px_20px] flex justify-between items-center">
        <div>
          <div className="sum-label text-[10px] font-semibold tracking-widest uppercase text-pattern-muted mb-2">
            Total Patterns
          </div>
          <div className="progress-track w-[110px] h-1 bg-black/10 rounded-full overflow-hidden">
            <div
              className="progress-fill h-full bg-pattern-text transition-all duration-700"
              style={{ width: `${Math.min(totalFound * 5, 100)}%` }}
            ></div>
          </div>
        </div>
        <span className="total-n font-serif text-[44px] leading-none">
          {totalFound}
        </span>
      </div>
    </div>
  );
};

export default ResultsCard;
