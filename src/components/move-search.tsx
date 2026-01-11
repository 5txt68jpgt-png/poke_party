"use client";

import { useState, useRef, useEffect } from "react";
import { searchMove, type MoveEntry } from "@/lib/moves/search";
import { TypeBadge } from "./type-badge";
import { getTypeData } from "@/data/type-data";

interface MoveSearchProps {
  onSelect: (move: MoveEntry) => void;
  placeholder?: string;
}

export function MoveSearch({
  onSelect,
  placeholder = "技名を入力...",
}: MoveSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MoveEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // 検索実行
  useEffect(() => {
    if (query.trim()) {
      const matches = searchMove(query, 8);
      setResults(matches);
      setIsOpen(matches.length > 0);
      setHighlightedIndex(-1);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  // キーボード操作
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && results[highlightedIndex]) {
          handleSelect(results[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // 技選択
  const handleSelect = (move: MoveEntry) => {
    onSelect(move);
    setQuery("");
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  // フォーカス外れたら閉じる
  const handleBlur = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => results.length > 0 && setIsOpen(true)}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="w-full px-4 py-3 text-lg pokemon-input text-gray-800 placeholder:text-gray-400"
        autoComplete="off"
      />

      {isOpen && results.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-50 w-full mt-1 bg-white border-2 border-pokemon-blue-200 rounded-pokemon shadow-pokemon-card max-h-80 overflow-auto"
        >
          {results.map((move, index) => (
            <li key={move.id}>
              <button
                type="button"
                onClick={() => handleSelect(move)}
                className={`w-full px-4 py-3 flex items-center justify-between text-left hover:bg-pokemon-blue-50 transition-colors ${
                  index === highlightedIndex ? "bg-pokemon-blue-100" : ""
                } ${index === 0 ? "rounded-t-pokemon" : ""} ${
                  index === results.length - 1 ? "rounded-b-pokemon" : ""
                }`}
              >
                <span className="text-lg font-medium text-pokemon-blue-800">
                  {move.japaneseName}
                </span>
                <TypeBadge type={getTypeData(move.type)} size="sm" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
