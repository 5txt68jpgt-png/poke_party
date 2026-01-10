import { Pokemon, Move } from "@/lib/pokemon/types";

// パーティメンバー
export interface PartyPokemon {
  pokemon: Omit<Pokemon, "moves">;
  selectedMoves: Move[];
}

// パーティ
export interface Party {
  theme: string;
  members: PartyPokemon[];
}

// 生成モード
export type GenerationMode = "theme" | "random";

// 生成リクエスト
export interface GenerationRequest {
  theme?: string;  // おまかせ時はundefined
  count: number;   // 1-6
  mode: GenerationMode;
}

// 生成状態
export type GenerationState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; party: Party }
  | { status: "error"; message: string };

// API レスポンス
export interface GeneratePartyResponse {
  party?: Party;
  error?: {
    code: string;
    message: string;
  };
}
