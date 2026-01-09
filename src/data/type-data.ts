import { PokemonType, PokemonTypeName } from "@/lib/pokemon/types";

// タイプデータ（日本語名・カラー）
export const TYPE_DATA: Record<PokemonTypeName, PokemonType> = {
  normal: {
    name: "normal",
    japaneseName: "ノーマル",
    color: "#A8A878",
  },
  fire: {
    name: "fire",
    japaneseName: "ほのお",
    color: "#F08030",
  },
  water: {
    name: "water",
    japaneseName: "みず",
    color: "#6890F0",
  },
  electric: {
    name: "electric",
    japaneseName: "でんき",
    color: "#F8D030",
  },
  grass: {
    name: "grass",
    japaneseName: "くさ",
    color: "#78C850",
  },
  ice: {
    name: "ice",
    japaneseName: "こおり",
    color: "#98D8D8",
  },
  fighting: {
    name: "fighting",
    japaneseName: "かくとう",
    color: "#C03028",
  },
  poison: {
    name: "poison",
    japaneseName: "どく",
    color: "#A040A0",
  },
  ground: {
    name: "ground",
    japaneseName: "じめん",
    color: "#E0C068",
  },
  flying: {
    name: "flying",
    japaneseName: "ひこう",
    color: "#A890F0",
  },
  psychic: {
    name: "psychic",
    japaneseName: "エスパー",
    color: "#F85888",
  },
  bug: {
    name: "bug",
    japaneseName: "むし",
    color: "#A8B820",
  },
  rock: {
    name: "rock",
    japaneseName: "いわ",
    color: "#B8A038",
  },
  ghost: {
    name: "ghost",
    japaneseName: "ゴースト",
    color: "#705898",
  },
  dragon: {
    name: "dragon",
    japaneseName: "ドラゴン",
    color: "#7038F8",
  },
  dark: {
    name: "dark",
    japaneseName: "あく",
    color: "#705848",
  },
  steel: {
    name: "steel",
    japaneseName: "はがね",
    color: "#B8B8D0",
  },
  fairy: {
    name: "fairy",
    japaneseName: "フェアリー",
    color: "#EE99AC",
  },
};

// タイプ名からタイプデータを取得
export function getTypeData(typeName: string): PokemonType {
  const type = TYPE_DATA[typeName as PokemonTypeName];
  if (!type) {
    // 不明なタイプの場合はノーマルを返す
    return TYPE_DATA.normal;
  }
  return type;
}

// ダメージ分類の日本語名
export const DAMAGE_CLASS_JAPANESE: Record<string, string> = {
  physical: "ぶつり",
  special: "とくしゅ",
  status: "へんか",
};
