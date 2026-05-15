import React from "react";

const ActionButtons = ({ onScan, status }) => (
  <button
    onClick={onScan}
    disabled={status === "scanning"}
    className="w-full mt-4 py-3 bg-pattern-text text-white rounded-[14px] font-bold text-[13px] tracking-wide hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
  >
    {status === "scanning" ? "Scanning Page..." : "Re-scan Page"}
  </button>
);

export default ActionButtons;
