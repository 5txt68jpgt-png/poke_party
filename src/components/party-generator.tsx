"use client";

import { useState, useEffect, useCallback } from "react";
import { PokemonCountSelect } from "./pokemon-count-select";
import { PartyDisplay } from "./party-display";
import { LoadingSpinner } from "./loading-spinner";
import { ThemeSuggestions } from "./theme-suggestions";
import { RateLimitDisplay } from "./rate-limit-display";
import { GenerationState, GeneratePartyResponse, GenerationMode } from "@/lib/party/types";

export function PartyGenerator() {
  const [theme, setTheme] = useState("");
  const [count, setCount] = useState(3);
  const [state, setState] = useState<GenerationState>({ status: "idle" });
  const [lastMode, setLastMode] = useState<GenerationMode>("theme");
  const [pendingMode, setPendingMode] = useState<GenerationMode | null>(null);

  // パーティが存在するかどうか
  const hasParty = state.status === "success";

  // 生成ボタンクリック時のハンドラ
  const handleGenerateClick = (mode: GenerationMode) => {
    if (hasParty) {
      // パーティがある場合は確認ダイアログを表示
      setPendingMode(mode);
    } else {
      // パーティがない場合は直接生成
      handleGenerate(mode);
    }
  };

  // 確認後の生成実行
  const handleConfirmGenerate = () => {
    if (pendingMode) {
      handleGenerate(pendingMode);
      setPendingMode(null);
    }
  };

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
        // レート制限エラーの場合
        if (data.error.code === "RATE_LIMITED" && data.error.retryAfterSeconds) {
          setState({
            status: "rate_limited",
            retryAfterSeconds: data.error.retryAfterSeconds
          });
          return;
        }
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
          onClick={() => handleGenerateClick("random")}
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
          onClick={() => handleGenerateClick("theme")}
          disabled={state.status === "loading"}
          className="w-full py-3 min-h-[44px] pokemon-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state.status === "loading" && lastMode === "theme"
            ? "生成中..."
            : "パーティ生成"}
        </button>
      </div>

      {/* 生成確認ダイアログ */}
      {pendingMode && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-pokemon p-4">
          <p className="text-amber-800 text-center font-medium mb-3">
            現在のパーティを破棄して新しく生成しますか？
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPendingMode(null)}
              className="flex-1 py-2 min-h-[44px] bg-gray-200 text-gray-700 rounded-pokemon font-bold hover:bg-gray-300 transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleConfirmGenerate}
              className="flex-1 py-2 min-h-[44px] bg-red-500 text-white rounded-pokemon font-bold hover:bg-red-600 transition-colors"
            >
              生成する
            </button>
          </div>
        </div>
      )}

      {/* 結果表示 */}
      {state.status === "loading" && <LoadingSpinner />}

      {state.status === "error" && (
        <div className="p-4 bg-red-100 border-2 border-red-300 rounded-pokemon">
          <p className="text-red-700 font-medium">{state.message}</p>
        </div>
      )}

      {state.status === "rate_limited" && (
        <RateLimitDisplay
          initialSeconds={state.retryAfterSeconds}
          onRetry={handleRegenerate}
        />
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
