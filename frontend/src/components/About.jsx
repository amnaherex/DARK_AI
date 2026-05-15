import React from "react";

const About = () => {
  const steps = [
    {
      n: 1,
      t: "Click the Extension Icon",
      d: "Open the popup on any page by clicking the icon in your toolbar.",
    },
    {
      n: 2,
      t: "Scan the Page",
      d: "Hit Re-scan Page to analyze text, timers, and social cues in real time.",
    },
    {
      n: 3,
      t: "Review Highlights",
      d: "Patterns are highlighted on-page and categorized in the Scanner tab.",
    },
    {
      n: 4,
      t: "Track Over Time",
      d: "Visit Analytics for charts and History to compare manipulation scores.",
    },
  ];

  const pills = [
    { name: "Fake Urgency", color: "bg-urgency" },
    { name: "Fake Social Proof", color: "bg-social" },
    { name: "False Scarcity", color: "bg-scarcity" },
    { name: "Hidden Fees", color: "bg-hidden" },
    // { name: "Roach Motels", color: "bg-[#38bdf8]" },
    // { name: "Misdirection", color: "bg-[#f472b6]" },
  ];

  return (
    <div className="animate-in fade-in duration-500 max-h-[460px] overflow-y-auto no-scrollbar pr-1">
      {/* Hero Section */}
      <div className="bg-pattern-text rounded-app p-6 mb-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_-10%,rgba(124,106,247,0.4)_0%,transparent_60%)]"></div>
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/18 rounded-full px-3 py-1 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
            <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">
              Free · Open Source
            </span>
          </div>
          <h2 className="font-serif text-2xl text-white mb-2 leading-tight">
            Pattern Detector Pro
          </h2>
          <p className="text-[12px] text-white/60 leading-relaxed">
            A browser extension that detects and highlights manipulative dark
            patterns on any webpage — so you can shop, book, and browse with
            full awareness.
          </p>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="text-[10px] font-bold uppercase tracking-widest text-pattern-muted mb-3">
        How it works
      </div>
      <div className="space-y-2 mb-5">
        {steps.map((step) => (
          <div
            key={step.n}
            className="bg-white/65 border border-white/90 rounded-2xl p-4 flex gap-3 items-start shadow-sm"
          >
            <div className="w-7 h-7 bg-pattern-text text-white rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              {step.n}
            </div>
            <div>
              <div className="text-[13px] font-bold text-pattern-text">
                {step.t}
              </div>
              <div className="text-[11.5px] text-pattern-muted leading-relaxed">
                {step.d}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detection Pills */}
      <div className="text-[10px] font-bold uppercase tracking-widest text-pattern-muted mb-3">
        What we detect
      </div>
      <div className="flex flex-wrap gap-2 mb-5">
        {pills.map((pill) => (
          <div
            key={pill.name}
            className="flex items-center gap-2 bg-white/68 border border-white/90 rounded-full px-3 py-1.5 text-[11.5px] font-medium shadow-sm"
          >
            <div className={`w-1.5 h-1.5 rounded-full ${pill.color}`}></div>
            {pill.name}
          </div>
        ))}
      </div>

      {/* Privacy Card */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 flex gap-3 items-start">
        <div className="shrink-0 mt-0.5">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#16a34a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <div>
          <div className="text-[13px] font-bold text-green-800">
            100% Private by Design
          </div>
          <div className="text-[11.5px] text-green-700/80 leading-relaxed">
            All analysis runs locally in your browser. No page content, URLs, or
            personal data is ever sent to any server.
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 pb-2 text-center text-[11px] text-pattern-light">
        v1.0.0 &nbsp;·&nbsp;
        <a href="#" className="text-pattern-muted hover:text-pattern-text ml-1">
          Privacy Policy
        </a>{" "}
        &nbsp;·&nbsp;
        <a href="#" className="text-pattern-muted hover:text-pattern-text">
          GitHub
        </a>
      </div>
    </div>
  );
};

export default About;
