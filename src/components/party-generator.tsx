"use client";

import { useState } from "react";
import { PokemonCountSelect } from "./pokemon-count-select";
import { PartyDisplay } from "./party-display";
import { LoadingSpinner } from "./loading-spinner";
import { ThemeSuggestions } from "./theme-suggestions";
import { GenerationState, GeneratePartyResponse } from "@/lib/party/types";

export function PartyGenerator() {
  const [theme, setTheme] = useState("");
  const [count, setCount] = useState(3);
  const [state, setState] = useState<GenerationState>({ status: "idle" });

  const handleGenerate = async () => {
    if (!theme.trim()) {
      setState({
        status: "error",
        message: "テーマを入力してください",
      });
      return;
    }

    setState({ status: "loading" });

    try {
      const response = await fetch("/api/generate-party", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: theme.trim(), count }),
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
    handleGenerate();
  };

  return (
    <div className="space-y-6">
      {/* 入力フォーム */}
      <div className="space-y-4">
        <div>
          <label
            htmlFor="theme"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            テーマを入力
          </label>
          <input
            id="theme"
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="例：かわいいポケモン"
            className="w-full px-4 py-3 min-h-[44px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            disabled={state.status === "loading"}
          />
          <div className="mt-2">
            <ThemeSuggestions
              onSelect={setTheme}
              disabled={state.status === "loading"}
            />
          </div>
        </div>

        <PokemonCountSelect value={count} onChange={setCount} />

        <button
          onClick={handleGenerate}
          disabled={state.status === "loading"}
          className="w-full py-3 min-h-[44px] bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {state.status === "loading" ? "生成中..." : "パーティ生成"}
        </button>
      </div>

      {/* 結果表示 */}
      {state.status === "loading" && <LoadingSpinner />}

      {state.status === "error" && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{state.message}</p>
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
