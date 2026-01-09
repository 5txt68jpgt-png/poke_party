import { PokemonType } from "@/lib/pokemon/types";

interface TypeBadgeProps {
  type: PokemonType;
  size?: "sm" | "md";
}

export function TypeBadge({ type, size = "md" }: TypeBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs min-h-[28px]",
    md: "px-3 py-1 text-sm min-h-[44px] min-w-[44px]",
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-medium text-white ${sizeClasses[size]}`}
      style={{ backgroundColor: type.color }}
    >
      {type.japaneseName}
    </span>
  );
}
