"use client";

interface ThemeSuggestionsProps {
  onSelect: (theme: string) => void;
  disabled?: boolean;
}

const SUGGESTED_THEMES = [
  "かわいいポケモン",
  "かっこいいポケモン",
  "第一世代",
  "ほのおタイプ",
  "みずタイプ",
  "でんきタイプ",
  "くさタイプ",
  "ドラゴンタイプ",
  "伝説のポケモン",
  "しんかするポケモン",
];

export function ThemeSuggestions({ onSelect, disabled }: ThemeSuggestionsProps) {
  return (
    <div className="overflow-x-auto pb-2 -mx-4 px-4">
      <div className="flex gap-2 min-w-max">
        {SUGGESTED_THEMES.map((theme) => (
          <button
            key={theme}
            onClick={() => onSelect(theme)}
            disabled={disabled}
            className="px-3 py-1.5 bg-pokemon-blue-100 text-pokemon-blue-700 text-sm rounded-full hover:bg-pokemon-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap border border-pokemon-blue-200"
          >
            {theme}
          </button>
        ))}
      </div>
    </div>
  );
}
