import React, { useState } from "react";
import { useScanner } from "./hooks/useScanner";
import Tabs from "./components/Tabs";
import Header from "./components/Header";
import StatusView from "./components/StatusView";
import ResultsCard from "./components/ResultsCard";
import ActionButtons from "./components/ActionButtons";
import Analytics from "./components/Analytics";
import History from "./components/History";
import About from "./components/About";

function App() {
  const [activeTab, setActiveTab] = useState("scanner");
  const { status, results, error, scanPage, clearHighlights } = useScanner();

  return (
    <div className="app-container w-[380px] min-h-[580px] bg-surface backdrop-blur-[22px] border border-white/90 rounded-app overflow-hidden shadow-2xl transition-all duration-500 flex flex-col">
      {/* Top Branding Section */}
      <Header />

      {/* Navigation Tabs */}
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-y-auto no-scrollbar">
        {activeTab === "scanner" && (
          <div className="tab-content animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase text-pattern-muted mb-4 tracking-widest">
              Patterns Detected
              <button
                onClick={clearHighlights}
                className="bg-white/55 px-2 py-1 rounded-full border border-border-sub hover:text-pattern-text transition-colors text-[9px]"
              >
                Clear Results
              </button>
            </div>

            {/* Feedback for scanning or errors */}
            <StatusView status={status} error={error} />

            {/* Real-time pattern cards */}
            <ResultsCard results={results} />

            {/* Primary Action Button */}
            <ActionButtons onScan={scanPage} status={status} />
          </div>
        )}

        {/* Other Tabs with lazy animation */}
        {activeTab === "analytics" && <Analytics />}
        {activeTab === "history" && <History />}
        {activeTab === "about" && <About />}
      </main>

      {/* Bottom Security Footer */}
      <footer className="bg-white/20 py-3 text-center border-t border-border-sub">
        <p className="text-[9px] text-pattern-light uppercase tracking-[0.1em] font-bold">
          Shield Active · Local Analysis Mode
        </p>
      </footer>
    </div>
  );
}

export default App;
