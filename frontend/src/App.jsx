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

  // Mesh Gradient Styling
  const meshBackground = {
    backgroundColor: "#f3f6ff",
    backgroundImage: `
      radial-gradient(at 0% 0%, hsla(225, 39%, 95%, 1) 0, transparent 50%), 
      radial-gradient(at 50% 0%, hsla(225, 100%, 90%, 0.6) 0, transparent 50%), 
      radial-gradient(at 100% 0%, hsla(210, 100%, 92%, 1) 0, transparent 50%), 
      radial-gradient(at 50% 50%, hsla(225, 100%, 97%, 1) 0, transparent 50%),
      radial-gradient(at 0% 100%, hsla(225, 39%, 92%, 1) 0, transparent 50%), 
      radial-gradient(at 100% 100%, hsla(220, 70%, 32%, 0.50) 0, transparent 50%)
    `,
  };

  return (
    <div
      style={meshBackground}
      className="app-container w-[380px] min-h-[580px] border border-white/90 rounded-app overflow-hidden shadow-2xl transition-all duration-500 flex flex-col relative"
    >
      {/* Optional: Add a slight frosted glass overlay 
         to make the content pop against the gradient 
      */}
      <div className="absolute inset-0 backdrop-blur-[20px] bg-white/20 -z-10" />

      {/* Top Branding Section */}
      <Header />

      {/* Navigation Tabs */}
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-y-auto no-scrollbar relative z-10">
        {activeTab === "scanner" && (
          <div className="tab-content animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-500/80 mb-4 tracking-widest">
              Patterns Detected
              <button
                onClick={clearHighlights}
                className="bg-white/60 px-2 py-1 rounded-full border border-white/80 hover:bg-white transition-colors text-[9px] text-slate-600 shadow-sm"
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

        {/* Other Tabs */}
        {activeTab === "analytics" && <Analytics />}
        {activeTab === "history" && <History />}
        {activeTab === "about" && <About />}
      </main>

      {/* Bottom Security Footer */}
      <footer className="bg-white/30 backdrop-blur-md py-3 text-center border-t border-white/40 z-10">
        <p className="text-[9px] text-slate-400 uppercase tracking-[0.1em] font-bold">
          Shield Active · Local Analysis Mode
        </p>
      </footer>
    </div>
  );
}

export default App;
