import Image from "next/image";
import { Pokemon } from "@/lib/pokemon/types";
import { TypeBadge } from "./type-badge";
import { MoveList } from "./move-list";

interface PokemonCardProps {
  pokemon: Pokemon;
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <div className="bg-white rounded-pokemon shadow-pokemon-card overflow-hidden max-w-sm mx-auto border-2 border-pokemon-blue-200">
      {/* ポケモン画像 */}
      <div className="bg-gradient-to-b from-pokemon-blue-100 to-pokemon-blue-200 p-4 flex justify-center relative">
        <div className="absolute inset-0 bg-card-shine" />
        {pokemon.sprite ? (
          <Image
            src={pokemon.sprite}
            alt={pokemon.japaneseName}
            width={160}
            height={160}
            className="drop-shadow-lg relative z-10"
            unoptimized
          />
        ) : (
          <div className="w-40 h-40 bg-pokemon-blue-300 rounded-full flex items-center justify-center relative z-10">
            <span className="text-pokemon-blue-600">No Image</span>
          </div>
        )}
      </div>

      {/* ポケモン情報 */}
      <div className="p-4">
        {/* 名前 */}
        <h2 className="text-2xl font-bold text-center text-pokemon-blue-800 mb-2">
          {pokemon.japaneseName}
        </h2>

        {/* タイプ */}
        <div className="flex justify-center gap-2 mb-4">
          {pokemon.types.map((type) => (
            <TypeBadge key={type.name} type={type} />
          ))}
        </div>

        {/* 技リスト */}
        <div className="border-t-2 border-pokemon-blue-100 pt-4">
          <h3 className="text-sm font-medium text-pokemon-blue-600 mb-2">わざ</h3>
          <MoveList moves={pokemon.moves} />
        </div>
      </div>
    </div>
  );
}
