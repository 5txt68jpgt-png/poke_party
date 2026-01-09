# Unit 4 論理設計 - UI/UX改善 & 仕上げ

## 変更対象ファイル

```
src/
├── components/
│   ├── party-generator.tsx    # テーマ入力改善
│   ├── theme-suggestions.tsx  # 新規: おすすめテーマ
│   ├── party-display.tsx      # タブUI改善
│   └── pokemon-card.tsx       # 画像最適化
└── app/
    └── page.tsx               # レイアウト微調整
```

---

## コンポーネント設計

### ThemeSuggestions（新規）

おすすめテーマをボタンで表示するコンポーネント。

```typescript
interface ThemeSuggestionsProps {
  onSelect: (theme: string) => void;
}

const SUGGESTED_THEMES = [
  "かわいいポケモン",
  "かっこいいポケモン",
  "第一世代",
  "ほのおタイプ",
  "みずタイプ",
  "でんきタイプ",
  "ドラゴンタイプ",
  "伝説のポケモン",
];
```

**UI仕様**:
- 横スクロール可能なボタン列
- タップでテーマ入力欄に反映
- コンパクトなチップスタイル

### party-generator.tsx 変更

**変更点**:
- プレースホルダーを「例：かわいいポケモン」に変更
- ThemeSuggestionsコンポーネントを追加
- テーマ選択時の状態更新

```typescript
// プレースホルダー変更
placeholder="例：かわいいポケモン"

// おすすめテーマ選択ハンドラ
const handleThemeSelect = (theme: string) => {
  setTheme(theme);
};
```

### party-display.tsx 変更

**タブUI改善**:
- アクティブタブの背景色を強調
- ポケモンのスプライト画像をタブに追加
- タブサイズを44px以上に確保（タップターゲット）

```typescript
// タブ表示改善
<button
  className={`
    flex items-center gap-1 px-3 py-2 rounded-lg
    ${isActive ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"}
  `}
>
  <img src={pokemon.sprite} alt="" className="w-6 h-6" />
  <span className="text-sm font-medium">{pokemon.japaneseName}</span>
</button>
```

### pokemon-card.tsx 変更

**画像最適化**:
- next/imageのImageコンポーネント使用
- width/height指定でCLS防止
- priority属性で最初のポケモン画像を優先ロード

```typescript
import Image from "next/image";

<Image
  src={pokemon.sprite}
  alt={pokemon.japaneseName}
  width={96}
  height={96}
  priority={isFirst}
  unoptimized // PokeAPIの外部画像のため
/>
```

---

## Bolt タスク対応

| Bolt | タスク | 実装内容 |
|------|--------|----------|
| 4-1 | テーマ例 | ThemeSuggestions, プレースホルダー改善 |
| 4-2 | ポケモン切り替え | party-display.tsx タブUI改善 |
| 4-3 | 視認性改善 | タブ・ボタンのスタイル調整 |
| 4-4 | パフォーマンス | Image最適化, React.memo検討 |
| 4-5 | テスト | Lighthouse確認、実機テスト |
| 4-6 | バグ修正 | 発見された問題の対応 |

---

## パフォーマンス目標

- Lighthouse Performance: 80以上
- First Contentful Paint: 2秒以内
- Cumulative Layout Shift: 0.1以下
