import { PokemonTypeName } from "@/lib/pokemon/types";

// 相性倍率
export type EffectivenessMultiplier = 0 | 0.25 | 0.5 | 1 | 2 | 4;

// 相性結果の種類
export type EffectivenessCategory = "immune" | "not_very" | "normal" | "super";

// 相性計算結果
export interface EffectivenessResult {
  multiplier: number;
  category: EffectivenessCategory;
  message: string;
}

// 防御側タイプ（1つまたは2つ）
export type DefenderTypes =
  | [PokemonTypeName]
  | [PokemonTypeName, PokemonTypeName];
