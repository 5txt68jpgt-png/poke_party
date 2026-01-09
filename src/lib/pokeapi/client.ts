import {
  PokeAPIPokemon,
  PokeAPISpecies,
  PokeAPIMove,
} from "./types";
import { Pokemon, Move, DamageClass } from "@/lib/pokemon/types";
import { getTypeData } from "@/data/type-data";

const BASE_URL = "https://pokeapi.co/api/v2";

// エラークラス
export class PokeApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = "PokeApiError";
  }
}

// 基本的なfetch関数
async function fetchFromPokeApi<T>(endpoint: string): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    next: { revalidate: 86400 }, // 24時間キャッシュ
  });

  if (!response.ok) {
    throw new PokeApiError(
      `PokeAPI request failed: ${endpoint}`,
      response.status
    );
  }

  return response.json();
}

// ポケモン基本情報を取得
export async function fetchPokemon(
  idOrName: number | string
): Promise<PokeAPIPokemon> {
  return fetchFromPokeApi<PokeAPIPokemon>(`/pokemon/${idOrName}`);
}

// ポケモン種族情報を取得（日本語名用）
export async function fetchPokemonSpecies(
  id: number
): Promise<PokeAPISpecies> {
  return fetchFromPokeApi<PokeAPISpecies>(`/pokemon-species/${id}`);
}

// 技情報を取得
export async function fetchMove(
  idOrName: number | string
): Promise<PokeAPIMove> {
  return fetchFromPokeApi<PokeAPIMove>(`/move/${idOrName}`);
}

// 日本語名を取得するヘルパー
function getJapaneseName(
  names: { name: string; language: { name: string } }[]
): string {
  const jaName = names.find((n) => n.language.name === "ja");
  return jaName?.name ?? "";
}

// 日本語フレーバーテキストを取得するヘルパー
function getJapaneseFlavorText(
  entries: { flavor_text: string; language: { name: string } }[]
): string {
  const jaEntry = entries.find((e) => e.language.name === "ja");
  // 改行や特殊文字を整理
  return jaEntry?.flavor_text?.replace(/\n/g, " ").replace(/\s+/g, " ") ?? "";
}

// 技情報を取得（日本語名込み）
export async function getMoveWithJapaneseName(
  idOrName: number | string
): Promise<Move> {
  const moveData = await fetchMove(idOrName);

  return {
    id: moveData.id,
    name: moveData.name,
    japaneseName: getJapaneseName(moveData.names),
    type: getTypeData(moveData.type.name),
    damageClass: moveData.damage_class.name as DamageClass,
    description: getJapaneseFlavorText(moveData.flavor_text_entries),
  };
}

// ポケモン情報を取得（日本語名込み、技なし）
export async function getPokemonBasic(
  idOrName: number | string
): Promise<Omit<Pokemon, "moves">> {
  const [pokemonData, speciesData] = await Promise.all([
    fetchPokemon(idOrName),
    fetchPokemonSpecies(
      typeof idOrName === "number"
        ? idOrName
        : parseInt(idOrName) || 0
    ).catch(() => null),
  ]);

  // speciesDataが取れなかった場合はpokemonDataのIDで再取得
  const species =
    speciesData ?? (await fetchPokemonSpecies(pokemonData.id));

  return {
    id: pokemonData.id,
    name: pokemonData.name,
    japaneseName: getJapaneseName(species.names),
    types: pokemonData.types.map((t) => getTypeData(t.type.name)),
    sprite:
      pokemonData.sprites.other?.["official-artwork"]?.front_default ??
      pokemonData.sprites.front_default ??
      "",
  };
}

// ポケモンの習得可能技リストを取得
export async function getPokemonLearnableMoves(
  idOrName: number | string
): Promise<string[]> {
  const pokemonData = await fetchPokemon(idOrName);
  return pokemonData.moves.map((m) => m.move.name);
}

// ポケモン情報を取得（指定された技込み）
export async function getPokemonWithMoves(
  idOrName: number | string,
  moveNames: string[]
): Promise<Pokemon> {
  const [pokemonBasic, moves] = await Promise.all([
    getPokemonBasic(idOrName),
    Promise.all(moveNames.map((name) => getMoveWithJapaneseName(name))),
  ]);

  return {
    ...pokemonBasic,
    moves,
  };
}

// デモ用: ランダムに4つの技を選んでポケモンを取得
export async function getPokemonWithRandomMoves(
  idOrName: number | string
): Promise<Pokemon> {
  const [pokemonBasic, learnableMoves] = await Promise.all([
    getPokemonBasic(idOrName),
    getPokemonLearnableMoves(idOrName),
  ]);

  // ランダムに4つ選ぶ
  const shuffled = learnableMoves.sort(() => Math.random() - 0.5);
  const selectedMoveNames = shuffled.slice(0, 4);

  const moves = await Promise.all(
    selectedMoveNames.map((name) => getMoveWithJapaneseName(name))
  );

  return {
    ...pokemonBasic,
    moves,
  };
}
