import { Move, PokemonType } from "@/lib/pokemon/types";
import {
  getPokemonLearnableMoves,
  getMoveWithJapaneseName,
} from "@/lib/pokeapi/client";

// 技選定の設定
const MAX_MOVES_TO_FETCH = 30; // APIコール数を抑えるため
const MOVES_TO_SELECT = 4;

/**
 * ポケモンの技を選定する
 * - タイプ一致技を優先
 * - 異なるタイプの技をバランス良く選ぶ
 */
export async function selectMovesForPokemon(
  pokemonId: number,
  pokemonTypes: PokemonType[]
): Promise<Move[]> {
  // 1. 習得可能技を取得
  const learnableMoveNames = await getPokemonLearnableMoves(pokemonId);

  // 2. ランダムにシャッフルしてサンプリング
  const shuffled = learnableMoveNames.sort(() => Math.random() - 0.5);
  const sampled = shuffled.slice(0, MAX_MOVES_TO_FETCH);

  // 3. 技の詳細を取得
  const moveDetails = await Promise.all(
    sampled.map((name) =>
      getMoveWithJapaneseName(name).catch(() => null)
    )
  );

  // 4. 有効な技のみフィルタ
  const validMoves = moveDetails.filter((m): m is Move => m !== null);

  // 5. バランスを考慮して選定
  const selected = selectBalancedMoves(validMoves, pokemonTypes);

  return selected;
}

/**
 * バランスを考慮して技を選定
 */
function selectBalancedMoves(
  moves: Move[],
  pokemonTypes: PokemonType[]
): Move[] {
  const pokemonTypeNames = pokemonTypes.map((t) => t.name);
  const result: Move[] = [];
  const usedTypes = new Set<string>();

  // 1. タイプ一致技を優先的に1つ選ぶ
  const stabMove = moves.find(
    (m) =>
      pokemonTypeNames.includes(m.type.name) &&
      m.damageClass !== "status"
  );
  if (stabMove) {
    result.push(stabMove);
    usedTypes.add(stabMove.type.name);
  }

  // 2. 残りの技を選ぶ（異なるタイプを優先）
  const remaining = moves.filter((m) => !result.includes(m));

  for (const move of remaining) {
    if (result.length >= MOVES_TO_SELECT) break;

    // 未使用のタイプを優先
    if (!usedTypes.has(move.type.name)) {
      result.push(move);
      usedTypes.add(move.type.name);
    }
  }

  // 3. まだ足りなければ残りから追加
  for (const move of remaining) {
    if (result.length >= MOVES_TO_SELECT) break;
    if (!result.includes(move)) {
      result.push(move);
    }
  }

  return result;
}
