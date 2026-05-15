import { useState } from "react";

export const useScanner = () => {
  const [status, setStatus] = useState("idle"); // idle, scanning, success, error
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

        setResults(response.breakdown);
        setStatus("success");
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
