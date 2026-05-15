import React from "react";

const Tabs = ({ activeTab, setActiveTab }) => {
  const tabs = ["scanner", "analytics", "history", "about"];

  return (
    <nav className="flex px-3 pt-2 bg-white/38 border-b border-border-sub overflow-x-auto no-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-3 py-2 text-[10.5px] font-bold uppercase tracking-widest transition-all border-b-2 mb-[-1px] whitespace-nowrap ${
            activeTab === tab
              ? "text-pattern-text border-pattern-text"
              : "text-pattern-muted border-transparent hover:text-pattern-text"
          }`}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
};

export default Tabs;
