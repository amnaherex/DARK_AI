import React from "react";
import { motion } from "framer-motion";

const ActionButtons = ({ onScan, onClear, isScanning, showClear }) => {
  return (
    <div className="mt-auto pt-6 space-y-3">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onScan}
        disabled={isScanning}
        className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl transition-all
          flex justify-center items-center gap-3
          ${
            isScanning
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-indigo-200 hover:shadow-2xl"
          }`}
      >
        {isScanning ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="tracking-wide">Analyzing...</span>
          </div>
        ) : (
          <>
            <span className="text-lg">🛡️</span>
            <span className="tracking-wide">Scan Page</span>
          </>
        )}
      </motion.button>

      {showClear && !isScanning && (
        <button
          onClick={onClear}
          className="w-full py-2 text-xs font-bold text-gray-400 hover:text-indigo-500 transition-colors uppercase tracking-widest"
        >
          Reset View
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
