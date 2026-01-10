import pokemonListData from "@/data/pokemon-list.json";
import type { PokemonTypeName } from "./types";

export interface PokemonEntry {
  id: number;
  name: string;
  japaneseName: string;
  types: PokemonTypeName[];
}

// JSONデータを型付け
const pokemonList: PokemonEntry[] = pokemonListData as PokemonEntry[];

/**
 * ポケモン名で検索（日本語・部分一致）
 * @param query 検索クエリ
 * @param limit 最大件数（デフォルト: 8）
 * @returns マッチしたポケモンエントリのリスト
 */
export function searchPokemon(query: string, limit: number = 8): PokemonEntry[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  // 日本語名での部分一致検索
  // 先頭一致を優先してソート
  const matches = pokemonList.filter((p) =>
    p.japaneseName.toLowerCase().includes(normalizedQuery)
  );

  // 先頭一致を優先
  matches.sort((a, b) => {
    const aStartsWith = a.japaneseName.toLowerCase().startsWith(normalizedQuery);
    const bStartsWith = b.japaneseName.toLowerCase().startsWith(normalizedQuery);

    if (aStartsWith && !bStartsWith) return -1;
    if (!aStartsWith && bStartsWith) return 1;

    // 同じ優先度ならID順
    return a.id - b.id;
  });

  return matches.slice(0, limit);
}

/**
 * IDでポケモンを取得
 * @param id ポケモンID
 * @returns ポケモンエントリ（見つからない場合はundefined）
 */
export function getPokemonById(id: number): PokemonEntry | undefined {
  return pokemonList.find((p) => p.id === id);
}

/**
 * 全ポケモン数を取得
 */
export function getTotalPokemonCount(): number {
  return pokemonList.length;
}
