import { getPokemonWithRandomMoves } from "@/lib/pokeapi/client";
import { PokemonCard } from "@/components/pokemon-card";

export default async function Home() {
  // デモ: ピカチュウを取得
  const pokemon = await getPokemonWithRandomMoves("pikachu");

  return (
    <main className="max-w-md mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          PokeParty
        </h1>
        <p className="text-center text-gray-600 text-sm">
          ポケモンバトルごっこ用パーティ生成
        </p>
      </header>

      <PokemonCard pokemon={pokemon} />
    </main>
  );
}
