import { generatePokemonNames, generateRandomParty, generateBattleGuide } from "@/lib/openai/client";
import { getPokemonBasic } from "@/lib/pokeapi/client";
import { selectMovesForPokemon } from "./move-selector";
import { Party, PartyPokemon, GenerationRequest } from "./types";

// AIに要求する余分なポケモン数（無効なポケモン名対策）
const BUFFER_COUNT = 3;

/**
 * パーティを生成する
 */
export async function generateParty(
  request: GenerationRequest
): Promise<Party> {
  const { count, mode, battleMode } = request;

  let theme: string;
  let pokemonNames: string[];

  // 余分にポケモンを要求（無効なポケモン名があっても指定数を確保するため）
  const requestCount = Math.min(count + BUFFER_COUNT, 10);

  if (mode === "random") {
    // おまかせモード: AIがテーマとポケモンを同時生成
    const randomResponse = await generateRandomParty(requestCount, battleMode);
    theme = randomResponse.theme;
    pokemonNames = randomResponse.pokemon;
  } else {
    // テーマ指定モード
    if (!request.theme) {
      throw new Error("テーマが指定されていません");
    }
    theme = request.theme;
    const aiResponse = await generatePokemonNames(theme, requestCount, battleMode);
    pokemonNames = aiResponse.pokemon;
  }

  // 2. 各ポケモンの情報を取得し、技を選定
  const members: (PartyPokemon | null)[] = [];

  for (const name of pokemonNames) {
    // 既に必要な数が揃ったら終了
    const validCount = members.filter((m) => m !== null).length;
    if (validCount >= count) {
      break;
    }

    const member = await createPartyPokemon(name);
    members.push(member);
  }

  // 3. 無効なポケモンを除外し、指定数に切り詰め
  const validMembers = members
    .filter((m): m is PartyPokemon => m !== null)
    .slice(0, count);

  if (validMembers.length === 0) {
    throw new Error("有効なポケモンが見つかりませんでした");
  }

  // 指定数に満たない場合はエラー（稀なケース）
  if (validMembers.length < count) {
    console.warn(`Requested ${count} Pokemon but only found ${validMembers.length} valid ones`);
  }

  // バトルガイドを生成
  const partyInfo = {
    theme,
    members: validMembers.map((m) => ({
      name: m.pokemon.name,
      japaneseName: m.pokemon.japaneseName,
      types: m.pokemon.types.map((t) => t.japaneseName),
    })),
  };
  const battleGuide = await generateBattleGuide(partyInfo, battleMode);

  return {
    theme,
    members: validMembers,
    battleMode,
    battleGuide,
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
