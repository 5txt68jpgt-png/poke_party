import { getMovesByNames, type MoveEntry } from "./search";

interface PokeAPIPokemonMoves {
  moves: {
    move: {
      name: string;
      url: string;
    };
  }[];
}

// キャッシュ（ポケモンIDごとに覚える技をキャッシュ）
const learnableMoveCache = new Map<number, MoveEntry[]>();

/**
 * ポケモンが覚える技を取得
 * @param pokemonId ポケモンID
 * @returns 覚える技のリスト
 */
export async function fetchLearnableMoves(pokemonId: number): Promise<MoveEntry[]> {
  // キャッシュチェック
  const cached = learnableMoveCache.get(pokemonId);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon: ${response.status}`);
    }

    const data: PokeAPIPokemonMoves = await response.json();

    // 技の英語名リストを取得
    const moveNames = data.moves.map((m) => m.move.name);

    // move-list.jsonとマッチングして詳細情報付きで返す
    const moves = getMovesByNames(moveNames);

    // IDでソート
    moves.sort((a, b) => a.id - b.id);

    // キャッシュに保存
    learnableMoveCache.set(pokemonId, moves);

    return moves;
  } catch (error) {
    console.error(`Error fetching learnable moves for Pokemon ${pokemonId}:`, error);
    throw error;
  }
}

/**
 * キャッシュをクリア
 */
export function clearLearnableMoveCache(): void {
  learnableMoveCache.clear();
}
