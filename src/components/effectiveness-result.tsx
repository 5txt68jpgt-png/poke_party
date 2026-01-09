"use client";

import { EffectivenessResult as EffectivenessResultType } from "@/lib/effectiveness/types";
import { formatMultiplier } from "@/lib/effectiveness/calculator";

interface EffectivenessResultProps {
  result: EffectivenessResultType | null;
}

const CATEGORY_STYLES: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  immune: {
    bg: "bg-gray-200",
    text: "text-gray-600",
    border: "border-gray-300",
  },
  not_very: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-300",
  },
  normal: {
    bg: "bg-gray-100",
    text: "text-gray-600",
    border: "border-gray-200",
  },
  super: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-300",
  },
};

export function EffectivenessResult({ result }: EffectivenessResultProps) {
  if (!result) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
        相手のタイプを選択してください
      </div>
    );
  }

  const styles = CATEGORY_STYLES[result.category];
  const isSuper4x = result.category === "super" && result.multiplier === 4;

  return (
    <div
      className={`p-4 rounded-lg border ${styles.bg} ${styles.border} text-center`}
    >
      <div
        className={`text-3xl font-bold ${styles.text} ${isSuper4x ? "animate-pulse" : ""}`}
      >
        {formatMultiplier(result.multiplier)}
      </div>
      <div className={`mt-2 text-lg font-medium ${styles.text}`}>
        {result.message}
      </div>
    </div>
  );
}
