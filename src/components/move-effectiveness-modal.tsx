"use client";

import { useState, useEffect } from "react";
import { Move, PokemonTypeName } from "@/lib/pokemon/types";
import { TypeBadge } from "./type-badge";
import { TypeSelector } from "./type-selector";
import { EffectivenessResult } from "./effectiveness-result";
import { calculateEffectiveness } from "@/lib/effectiveness/calculator";
import { EffectivenessResult as EffectivenessResultType, DefenderTypes } from "@/lib/effectiveness/types";
import { DAMAGE_CLASS_JAPANESE } from "@/data/type-data";

interface MoveEffectivenessModalProps {
  move: Move | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MoveEffectivenessModal({
  move,
  isOpen,
  onClose,
}: MoveEffectivenessModalProps) {
  const [selectedTypes, setSelectedTypes] = useState<PokemonTypeName[]>([]);
  const [result, setResult] = useState<EffectivenessResultType | null>(null);

  // タイプ選択時に相性を計算
  useEffect(() => {
    if (move && selectedTypes.length > 0 && move.damageClass !== "status") {
      const newResult = calculateEffectiveness(
        move.type.name,
        selectedTypes as DefenderTypes
      );
      setResult(newResult);
    } else {
      setResult(null);
    }
  }, [selectedTypes, move]);

  // モーダルを閉じるときにリセット
  useEffect(() => {
    if (!isOpen) {
      setSelectedTypes([]);
      setResult(null);
    }
  }, [isOpen]);

  if (!isOpen || !move) {
    return null;
  }

  const isStatusMove = move.damageClass === "status";

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-t-2xl p-4 pb-8 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">技の相性チェック</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* 技の情報 */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <TypeBadge type={move.type} size="md" />
            <span className="font-bold text-gray-800 text-lg">
              {move.japaneseName}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            分類: {DAMAGE_CLASS_JAPANESE[move.damageClass] || move.damageClass}
          </div>
          {move.description && (
            <div className="text-sm text-gray-600 mt-1">{move.description}</div>
          )}
        </div>

        {/* 変化技の場合 */}
        {isStatusMove ? (
          <div className="p-4 bg-gray-100 rounded-lg text-center text-gray-600">
            変化技はダメージを与えないため
            <br />
            タイプ相性はありません
          </div>
        ) : (
          <>
            {/* 相手タイプ選択 */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                相手のタイプを選択（最大2つ）
              </h3>
              <TypeSelector
                selectedTypes={selectedTypes}
                onSelect={setSelectedTypes}
                maxSelection={2}
              />
            </div>

            {/* 結果表示 */}
            <EffectivenessResult result={result} />
          </>
        )}
      </div>
    </div>
  );
}
