"use client";

import { useState } from "react";
import Image from "next/image";
import { Party, PartyPokemon } from "@/lib/party/types";
import { TypeBadge } from "./type-badge";
import { MoveList } from "./move-list";
import { ReceivedMoveModal } from "./received-move-modal";
import type { PokemonEntry } from "@/lib/pokemon/search";
import type { PokemonTypeName, Move } from "@/lib/pokemon/types";

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
  const [opponentPokemon, setOpponentPokemon] = useState<PokemonEntry | null>(null);
  const [partyMembers, setPartyMembers] = useState<PartyPokemon[]>(party.members);
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);
  const selectedMember = partyMembers[selectedIndex];

  // パーティが変わったら状態をリセット
  if (party.members !== partyMembers && party.theme !== partyMembers[0]?.pokemon.name) {
    // 新しいパーティが生成された場合のみリセット
    if (party.members.length > 0 && party.members[0].pokemon.id !== partyMembers[0]?.pokemon.id) {
      setPartyMembers(party.members);
      setSelectedIndex(0);
    }
  }

  // 技入れ替えハンドラ
  const handleMoveSwap = (pokemonIndex: number, moveIndex: number, newMove: Move) => {
    setPartyMembers((prev) => {
      const updated = [...prev];
      const updatedMoves = [...updated[pokemonIndex].selectedMoves];
      updatedMoves[moveIndex] = newMove;
      updated[pokemonIndex] = {
        ...updated[pokemonIndex],
        selectedMoves: updatedMoves,
      };
      return updated;
    });
  };

  return (
    <div className="space-y-4">
      {/* テーマ表示 */}
      <div className="text-center bg-pokemon-blue-50 rounded-pokemon p-3">
        <span className="text-sm text-pokemon-blue-500">テーマ</span>
        <p className="font-bold text-pokemon-blue-800">{party.theme}</p>
      </div>

      {/* ポケモン選択タブ */}
      <div className="flex justify-center gap-2 flex-wrap">
        {partyMembers.map((member, index) => (
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
        <PokemonDetail
          member={selectedMember}
          memberIndex={selectedIndex}
          opponentPokemon={opponentPokemon}
          onOpponentChange={setOpponentPokemon}
          onMoveSwap={handleMoveSwap}
        />
      )}

      {/* 再生成ボタン */}
      {!showRegenerateConfirm ? (
        <button
          onClick={() => setShowRegenerateConfirm(true)}
          disabled={isLoading}
          className="w-full py-3 min-h-[44px] bg-pokemon-blue-100 text-pokemon-blue-700 rounded-pokemon font-bold hover:bg-pokemon-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-2 border-pokemon-blue-300"
        >
          {isLoading ? "生成中..." : "🔄 再生成"}
        </button>
      ) : (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-pokemon p-4">
          <p className="text-amber-800 text-center font-medium mb-3">
            現在のパーティを破棄して再生成しますか？
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowRegenerateConfirm(false)}
              className="flex-1 py-2 min-h-[44px] bg-gray-200 text-gray-700 rounded-pokemon font-bold hover:bg-gray-300 transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={() => {
                setShowRegenerateConfirm(false);
                onRegenerate();
              }}
              className="flex-1 py-2 min-h-[44px] bg-red-500 text-white rounded-pokemon font-bold hover:bg-red-600 transition-colors"
            >
              再生成する
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface PokemonDetailProps {
  member: PartyPokemon;
  memberIndex: number;
  opponentPokemon: PokemonEntry | null;
  onOpponentChange: (pokemon: PokemonEntry | null) => void;
  onMoveSwap: (pokemonIndex: number, moveIndex: number, newMove: Move) => void;
}

function PokemonDetail({ member, memberIndex, opponentPokemon, onOpponentChange, onMoveSwap }: PokemonDetailProps) {
  const [isReceivedMoveModalOpen, setIsReceivedMoveModalOpen] = useState(false);
  const pokemonTypes: PokemonTypeName[] = member.pokemon.types.map((t) => t.name);

  const handleMoveSwap = (moveIndex: number, newMove: Move) => {
    onMoveSwap(memberIndex, moveIndex, newMove);
  };

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
          <MoveList
            moves={member.selectedMoves}
            opponentPokemon={opponentPokemon}
            onOpponentChange={onOpponentChange}
            pokemonId={member.pokemon.id}
            pokemonName={member.pokemon.japaneseName}
            onMoveSwap={handleMoveSwap}
          />
        </div>

        {/* 受けた技をチェックボタン */}
        <div className="border-t-2 border-pokemon-blue-100 pt-4 mt-4">
          <button
            onClick={() => setIsReceivedMoveModalOpen(true)}
            className="w-full py-3 min-h-[44px] bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-pokemon font-bold hover:from-purple-600 hover:to-pink-600 transition-colors shadow-md"
          >
            受けた技をチェック
          </button>
        </div>
      </div>

      {/* 受けた技モーダル */}
      <ReceivedMoveModal
        pokemonName={member.pokemon.japaneseName}
        pokemonTypes={pokemonTypes}
        isOpen={isReceivedMoveModalOpen}
        onClose={() => setIsReceivedMoveModalOpen(false)}
      />
    </div>
  );
}
