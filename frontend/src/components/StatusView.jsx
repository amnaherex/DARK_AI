import React from "react";

const StatusView = ({ type, message }) => {
  if (type === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-10 animate-pulse">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 font-medium text-sm text-center">
          Analyzing page content... <br />
          <span className="text-xs text-gray-400">Talking to Flask API</span>
        </p>
      </div>
    );
  }

  if (type === "error") {
    return (
      <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex flex-col items-center text-center">
        <span className="text-2xl">⚠️</span>
        <h3 className="text-red-700 font-bold mt-1 text-sm">
          Connection Error
        </h3>
        <p className="text-red-500 text-xs mt-1 leading-relaxed">{message}</p>
      </div>
    );
  }

  return null;
};

export default StatusView;
