import { useState } from "react";

export const useScanner = () => {
  const [status, setStatus] = useState("idle");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const scanPage = async () => {
    setStatus("scanning");
    setError("");

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      chrome.tabs.sendMessage(tab.id, { type: "ANALYZE_PAGE" }, (response) => {
        if (chrome.runtime.lastError) {
          setError("Could not connect to page. Try refreshing.");
          setStatus("error");
          return;
        }
        if (response?.error) {
          setError(response.error);
          setStatus("error");
          return;
        }

        const breakdown = response.breakdown;
        setResults(breakdown);
        setStatus("success");

        // Real Data Save Logic for Analytics & History
        const totalFound = Object.values(breakdown).reduce((a, b) => a + b, 0);
        const newEntry = {
          url: new URL(tab.url).hostname,
          date: new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
          }),
          breakdown: breakdown,
          total: totalFound,
        };

        chrome.storage.local.get(["scanHistory"], (data) => {
          const history = data.scanHistory || [];
          // Sirf top 10 scans save rakhte hain
          chrome.storage.local.set({
            scanHistory: [newEntry, ...history].slice(0, 10),
          });
        });
      });
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  const clearHighlights = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    chrome.tabs.sendMessage(tab.id, { type: "CLEAR_HIGHLIGHTS" });
    setStatus("idle");
    setResults(null);
  };

  return { status, results, error, scanPage, clearHighlights };
};
