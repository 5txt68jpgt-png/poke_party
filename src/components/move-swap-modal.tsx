"use client";

import { useState, useEffect, useMemo } from "react";
import { Move, PokemonTypeName } from "@/lib/pokemon/types";
import { TypeBadge } from "./type-badge";
import { fetchLearnableMoves } from "@/lib/moves/learnable";
import { TYPE_DATA, getTypeData, DAMAGE_CLASS_JAPANESE } from "@/data/type-data";
import type { MoveEntry } from "@/lib/moves/search";

interface MoveSwapModalProps {
  pokemonId: number;
  pokemonName: string;
  currentMove: Move;
  currentMoves: Move[];  // 現在覚えている全ての技
  isOpen: boolean;
  onClose: () => void;
  onSwap: (newMove: Move) => void;
}

const ALL_TYPES: PokemonTypeName[] = [
  "normal", "fire", "water", "electric", "grass", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy"
];

export function MoveSwapModal({
  pokemonId,
  pokemonName,
  currentMove,
  currentMoves,
  isOpen,
  onClose,
  onSwap,
}: MoveSwapModalProps) {
  // 既に覚えている技の名前セット
  const currentMoveNames = new Set(currentMoves.map((m) => m.name));
  const [learnableMoves, setLearnableMoves] = useState<MoveEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<PokemonTypeName | null>(null);

  // 覚える技を取得
  useEffect(() => {
    if (!isOpen) return;

    const loadMoves = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const moves = await fetchLearnableMoves(pokemonId);
        setLearnableMoves(moves);
      } catch {
        setError("技リストの取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    loadMoves();
  }, [isOpen, pokemonId]);

  // モーダルを閉じたときにフィルタをリセット
  useEffect(() => {
    if (!isOpen) {
      setSelectedType(null);
    }
  }, [isOpen]);

  // フィルタリングされた技リスト（既に覚えている技を除外）
  const filteredMoves = useMemo(() => {
    let moves = learnableMoves.filter((m) => !currentMoveNames.has(m.name));
    if (selectedType) {
      moves = moves.filter((m) => m.type === selectedType);
    }
    return moves;
  }, [learnableMoves, selectedType, currentMoveNames]);

  // MoveEntryをMove型に変換
  const convertToMove = (entry: MoveEntry): Move => ({
    id: entry.id,
    name: entry.name,
    japaneseName: entry.japaneseName,
    type: getTypeData(entry.type),
    damageClass: entry.damageClass,
  });

  // 技選択
  const handleSelectMove = (entry: MoveEntry) => {
    const newMove = convertToMove(entry);
    onSwap(newMove);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-t-[1.5rem] p-4 pb-8 animate-slide-up shadow-2xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-pokemon-blue-800">技を入れ替え</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-pokemon-blue-100 text-pokemon-blue-600 hover:bg-pokemon-blue-200 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 現在の技 */}
        <div className="bg-pokemon-blue-50 rounded-pokemon p-3 mb-4 border border-pokemon-blue-200">
          <div className="text-sm text-pokemon-blue-600 mb-1">{pokemonName}の技</div>
          <div className="flex items-center gap-2">
            <TypeBadge type={currentMove.type} size="sm" />
            <span className="font-bold text-pokemon-blue-800">
              {currentMove.japaneseName}
            </span>
            <span className="text-pokemon-blue-500 text-sm">
              → 入れ替え
            </span>
          </div>
        </div>

        {/* タイプフィルタ */}
        <div className="mb-4">
          <div className="text-sm font-medium text-pokemon-blue-700 mb-2">
            タイプでフィルタ
          </div>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setSelectedType(null)}
              className={`px-2 py-1 text-xs rounded-full transition-colors ${
                selectedType === null
                  ? "bg-pokemon-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              すべて
            </button>
            {ALL_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-2 py-1 text-xs rounded-full transition-colors ${
                  selectedType === type
                    ? "text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                style={selectedType === type ? { backgroundColor: TYPE_DATA[type].color } : {}}
              >
                {TYPE_DATA[type].japaneseName}
              </button>
            ))}
          </div>
        </div>

        {/* 技リスト */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pokemon-blue-500"></div>
              <span className="ml-3 text-pokemon-blue-600">技を読み込み中...</span>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 rounded-pokemon text-center">
              <p className="text-red-600 mb-2">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  fetchLearnableMoves(pokemonId).then(setLearnableMoves);
                }}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-pokemon hover:bg-red-200 transition-colors"
              >
                再試行
              </button>
            </div>
          ) : filteredMoves.length === 0 ? (
            <div className="p-4 bg-gray-50 rounded-pokemon text-center text-gray-500">
              該当する技がありません
            </div>
          ) : (
            <ul className="space-y-1">
              {filteredMoves.map((move) => (
                <li key={move.id}>
                  <button
                    onClick={() => handleSelectMove(move)}
                    className="w-full p-3 rounded-pokemon flex items-center gap-2 transition-colors text-left bg-white border border-pokemon-blue-200 hover:bg-pokemon-blue-50"
                  >
                    <TypeBadge type={getTypeData(move.type)} size="sm" />
                    <span className="font-medium text-pokemon-blue-800 flex-1">
                      {move.japaneseName}
                    </span>
                    <span className="text-sm text-gray-500">
                      {move.power !== null ? `威力${move.power}` : "—"}
                    </span>
                    <span className="text-xs text-gray-400 w-12">
                      {DAMAGE_CLASS_JAPANESE[move.damageClass]}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 件数表示 */}
        {!isLoading && !error && (
          <div className="mt-2 text-xs text-gray-500 text-center">
            {selectedType ? `${filteredMoves.length}件` : `全${learnableMoves.length}件`}
          </div>
        )}
      </div>
    </div>
  );
}
