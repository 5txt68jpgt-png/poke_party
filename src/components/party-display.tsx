"use client";

import { useState } from "react";
import Image from "next/image";
import { Party, PartyPokemon } from "@/lib/party/types";
import { TypeBadge } from "./type-badge";
import { MoveList } from "./move-list";

interface PartyDisplayProps {
  party: Party;
  onRegenerate: () => void;
  isLoading: boolean;
}

export function PartyDisplay({
  party,
  onRegenerate,
  isLoading,
}: PartyDisplayProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedMember = party.members[selectedIndex];

  return (
    <div className="space-y-4">
      {/* テーマ表示 */}
      <div className="text-center">
        <span className="text-sm text-gray-500">テーマ:</span>
        <p className="font-medium text-gray-800">{party.theme}</p>
      </div>

      {/* ポケモン選択タブ */}
      <div className="flex justify-center gap-2 flex-wrap">
        {party.members.map((member, index) => (
          <button
            key={member.pokemon.id}
            onClick={() => setSelectedIndex(index)}
            className={`flex flex-col items-center p-2 rounded-lg min-w-[70px] min-h-[70px] transition-all ${
              selectedIndex === index
                ? "bg-blue-100 ring-2 ring-blue-500"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {member.pokemon.sprite && (
              <Image
                src={member.pokemon.sprite}
                alt={member.pokemon.japaneseName}
                width={48}
                height={48}
                unoptimized
              />
            )}
            <span className="text-xs text-gray-700 truncate max-w-[60px]">
              {member.pokemon.japaneseName}
            </span>
          </button>
        ))}
      </div>

      {/* 選択中のポケモン詳細 */}
      {selectedMember && (
        <PokemonDetail member={selectedMember} />
      )}

      {/* 再生成ボタン */}
      <button
        onClick={onRegenerate}
        disabled={isLoading}
        className="w-full py-3 min-h-[44px] bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? "生成中..." : "再生成"}
      </button>
    </div>
  );
}

function PokemonDetail({ member }: { member: PartyPokemon }) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      {/* ポケモン画像 */}
      <div className="bg-gradient-to-b from-gray-100 to-gray-200 p-4 flex justify-center">
        {member.pokemon.sprite ? (
          <Image
            src={member.pokemon.sprite}
            alt={member.pokemon.japaneseName}
            width={140}
            height={140}
            className="drop-shadow-lg"
            unoptimized
          />
        ) : (
          <div className="w-36 h-36 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>

      {/* ポケモン情報 */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
          {member.pokemon.japaneseName}
        </h2>

        <div className="flex justify-center gap-2 mb-4">
          {member.pokemon.types.map((type) => (
            <TypeBadge key={type.name} type={type} />
          ))}
        </div>

        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-600 mb-2">わざ</h3>
          <MoveList moves={member.selectedMoves} />
        </div>
      </div>
    </div>
  );
}
