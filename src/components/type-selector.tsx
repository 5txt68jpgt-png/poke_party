"use client";

import { PokemonTypeName } from "@/lib/pokemon/types";
import { TYPE_DATA } from "@/data/type-data";

interface TypeSelectorProps {
  selectedTypes: PokemonTypeName[];
  onSelect: (types: PokemonTypeName[]) => void;
  maxSelection?: number;
}

const ALL_TYPES: PokemonTypeName[] = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

export function TypeSelector({
  selectedTypes,
  onSelect,
  maxSelection = 2,
}: TypeSelectorProps) {
  const handleTypeClick = (typeName: PokemonTypeName) => {
    if (selectedTypes.includes(typeName)) {
      // 選択解除
      onSelect(selectedTypes.filter((t) => t !== typeName));
    } else if (selectedTypes.length < maxSelection) {
      // 選択追加
      onSelect([...selectedTypes, typeName]);
    } else if (maxSelection === 1) {
      // 1つだけの場合は置き換え
      onSelect([typeName]);
    } else {
      // 最大数に達している場合は最初のものを除去して追加
      onSelect([...selectedTypes.slice(1), typeName]);
    }
  };

  return (
    <div className="grid grid-cols-6 gap-1">
      {ALL_TYPES.map((typeName) => {
        const typeData = TYPE_DATA[typeName];
        const isSelected = selectedTypes.includes(typeName);

        return (
          <button
            key={typeName}
            onClick={() => handleTypeClick(typeName)}
            className={`
              p-1.5 rounded text-xs font-medium text-white
              transition-all duration-150
              ${isSelected ? "ring-2 ring-offset-1 ring-gray-800 scale-105" : "opacity-70 hover:opacity-100"}
            `}
            style={{ backgroundColor: typeData.color }}
            title={typeData.japaneseName}
          >
            {typeData.japaneseName}
          </button>
        );
      })}
    </div>
  );
}
