"use client";

import { useState, useEffect } from "react";
import { PokemonTypeName } from "@/lib/pokemon/types";
import { TypeBadge } from "./type-badge";
import { MoveSearch } from "./move-search";
import { EffectivenessResult } from "./effectiveness-result";
import { calculateEffectiveness } from "@/lib/effectiveness/calculator";
import { EffectivenessResult as EffectivenessResultType, DefenderTypes } from "@/lib/effectiveness/types";
import { getTypeData } from "@/data/type-data";
import type { MoveEntry } from "@/lib/moves/search";

interface ReceivedMoveModalProps {
  pokemonName: string;
  pokemonTypes: PokemonTypeName[];
  isOpen: boolean;
  onClose: () => void;
}

export function ReceivedMoveModal({
  pokemonName,
  pokemonTypes,
  isOpen,
  onClose,
}: ReceivedMoveModalProps) {
  const [selectedMove, setSelectedMove] = useState<MoveEntry | null>(null);
  const [result, setResult] = useState<EffectivenessResultType | null>(null);

  // 技選択時に相性を計算
  const handleMoveSelect = (move: MoveEntry) => {
    setSelectedMove(move);
    const effectiveness = calculateEffectiveness(
      move.type,
      pokemonTypes as DefenderTypes
    );
    setResult(effectiveness);
  };

  // モーダルを閉じるときにリセット
  useEffect(() => {
    if (!isOpen) {
      setSelectedMove(null);
      setResult(null);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-t-[1.5rem] p-4 pb-8 animate-slide-up shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-pokemon-blue-800">受けた技をチェック</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-pokemon-blue-100 text-pokemon-blue-600 hover:bg-pokemon-blue-200 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 自分のポケモン情報 */}
        <div className="bg-pokemon-blue-50 rounded-pokemon p-3 mb-4 border border-pokemon-blue-200">
          <div className="text-sm text-pokemon-blue-600 mb-1">自分のポケモン</div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-pokemon-blue-800 text-lg">
              {pokemonName}
            </span>
            <div className="flex gap-1">
              {pokemonTypes.map((typeName) => (
                <TypeBadge key={typeName} type={getTypeData(typeName)} size="sm" />
              ))}
            </div>
          </div>
        </div>

        {/* 技検索 */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-pokemon-blue-700 mb-2">
            受けた技を検索
          </h3>
          <MoveSearch
            onSelect={handleMoveSelect}
            placeholder="技名を入力..."
          />
        </div>

        {/* 選択した技 */}
        {selectedMove && (
          <div className="bg-purple-50 rounded-pokemon p-3 mb-4 border border-purple-200">
            <div className="text-sm text-purple-600 mb-1">受けた技</div>
            <div className="flex items-center gap-2">
              <TypeBadge type={getTypeData(selectedMove.type)} size="md" />
              <span className="font-bold text-purple-800 text-lg">
                {selectedMove.japaneseName}
              </span>
            </div>
          </div>
        )}

        {/* 結果表示 */}
        {selectedMove ? (
          <EffectivenessResult result={result} />
        ) : (
          <div className="p-4 bg-gray-50 rounded-pokemon text-center text-gray-500 border border-gray-200">
            技を検索して選択してください
          </div>
        )}
      </div>
    </div>
  );
}
