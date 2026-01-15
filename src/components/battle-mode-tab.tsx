"use client";

export type BattleMode = "single" | "double";

interface BattleModeTabProps {
  value: BattleMode;
  onChange: (mode: BattleMode) => void;
  disabled?: boolean;
}

export function BattleModeTab({ value, onChange, disabled }: BattleModeTabProps) {
  return (
    <div className="flex bg-pokemon-blue-100 rounded-pokemon p-1">
      <button
        onClick={() => onChange("single")}
        disabled={disabled}
        className={`flex-1 py-2 px-4 rounded-pokemon font-bold transition-all ${
          value === "single"
            ? "bg-white text-pokemon-blue-700 shadow-md"
            : "text-pokemon-blue-500 hover:text-pokemon-blue-700"
        } disabled:opacity-50`}
      >
        シングル
      </button>
      <button
        onClick={() => onChange("double")}
        disabled={disabled}
        className={`flex-1 py-2 px-4 rounded-pokemon font-bold transition-all ${
          value === "double"
            ? "bg-white text-pokemon-blue-700 shadow-md"
            : "text-pokemon-blue-500 hover:text-pokemon-blue-700"
        } disabled:opacity-50`}
      >
        ダブル
      </button>
    </div>
  );
}
