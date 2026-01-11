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
      <div className="text-center bg-pokemon-blue-50 rounded-pokemon p-3">
        <span className="text-sm text-pokemon-blue-500">テーマ</span>
        <p className="font-bold text-pokemon-blue-800">{party.theme}</p>
      </div>

      {/* ポケモン選択タブ */}
      <div className="flex justify-center gap-2 flex-wrap">
        {party.members.map((member, index) => (
          <button
            key={member.pokemon.id}
            onClick={() => setSelectedIndex(index)}
            className={`flex flex-col items-center p-2 rounded-pokemon min-w-[70px] min-h-[70px] transition-all border-2 ${
              selectedIndex === index
                ? "bg-pokemon-blue-100 border-pokemon-blue-500 shadow-md"
                : "bg-white border-pokemon-blue-200 hover:bg-pokemon-blue-50"
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
            <span className="text-xs text-pokemon-blue-700 truncate max-w-[60px] font-medium">
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
        className="w-full py-3 min-h-[44px] bg-pokemon-blue-100 text-pokemon-blue-700 rounded-pokemon font-bold hover:bg-pokemon-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-2 border-pokemon-blue-300"
      >
        {isLoading ? "生成中..." : "🔄 再生成"}
      </button>
    </div>
  );
}

function PokemonDetail({ member }: { member: PartyPokemon }) {
  return (
    <div className="bg-white rounded-pokemon shadow-pokemon-card overflow-hidden border-2 border-pokemon-blue-200">
      {/* ポケモン画像 */}
      <div className="bg-gradient-to-b from-pokemon-blue-100 to-pokemon-blue-200 p-4 flex justify-center relative">
        <div className="absolute inset-0 bg-card-shine" />
        {member.pokemon.sprite ? (
          <Image
            src={member.pokemon.sprite}
            alt={member.pokemon.japaneseName}
            width={140}
            height={140}
            className="drop-shadow-lg relative z-10"
            unoptimized
          />
        ) : (
          <div className="w-36 h-36 bg-pokemon-blue-300 rounded-full flex items-center justify-center relative z-10">
            <span className="text-pokemon-blue-600">No Image</span>
          </div>
        )}
      </div>

      {/* ポケモン情報 */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-center text-pokemon-blue-800 mb-2">
          {member.pokemon.japaneseName}
        </h2>

        <div className="flex justify-center gap-2 mb-4">
          {member.pokemon.types.map((type) => (
            <TypeBadge key={type.name} type={type} />
          ))}
        </div>

        <div className="border-t-2 border-pokemon-blue-100 pt-4">
          <h3 className="text-sm font-medium text-pokemon-blue-600 mb-2">わざ</h3>
          <MoveList moves={member.selectedMoves} />
        </div>
      </div>
    </div>
  );
}
