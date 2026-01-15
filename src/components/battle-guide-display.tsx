"use client";

import { useState } from "react";

interface BattleGuideDisplayProps {
  guide: string;
}

export function BattleGuideDisplay({ guide }: BattleGuideDisplayProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 bg-pokemon-yellow-100 hover:bg-pokemon-yellow-200 rounded-pokemon transition-colors border-2 border-pokemon-yellow-300"
      >
        <span className="font-bold text-pokemon-yellow-800 flex items-center gap-2">
          <span>📖</span>
          <span>戦い方を見る</span>
        </span>
        <span
          className={`text-pokemon-yellow-600 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 bg-pokemon-yellow-50 rounded-pokemon border-2 border-pokemon-yellow-200">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {guide}
          </p>
        </div>
      </div>
    </div>
  );
}
