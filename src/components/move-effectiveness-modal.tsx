"use client";

import { useState, useEffect } from "react";
import { Move, PokemonTypeName } from "@/lib/pokemon/types";
import { TypeBadge } from "./type-badge";
import { TypeSelector } from "./type-selector";
import { EffectivenessResult } from "./effectiveness-result";
import { PokemonSearch } from "./pokemon-search";
import { calculateEffectiveness } from "@/lib/effectiveness/calculator";
import { EffectivenessResult as EffectivenessResultType, DefenderTypes } from "@/lib/effectiveness/types";
import { DAMAGE_CLASS_JAPANESE } from "@/data/type-data";
import type { PokemonEntry } from "@/lib/pokemon/search";

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
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonEntry | null>(null);
  const [result, setResult] = useState<EffectivenessResultType | null>(null);

  // ポケモン選択時にタイプを自動設定
  const handlePokemonSelect = (pokemon: PokemonEntry) => {
    setSelectedPokemon(pokemon);
    setSelectedTypes(pokemon.types);
  };

  // タイプ選択時はポケモン選択をクリア
  const handleTypeSelect = (types: PokemonTypeName[]) => {
    setSelectedPokemon(null);
    setSelectedTypes(types);
  };

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
      setSelectedPokemon(null);
      setResult(null);
    }
  }, [isOpen]);

  if (!isOpen || !move) {
    return null;
  }

  const isStatusMove = move.damageClass === "status";

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
          <h2 className="text-lg font-bold text-pokemon-blue-800">技の相性チェック</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-pokemon-blue-100 text-pokemon-blue-600 hover:bg-pokemon-blue-200 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 技の情報 */}
        <div className="bg-pokemon-blue-50 rounded-pokemon p-3 mb-4 border border-pokemon-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <TypeBadge type={move.type} size="md" />
            <span className="font-bold text-pokemon-blue-800 text-lg">
              {move.japaneseName}
            </span>
          </div>
          <div className="text-sm text-pokemon-blue-600">
            分類: {DAMAGE_CLASS_JAPANESE[move.damageClass] || move.damageClass}
          </div>
          {move.description && (
            <div className="text-sm text-pokemon-blue-600 mt-1">{move.description}</div>
          )}
        </div>

        {/* 変化技の場合 */}
        {isStatusMove ? (
          <div className="p-4 bg-pokemon-blue-50 rounded-pokemon text-center text-pokemon-blue-600 border border-pokemon-blue-200">
            変化技はダメージを与えないため
            <br />
            タイプ相性はありません
          </div>
        ) : (
          <>
            {/* ポケモン検索 */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-pokemon-blue-700 mb-2">
                相手のポケモンを検索
              </h3>
              <PokemonSearch
                onSelect={handlePokemonSelect}
                placeholder="ポケモン名を入力..."
              />
              {selectedPokemon && (
                <div className="mt-2 p-2 bg-pokemon-blue-100 rounded-pokemon flex items-center justify-between border border-pokemon-blue-300">
                  <span className="font-medium text-pokemon-blue-800">
                    {selectedPokemon.japaneseName}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedPokemon(null);
                      setSelectedTypes([]);
                    }}
                    className="text-pokemon-blue-600 hover:text-pokemon-blue-800 text-sm font-medium"
                  >
                    クリア
                  </button>
                </div>
              )}
            </div>

            {/* 区切り線 */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-pokemon-blue-200" />
              <span className="text-sm text-pokemon-blue-500 font-medium">または</span>
              <div className="flex-1 h-px bg-pokemon-blue-200" />
            </div>

            {/* 相手タイプ選択 */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-pokemon-blue-700 mb-2">
                タイプを直接選択（最大2つ）
              </h3>
              <TypeSelector
                selectedTypes={selectedTypes}
                onSelect={handleTypeSelect}
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
