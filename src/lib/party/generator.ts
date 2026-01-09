import { generatePokemonNames } from "@/lib/openai/client";
import { getPokemonBasic } from "@/lib/pokeapi/client";
import { selectMovesForPokemon } from "./move-selector";
import { Party, PartyPokemon, GenerationRequest } from "./types";

/**
 * パーティを生成する
 */
export async function generateParty(
  request: GenerationRequest
): Promise<Party> {
  const { theme, count } = request;

  // 1. AIにポケモン名を生成してもらう
  const aiResponse = await generatePokemonNames(theme, count);

  // 2. 各ポケモンの情報を取得し、技を選定
  const members = await Promise.all(
    aiResponse.pokemon.map((name) => createPartyPokemon(name))
  );

  // 3. 無効なポケモンを除外（存在しないポケモンがあった場合）
  const validMembers = members.filter(
    (m): m is PartyPokemon => m !== null
  );

  if (validMembers.length === 0) {
    throw new Error("有効なポケモンが見つかりませんでした");
  }

  return {
    theme,
    members: validMembers,
  };
}

/**
 * パーティ用ポケモンを作成
 */
async function createPartyPokemon(
  pokemonName: string
): Promise<PartyPokemon | null> {
  try {
    // ポケモン基本情報を取得
    const pokemon = await getPokemonBasic(pokemonName);

    // 技を選定
    const selectedMoves = await selectMovesForPokemon(
      pokemon.id,
      pokemon.types
    );

    return {
      pokemon,
      selectedMoves,
    };
  } catch (error) {
    console.error(`Failed to fetch pokemon: ${pokemonName}`, error);
    return null;
  }
}
