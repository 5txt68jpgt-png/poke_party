"use client";

import { useState } from "react";
import { PokemonCountSelect } from "./pokemon-count-select";
import { PartyDisplay } from "./party-display";
import { LoadingSpinner } from "./loading-spinner";
import { ThemeSuggestions } from "./theme-suggestions";
import { GenerationState, GeneratePartyResponse, GenerationMode } from "@/lib/party/types";

export function PartyGenerator() {
  const [theme, setTheme] = useState("");
  const [count, setCount] = useState(3);
  const [state, setState] = useState<GenerationState>({ status: "idle" });
  const [lastMode, setLastMode] = useState<GenerationMode>("theme");

  const handleGenerate = async (mode: GenerationMode) => {
    if (mode === "theme" && !theme.trim()) {
      setState({
        status: "error",
        message: "テーマを入力してください",
      });
      return;
    }

    setState({ status: "loading" });
    setLastMode(mode);

    try {
      const response = await fetch("/api/generate-party", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: mode === "theme" ? theme.trim() : undefined,
          count,
          mode,
        }),
      });

      const data: GeneratePartyResponse = await response.json();

      if (data.error) {
        setState({ status: "error", message: data.error.message });
        return;
      }

      if (data.party) {
        setState({ status: "success", party: data.party });
      }
    } catch {
      setState({
        status: "error",
        message: "通信エラーが発生しました。再度お試しください。",
      });
    }
  };

  const handleRegenerate = () => {
    handleGenerate(lastMode);
  };

  return (
    <div className="space-y-6">
      {/* 入力フォーム */}
      <div className="space-y-4">
        {/* ポケモン数選択（共通） */}
        <PokemonCountSelect value={count} onChange={setCount} />

        {/* おまかせ生成ボタン */}
        <button
          onClick={() => handleGenerate("random")}
          disabled={state.status === "loading"}
          className="w-full py-4 min-h-[52px] pokemon-button-secondary text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state.status === "loading" && lastMode === "random"
            ? "生成中..."
            : "🎲 おまかせ生成"}
        </button>

        {/* 区切り線 */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-pokemon-blue-300/50" />
          <span className="text-sm text-pokemon-blue-600 font-medium">または</span>
          <div className="flex-1 h-px bg-pokemon-blue-300/50" />
        </div>

        {/* テーマ入力 */}
        <div>
          <label
            htmlFor="theme"
            className="block text-sm font-medium text-pokemon-blue-700 mb-1"
          >
            テーマを入力
          </label>
          <input
            id="theme"
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="例：かわいいポケモン"
            className="w-full px-4 py-3 min-h-[44px] pokemon-input text-gray-800 placeholder:text-gray-400"
            disabled={state.status === "loading"}
          />
          <div className="mt-2">
            <ThemeSuggestions
              onSelect={setTheme}
              disabled={state.status === "loading"}
            />
          </div>
        </div>

        <button
          onClick={() => handleGenerate("theme")}
          disabled={state.status === "loading"}
          className="w-full py-3 min-h-[44px] pokemon-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state.status === "loading" && lastMode === "theme"
            ? "生成中..."
            : "パーティ生成"}
        </button>
      </div>

      {/* 結果表示 */}
      {state.status === "loading" && <LoadingSpinner />}

      {state.status === "error" && (
        <div className="p-4 bg-red-100 border-2 border-red-300 rounded-pokemon">
          <p className="text-red-700 font-medium">{state.message}</p>
        </div>
      )}

      {state.status === "success" && (
        <PartyDisplay
          party={state.party}
          onRegenerate={handleRegenerate}
          isLoading={false}
        />
      )}
    </div>
  );
}
