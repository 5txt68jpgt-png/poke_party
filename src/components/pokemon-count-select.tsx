interface PokemonCountSelectProps {
  value: number;
  onChange: (count: number) => void;
}

export function PokemonCountSelect({
  value,
  onChange,
}: PokemonCountSelectProps) {
  return (
    <div className="flex items-center justify-between bg-pokemon-blue-50 rounded-pokemon p-3">
      <label htmlFor="pokemon-count" className="text-pokemon-blue-700 font-medium">
        ポケモン数
      </label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`w-10 h-10 rounded-lg font-bold transition-all ${
              value === n
                ? "bg-pokemon-blue-500 text-white shadow-md"
                : "bg-white text-pokemon-blue-600 hover:bg-pokemon-blue-100 border border-pokemon-blue-200"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
