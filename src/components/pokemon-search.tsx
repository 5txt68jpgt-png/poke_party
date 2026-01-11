"use client";

import { useState, useRef, useEffect } from "react";
import { searchPokemon, type PokemonEntry } from "@/lib/pokemon/search";
import { TypeBadge } from "./type-badge";
import { getTypeData } from "@/data/type-data";

interface PokemonSearchProps {
  onSelect: (pokemon: PokemonEntry) => void;
  placeholder?: string;
}

export function PokemonSearch({
  onSelect,
  placeholder = "ポケモン名を入力...",
}: PokemonSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PokemonEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // 検索実行
  useEffect(() => {
    if (query.trim()) {
      const matches = searchPokemon(query, 8);
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

  // ポケモン選択
  const handleSelect = (pokemon: PokemonEntry) => {
    onSelect(pokemon);
    setQuery("");
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  // フォーカス外れたら閉じる
  const handleBlur = () => {
    // 少し遅延させて、候補クリック時のイベントが先に発火するようにする
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
          {results.map((pokemon, index) => (
            <li key={pokemon.id}>
              <button
                type="button"
                onClick={() => handleSelect(pokemon)}
                className={`w-full px-4 py-3 flex items-center justify-between text-left hover:bg-pokemon-blue-50 transition-colors ${
                  index === highlightedIndex ? "bg-pokemon-blue-100" : ""
                } ${index === 0 ? "rounded-t-pokemon" : ""} ${
                  index === results.length - 1 ? "rounded-b-pokemon" : ""
                }`}
              >
                <span className="text-lg font-medium text-pokemon-blue-800">
                  {pokemon.japaneseName}
                </span>
                <div className="flex gap-1">
                  {pokemon.types.map((typeName) => (
                    <TypeBadge
                      key={typeName}
                      type={getTypeData(typeName)}
                      size="sm"
                    />
                  ))}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
