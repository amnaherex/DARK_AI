import React from "react";
import { motion } from "framer-motion";

const ResultsCard = ({ results }) => {
  const total = Object.values(results).reduce((a, b) => a + b, 0);

  if (total === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-6 bg-emerald-50/50 backdrop-blur-sm rounded-2xl border border-emerald-100 mt-4"
      >
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl">🛡️</span>
        </div>
        <h3 className="text-emerald-800 font-bold">Secure Browsing</h3>
        <p className="text-emerald-600 text-xs mt-1">
          No deceptive patterns detected on this page.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-br from-red-500 to-orange-600 p-5 rounded-2xl text-white shadow-lg relative overflow-hidden"
      >
        <div className="relative z-10">
          <span className="text-4xl font-black">{total}</span>
          <p className="text-[10px] font-bold uppercase tracking-[2px] opacity-80">
            Potential Traps Detected
          </p>
        </div>
        {/* Decorative Circle */}
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
      </motion.div>

      <div className="space-y-2">
        {Object.entries(results).map(([key, value], index) => {
          if (value === 0) return null;
          return (
            <motion.div
              key={key}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="group p-3 bg-white border border-gray-100 rounded-xl hover:border-indigo-200 transition-colors shadow-sm"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="capitalize text-xs font-bold text-gray-600 tracking-wide">
                  {key.replace("_", " ")}
                </span>
                <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  {value}
                </span>
              </div>
              {/* Animated Progress Bar */}
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(value * 20, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    key === "scarcity"
                      ? "bg-red-500"
                      : key === "urgency"
                        ? "bg-orange-500"
                        : "bg-yellow-500"
                  }`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultsCard;
