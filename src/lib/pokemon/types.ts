// タイプ名（18種）
export type PokemonTypeName =
  | "normal"
  | "fire"
  | "water"
  | "electric"
  | "grass"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dragon"
  | "dark"
  | "steel"
  | "fairy";

// タイプ
export interface PokemonType {
  name: PokemonTypeName;
  japaneseName: string;
  color: string;
}

// ダメージ分類
export type DamageClass = "physical" | "special" | "status";

// 技
export interface Move {
  id: number;
  name: string;
  japaneseName: string;
  type: PokemonType;
  damageClass: DamageClass;
  description?: string;
}

// ポケモン
export interface Pokemon {
  id: number;
  name: string;
  japaneseName: string;
  types: PokemonType[];
  sprite: string;
  moves: Move[];
}

// パーティ用ポケモン（Unit 2で使用）
export interface PartyPokemon {
  pokemon: Pokemon;
  selectedMoves: Move[];
}
