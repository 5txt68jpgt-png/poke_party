"use client";

import { useState } from "react";
import { Move } from "@/lib/pokemon/types";
import { TypeBadge } from "./type-badge";
import { MoveEffectivenessModal } from "./move-effectiveness-modal";
import { DAMAGE_CLASS_JAPANESE } from "@/data/type-data";

interface MoveListProps {
  moves: Move[];
}

export function MoveList({ moves }: MoveListProps) {
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMoveClick = (move: Move) => {
    setSelectedMove(move);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (moves.length === 0) {
    return (
      <p className="text-gray-500 text-sm">技が設定されていません</p>
    );
  }

  return (
    <>
      <ul className="space-y-2">
        {moves.map((move) => (
          <li key={move.id}>
            <button
              onClick={() => handleMoveClick(move)}
              className="w-full flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
            >
              <TypeBadge type={move.type} size="sm" />
              <span className="font-medium text-gray-800 flex-1">
                {move.japaneseName}
              </span>
              {move.damageClass === "status" && (
                <span className="text-xs text-gray-500">
                  {DAMAGE_CLASS_JAPANESE.status}
                </span>
              )}
              <span className="text-gray-400 text-sm">▶</span>
            </button>
          </li>
        ))}
      </ul>

      <MoveEffectivenessModal
        move={selectedMove}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
