interface PokemonCountSelectProps {
  value: number;
  onChange: (count: number) => void;
}

export function PokemonCountSelect({
  value,
  onChange,
}: PokemonCountSelectProps) {
  return (
    <div className="flex items-center gap-3">
      <label htmlFor="pokemon-count" className="text-gray-700 font-medium">
        ポケモン数:
      </label>
      <select
        id="pokemon-count"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="px-4 py-2 min-h-[44px] border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <option key={n} value={n}>
            {n}匹
          </option>
        ))}
      </select>
    </div>
  );
}
