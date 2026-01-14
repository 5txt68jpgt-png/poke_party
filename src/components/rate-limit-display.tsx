"use client";

import { useState, useEffect } from "react";

interface RateLimitDisplayProps {
  initialSeconds: number;
  onRetry: () => void;
}

export function RateLimitDisplay({ initialSeconds, onRetry }: RateLimitDisplayProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
  const [canRetry, setCanRetry] = useState(false);

  useEffect(() => {
    if (remainingSeconds <= 0) {
      setCanRetry(true);
      return;
    }

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setCanRetry(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingSeconds]);

  // 時間をフォーマット
  const formatTime = (seconds: number): string => {
    if (seconds <= 0) return "0秒";
    if (seconds < 60) return `${seconds}秒`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${minutes}分${secs}秒` : `${minutes}分`;
  };

  return (
    <div className="p-6 bg-amber-50 border-2 border-amber-300 rounded-pokemon text-center">
      <div className="text-4xl mb-3">⏳</div>
      <h3 className="text-lg font-bold text-amber-800 mb-2">
        APIの利用制限に達しました
      </h3>
      <p className="text-amber-700 mb-4">
        無料枠の上限に達したため、少し時間をおいてからお試しください。
      </p>

      {!canRetry ? (
        <div className="bg-white rounded-pokemon p-4 mb-4 border border-amber-200">
          <p className="text-sm text-amber-600 mb-1">あと</p>
          <p className="text-3xl font-bold text-amber-800">
            {formatTime(remainingSeconds)}
          </p>
          <p className="text-sm text-amber-600 mt-1">お待ちください</p>
        </div>
      ) : (
        <div className="bg-green-50 rounded-pokemon p-4 mb-4 border border-green-200">
          <p className="text-green-700 font-medium">
            再試行できるようになりました！
          </p>
        </div>
      )}

      <button
        onClick={onRetry}
        disabled={!canRetry}
        className={`w-full py-3 min-h-[44px] rounded-pokemon font-bold transition-colors ${
          canRetry
            ? "bg-pokemon-blue-500 text-white hover:bg-pokemon-blue-600"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        {canRetry ? "🔄 再試行" : "待機中..."}
      </button>
    </div>
  );
}
