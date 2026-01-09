import Image from "next/image";
import { Pokemon } from "@/lib/pokemon/types";
import { TypeBadge } from "./type-badge";
import { MoveList } from "./move-list";

interface PokemonCardProps {
  pokemon: Pokemon;
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden max-w-sm mx-auto">
      {/* ポケモン画像 */}
      <div className="bg-gradient-to-b from-gray-100 to-gray-200 p-4 flex justify-center">
        {pokemon.sprite ? (
          <Image
            src={pokemon.sprite}
            alt={pokemon.japaneseName}
            width={160}
            height={160}
            className="drop-shadow-lg"
            unoptimized
          />
        ) : (
          <div className="w-40 h-40 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>

      {/* ポケモン情報 */}
      <div className="p-4">
        {/* 名前 */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          {pokemon.japaneseName}
        </h2>

        {/* タイプ */}
        <div className="flex justify-center gap-2 mb-4">
          {pokemon.types.map((type) => (
            <TypeBadge key={type.name} type={type} />
          ))}
        </div>

        {/* 技リスト */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-600 mb-2">わざ</h3>
          <MoveList moves={pokemon.moves} />
        </div>
      </div>
    </div>
  );
}
