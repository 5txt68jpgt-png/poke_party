# Unit 3 論理設計 - バトル補助（相性判定）

## ディレクトリ構成

```
src/
├── data/
│   └── type-chart.ts          # 18x18相性表データ
├── lib/
│   └── effectiveness/
│       ├── types.ts            # 相性計算の型定義
│       └── calculator.ts       # 相性計算ロジック
└── components/
    ├── move-effectiveness-modal.tsx  # 相性チェックモーダル
    ├── type-selector.tsx             # タイプ選択UI
    └── effectiveness-result.tsx      # 結果表示コンポーネント
```

---

## データ設計

### type-chart.ts

18タイプ × 18タイプの相性表を定義。

```typescript
import { PokemonTypeName } from "@/lib/pokemon/types";

// 攻撃タイプ → 防御タイプ → 倍率
export const TYPE_CHART: Record<PokemonTypeName, Partial<Record<PokemonTypeName, number>>> = {
  normal: {
    rock: 0.5,
    ghost: 0,
    steel: 0.5,
  },
  fire: {
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 2,
    bug: 2,
    rock: 0.5,
    dragon: 0.5,
    steel: 2,
  },
  // ... 他のタイプも同様
};
```

**設計ポイント**:
- 1倍（通常）のエントリは省略してデータサイズを削減
- 存在しないキーは1倍として扱う

---

## 型定義

### lib/effectiveness/types.ts

```typescript
import { PokemonTypeName } from "@/lib/pokemon/types";

// 相性倍率
export type EffectivenessMultiplier = 0 | 0.25 | 0.5 | 1 | 2 | 4;

// 相性結果の種類
export type EffectivenessCategory = "immune" | "not_very" | "normal" | "super";

// 相性計算結果
export interface EffectivenessResult {
  multiplier: EffectivenessMultiplier;
  category: EffectivenessCategory;
  message: string;
}

// 防御側タイプ（1つまたは2つ）
export type DefenderTypes = [PokemonTypeName] | [PokemonTypeName, PokemonTypeName];
```

---

## 関数設計

### lib/effectiveness/calculator.ts

```typescript
// 単一タイプへの倍率を取得
function getSingleTypeMultiplier(
  attackType: PokemonTypeName,
  defenseType: PokemonTypeName
): number;

// 複合タイプ対応の相性計算
function calculateEffectiveness(
  attackType: PokemonTypeName,
  defenderTypes: DefenderTypes
): EffectivenessResult;

// 倍率からカテゴリを判定
function getCategory(multiplier: number): EffectivenessCategory;

// カテゴリからメッセージを取得
function getMessage(category: EffectivenessCategory, multiplier: number): string;
```

**アルゴリズム**:
1. 攻撃タイプと各防御タイプの倍率を取得
2. 複数の防御タイプがある場合は乗算
3. 倍率に基づいてカテゴリを判定
4. メッセージを生成

---

## コンポーネント設計

### MoveEffectivenessModal

技タップ時に開くモーダル。相性チェック機能を提供。

```typescript
interface MoveEffectivenessModalProps {
  move: Move;
  isOpen: boolean;
  onClose: () => void;
}
```

**構成**:
- ヘッダー: 技名、タイプバッジ、分類
- 相手タイプセレクター
- 結果表示エリア

### TypeSelector

18タイプから1〜2個を選択するUI。

```typescript
interface TypeSelectorProps {
  selectedTypes: PokemonTypeName[];
  onSelect: (types: PokemonTypeName[]) => void;
  maxSelection?: number;  // デフォルト: 2
}
```

**UI仕様**:
- 18タイプをグリッド表示（6列×3行）
- タップでトグル選択
- 2つまで選択可能
- 選択されたタイプは視覚的に強調

### EffectivenessResult

相性計算結果を表示するコンポーネント。

```typescript
interface EffectivenessResultProps {
  result: EffectivenessResult | null;
}
```

**UI仕様**:
- 倍率を大きく表示（×0, ×0.25, ×0.5, ×1, ×2, ×4）
- メッセージを表示
- カテゴリに応じた背景色
  - immune: グレー (#9CA3AF)
  - not_very: オレンジ (#F97316)
  - normal: グレー系 (#6B7280)
  - super: 緑 (#22C55E)

---

## 状態管理

### MoveEffectivenessModal の状態

```typescript
const [selectedTypes, setSelectedTypes] = useState<PokemonTypeName[]>([]);
const [result, setResult] = useState<EffectivenessResult | null>(null);

// タイプ選択時に自動で結果を計算
useEffect(() => {
  if (selectedTypes.length > 0) {
    const newResult = calculateEffectiveness(move.type.name, selectedTypes as DefenderTypes);
    setResult(newResult);
  } else {
    setResult(null);
  }
}, [selectedTypes, move.type.name]);
```

---

## 既存コンポーネントの変更

### move-list.tsx

技リストに相性チェック機能を追加。

**変更点**:
- 各技をタップ可能に（onClick追加）
- MoveEffectivenessModalを統合
- 変化技（status）は相性チェック不可のマーク表示

```typescript
// 修正イメージ
<button onClick={() => onMoveClick(move)} className="...">
  {move.japaneseName}
  {move.damageClass === "status" && <span className="text-xs">（変化）</span>}
</button>
```

---

## テスト観点

### 相性計算のテストケース

| 攻撃タイプ | 防御タイプ | 期待倍率 |
|-----------|-----------|---------|
| ほのお | くさ | 2 |
| でんき | みず/ひこう | 4 |
| かくとう | あく/ゴースト | 0 |
| こおり | じめん/いわ | 4 |
| ノーマル | いわ/ゴースト | 0 |
| ドラゴン | フェアリー | 0 |
| でんき | くさ/ドラゴン | 0.25 |

---

## Bolt タスク対応

| Bolt | タスク | 実装ファイル |
|------|--------|--------------|
| 3-1 | 相性データ | `src/data/type-chart.ts` |
| 3-2 | 相性計算 | `src/lib/effectiveness/calculator.ts` |
| 3-3 | 相性UI | `src/components/type-selector.tsx`, `move-effectiveness-modal.tsx` |
| 3-4 | 結果表示 | `src/components/effectiveness-result.tsx` |
| 3-5 | 技詳細 | `move-effectiveness-modal.tsx` 内で対応 |
