import moveListData from "@/data/move-list.json";
import type { PokemonTypeName } from "@/lib/pokemon/types";

export interface MoveEntry {
  id: number;
  name: string;
  japaneseName: string;
  type: PokemonTypeName;
  power: number | null;
  damageClass: "physical" | "special" | "status";
}

// JSONデータを型付け
const moveList: MoveEntry[] = moveListData as MoveEntry[];

/**
 * 半角数字を全角数字に変換
 */
function normalizeNumbers(str: string): string {
  return str.replace(/[0-9]/g, (c) =>
    String.fromCharCode(c.charCodeAt(0) + 0xFEE0)
  );
}

/**
 * 技名で検索（日本語・部分一致）
 * @param query 検索クエリ
 * @param limit 最大件数（デフォルト: 8）
 * @returns マッチした技エントリのリスト
 */
export function searchMove(query: string, limit: number = 8): MoveEntry[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  // 半角数字を全角に変換したバージョンも用意
  const fullWidthQuery = normalizeNumbers(normalizedQuery);

  // 日本語名での部分一致検索
  const matches = moveList.filter((m) => {
    const name = m.japaneseName.toLowerCase();
    return name.includes(normalizedQuery) || name.includes(fullWidthQuery);
  });

  // 先頭一致を優先してソート
  matches.sort((a, b) => {
    const aName = a.japaneseName.toLowerCase();
    const bName = b.japaneseName.toLowerCase();

    const aStartsWith = aName.startsWith(normalizedQuery) || aName.startsWith(fullWidthQuery);
    const bStartsWith = bName.startsWith(normalizedQuery) || bName.startsWith(fullWidthQuery);

    if (aStartsWith && !bStartsWith) return -1;
    if (!aStartsWith && bStartsWith) return 1;

    // 同じ優先度ならID順
    return a.id - b.id;
  });

  return matches.slice(0, limit);
}

/**
 * IDで技を取得
 * @param id 技ID
 * @returns 技エントリ（見つからない場合はundefined）
 */
export function getMoveById(id: number): MoveEntry | undefined {
  return moveList.find((m) => m.id === id);
}

/**
 * 英語名で技を取得
 * @param name 技の英語名
 * @returns 技エントリ（見つからない場合はundefined）
 */
export function getMoveByName(name: string): MoveEntry | undefined {
  return moveList.find((m) => m.name === name);
}

/**
 * 複数の技を英語名で取得
 * @param names 技の英語名の配列
 * @returns 技エントリの配列
 */
export function getMovesByNames(names: string[]): MoveEntry[] {
  const nameSet = new Set(names);
  return moveList.filter((m) => nameSet.has(m.name));
}

/**
 * 全技数を取得
 */
export function getTotalMoveCount(): number {
  return moveList.length;
}

/**
 * 全技リストを取得
 */
export function getAllMoves(): MoveEntry[] {
  return moveList;
}
