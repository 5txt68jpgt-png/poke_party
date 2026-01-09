import { Move } from "@/lib/pokemon/types";
import { TypeBadge } from "./type-badge";

interface MoveListProps {
  moves: Move[];
}

export function MoveList({ moves }: MoveListProps) {
  if (moves.length === 0) {
    return (
      <p className="text-gray-500 text-sm">技が設定されていません</p>
    );
  }

  return (
    <ul className="space-y-2">
      {moves.map((move) => (
        <li
          key={move.id}
          className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
        >
          <TypeBadge type={move.type} size="sm" />
          <span className="font-medium text-gray-800">
            {move.japaneseName}
          </span>
        </li>
      ))}
    </ul>
  );
}
