import React from "react";
import { useScanner } from "./hooks/useScanner"; 
import Header from "./components/Header";
import StatusView from "./components/StatusView";
import ResultsCard from "./components/ResultsCard"; 
import ActionButtons from "./components/ActionButtons";
function App() {
  const { status, results, error, scanPage, clearHighlights } = useScanner();

  return (
    <div className="w-[350px] min-h-[400px] bg-white p-5 flex flex-col font-sans shadow-xl border border-gray-100">
      <Header />

      <div className="flex-grow mt-6">
        {/* Default Empty State */}
        {status === "idle" && (
          <div className="text-center text-gray-400 mt-10 text-sm">
            Click scan to start checking for patterns.
          </div>
        )}

        {status === "scanning" && <StatusView type="loading" />}
        {status === "error" && <StatusView type="error" message={error} />}
        {status === "success" && results && <ResultsCard results={results} />}
      </div>

      <ActionButtons
        onScan={scanPage}
        onClear={clearHighlights}
        isScanning={status === "scanning"}
        showClear={status === "success"}
      />
    </div>
  );
}

export default App;
