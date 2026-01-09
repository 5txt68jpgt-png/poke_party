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

// 生成リクエスト
export interface GenerationRequest {
  theme: string;
  count: number; // 1-6
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
