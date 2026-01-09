import { PokemonTypeName } from "@/lib/pokemon/types";
import { getTypeMultiplier } from "@/data/type-chart";
import {
  EffectivenessCategory,
  EffectivenessResult,
  DefenderTypes,
} from "./types";

// 倍率からカテゴリを判定
function getCategory(multiplier: number): EffectivenessCategory {
  if (multiplier === 0) {
    return "immune";
  } else if (multiplier < 1) {
    return "not_very";
  } else if (multiplier === 1) {
    return "normal";
  } else {
    return "super";
  }
}

// カテゴリと倍率からメッセージを取得
function getMessage(
  category: EffectivenessCategory,
  multiplier: number
): string {
  switch (category) {
    case "immune":
      return "こうかがないようだ...";
    case "not_very":
      return multiplier === 0.25
        ? "こうかはいまひとつだ..."
        : "こうかはいまひとつのようだ";
    case "normal":
      return "ふつうのダメージ";
    case "super":
      return multiplier === 4
        ? "こうかはばつぐんだ！！"
        : "こうかはばつぐんだ！";
  }
}

// 複合タイプ対応の相性計算
export function calculateEffectiveness(
  attackType: PokemonTypeName,
  defenderTypes: DefenderTypes
): EffectivenessResult {
  // 各防御タイプへの倍率を乗算
  let multiplier = 1;
  for (const defenseType of defenderTypes) {
    multiplier *= getTypeMultiplier(attackType, defenseType);
  }

  const category = getCategory(multiplier);
  const message = getMessage(category, multiplier);

  return {
    multiplier,
    category,
    message,
  };
}

// 倍率の表示用フォーマット
export function formatMultiplier(multiplier: number): string {
  if (multiplier === 0) {
    return "×0";
  } else if (multiplier === 0.25) {
    return "×0.25";
  } else if (multiplier === 0.5) {
    return "×0.5";
  } else if (multiplier === 1) {
    return "×1";
  } else if (multiplier === 2) {
    return "×2";
  } else if (multiplier === 4) {
    return "×4";
  }
  return `×${multiplier}`;
}
