import React from "react";

const Header = () => {
  return (
    <header className="flex flex-col items-center justify-center border-b border-gray-100 pb-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-indigo-200 shadow-lg">
          <span className="text-white font-black text-xl italic">S</span>
        </div>
        <h1 className="text-xl font-extrabold tracking-tight text-gray-800">
          Shield<span className="text-indigo-600">AI</span>
        </h1>
      </div>
      <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1 font-semibold">
        Deceptive Pattern Detector
      </p>
    </header>
  );
};

export default Header;
