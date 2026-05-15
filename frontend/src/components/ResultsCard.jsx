import React from "react";

const ResultsCard = ({ results, onClear }) => {
  const categories = [
    {
      id: "urgency",
      name: "Fake Urgency",
      sub: "Artificial time pressure tactics",
      colorClass: "before:bg-[#E67E22]", // Orange accent
      dotClass: "bg-[#E67E22]",
    },
    {
      id: "social",
      name: "Fake Social Proof",
      sub: "Misleading popularity claims",
      colorClass: "before:bg-[#C2A13E]", // Gold/Yellow accent
      dotClass: "bg-[#C2A13E]",
    },
    {
      id: "scarcity",
      name: "False Scarcity",
      sub: "Fabricated low-stock warnings",
      colorClass: "before:bg-[#E74C3C]", // Red accent
      dotClass: "bg-[#E74C3C]",
    },
  ];

  const totalFound = results
    ? Object.values(results).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <div className="animate-in fade-in duration-500 w-full max-w-md">

      <div className="results-stack flex flex-col gap-[12px]">
        {categories.map((cat) => {
          const count = results ? results[cat.id] || 0 : 0;
          return (
            <div
              key={cat.id}
              className={`
                pattern-card group relative overflow-hidden flex items-center gap-[15px]
                bg-white/80 border border-slate-100 rounded-[18px] p-[18px_20px] 
                transition-all hover:-translate-y-0.5 hover:shadow-md
                before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[4px]
                ${cat.colorClass}
              `}
            >
              <div className={`dot w-[10px] h-[10px] rounded-full shrink-0 ${cat.dotClass}`}></div>
              <div className="card-text flex-1">
                <span className="block text-[14px] font-bold text-slate-800 leading-tight">
                  {cat.name}
                </span>
                <span className="text-[12px] text-slate-500 font-medium">
                  {cat.sub}
                </span>
              </div>
              <span
                className={`font-serif text-[32px] leading-none ${
                  count === 0 ? "text-slate-200" : "text-slate-900"
                }`}
              >
                {count}
              </span>
            </div>
          );
        })}
      </div>

      {/* Summary Box */}
      <div className="summary-box mt-6 bg-[#F8F9FB] border border-[#E8ECEF] rounded-[22px] p-[20px_24px] flex justify-between items-center">
        <div>
          <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-slate-400 mb-3">
            Total Patterns
          </div>
          <div className="progress-track w-[100px] h-[5px] bg-slate-200 rounded-full overflow-hidden">
            <div
              className="progress-fill h-full bg-slate-900 transition-all duration-1000 ease-out"
              style={{ width: `${Math.min((totalFound / 50) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
        <span className="font-serif text-[48px] leading-none text-slate-900">
          {totalFound}
        </span>
      </div>

      
    </div>
  );
};

export default ResultsCard;