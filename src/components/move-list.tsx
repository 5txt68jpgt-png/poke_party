"use client";

import { useState } from "react";
import { Move } from "@/lib/pokemon/types";
import { TypeBadge } from "./type-badge";
import { MoveEffectivenessModal } from "./move-effectiveness-modal";
import { MoveSwapModal } from "./move-swap-modal";
import { DAMAGE_CLASS_JAPANESE } from "@/data/type-data";
import { isAllyHittingMove, canHitAlly } from "@/data/ally-hitting-moves";
import type { PokemonEntry } from "@/lib/pokemon/search";

interface MoveListProps {
  moves: Move[];
  opponentPokemon?: PokemonEntry | null;
  onOpponentChange?: (pokemon: PokemonEntry | null) => void;
  pokemonId?: number;
  pokemonName?: string;
  onMoveSwap?: (moveIndex: number, newMove: Move) => void;
  isDoubleMode?: boolean;
}

export function MoveList({
  moves,
  opponentPokemon,
  onOpponentChange,
  pokemonId,
  pokemonName,
  onMoveSwap,
  isDoubleMode,
}: MoveListProps) {
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);
  const [selectedMoveIndex, setSelectedMoveIndex] = useState<number>(-1);
  const [isEffectivenessModalOpen, setIsEffectivenessModalOpen] = useState(false);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [warningMove, setWarningMove] = useState<{ name: string; note: string } | null>(null);

  const handleMoveClick = (move: Move) => {
    setSelectedMove(move);
    setIsEffectivenessModalOpen(true);
  };

  const handleSwapClick = (move: Move, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMove(move);
    setSelectedMoveIndex(index);
    setIsSwapModalOpen(true);
  };

  const handleSwap = (newMove: Move) => {
    if (onMoveSwap && selectedMoveIndex >= 0) {
      onMoveSwap(selectedMoveIndex, newMove);
    }
  };

  const handleWarningClick = (move: Move, e: React.MouseEvent) => {
    e.stopPropagation();
    const allyMove = isAllyHittingMove(move.name);
    if (allyMove) {
      setWarningMove({ name: allyMove.japaneseName, note: allyMove.note || "味方にも当たる可能性があります" });
    }
  };

  if (moves.length === 0) {
    return (
      <p className="text-gray-500 text-sm">技が設定されていません</p>
    );
  }

  const canSwap = pokemonId && pokemonName && onMoveSwap;

  return (
    <>
      <ul className="space-y-2">
        {moves.map((move, index) => {
          const allyHitting = isDoubleMode && canHitAlly(move.name);
          return (
            <li key={`${move.id}-${index}`}>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleMoveClick(move)}
                  className="flex-1 flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
                >
                  <TypeBadge type={move.type} size="sm" />
                  <span className="font-medium text-gray-800 flex-1">
                    {move.japaneseName}
                  </span>
                  {allyHitting && (
                    <button
                      onClick={(e) => handleWarningClick(move, e)}
                      className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full hover:bg-amber-200 transition-colors"
                      title="味方巻き込み注意"
                    >
                      ⚠️ 注意
                    </button>
                  )}
                  {move.damageClass === "status" && (
                    <span className="text-xs text-gray-500">
                      {DAMAGE_CLASS_JAPANESE.status}
                    </span>
                  )}
                  <span className="text-gray-400 text-sm">▶</span>
                </button>
                {canSwap && (
                  <button
                    onClick={(e) => handleSwapClick(move, index, e)}
                    className="p-2 text-pokemon-blue-500 hover:bg-pokemon-blue-50 rounded-lg transition-colors"
                    title="技を入れ替え"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* 味方巻き込み警告ポップアップ */}
      {warningMove && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setWarningMove(null)}
        >
          <div
            className="bg-white rounded-pokemon p-4 max-w-xs shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">⚠️</span>
              <span className="font-bold text-amber-800">{warningMove.name}</span>
            </div>
            <p className="text-gray-700 text-sm mb-3">{warningMove.note}</p>
            <button
              onClick={() => setWarningMove(null)}
              className="w-full py-2 bg-amber-100 text-amber-800 rounded-pokemon font-bold hover:bg-amber-200 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <MoveEffectivenessModal
        move={selectedMove}
        isOpen={isEffectivenessModalOpen}
        onClose={() => setIsEffectivenessModalOpen(false)}
        opponentPokemon={opponentPokemon}
        onOpponentChange={onOpponentChange}
      />

      {canSwap && selectedMove && (
        <MoveSwapModal
          pokemonId={pokemonId}
          pokemonName={pokemonName}
          currentMove={selectedMove}
          currentMoves={moves}
          isOpen={isSwapModalOpen}
          onClose={() => setIsSwapModalOpen(false)}
          onSwap={handleSwap}
        />
      )}
    </>
  );
}
