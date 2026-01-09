# Logical Design - Unit 1: 基盤構築 & PokeAPI統合

## プロジェクト構成

```
poke_party/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # ルートレイアウト
│   │   ├── page.tsx            # トップページ
│   │   └── globals.css         # グローバルスタイル
│   │
│   ├── components/             # UIコンポーネント
│   │   ├── pokemon-card.tsx    # ポケモンカード
│   │   ├── type-badge.tsx      # タイプバッジ
│   │   └── move-list.tsx       # 技リスト
│   │
│   ├── lib/                    # ユーティリティ・サービス
│   │   ├── pokeapi/
│   │   │   ├── client.ts       # PokeAPI クライアント
│   │   │   ├── types.ts        # API レスポンス型
│   │   │   └── mapper.ts       # API → ドメイン変換
│   │   └── pokemon/
│   │       └── types.ts        # ドメイン型定義
│   │
│   ├── data/                   # 静的データ
│   │   └── type-data.ts        # タイプ日本語名・カラー
│   │
│   └── types/                  # 共通型定義
│       └── index.ts
│
├── public/                     # 静的ファイル
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 型定義

### ドメイン型 (`src/lib/pokemon/types.ts`)

```typescript
// タイプ
export type PokemonTypeName =
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

export interface PokemonType {
  name: PokemonTypeName;
  japaneseName: string;
  color: string;
}

// ダメージ分類
export type DamageClass = 'physical' | 'special' | 'status';

// 技
export interface Move {
  id: number;
  name: string;
  japaneseName: string;
  type: PokemonType;
  damageClass: DamageClass;
  description?: string;
}

// ポケモン
export interface Pokemon {
  id: number;
  name: string;
  japaneseName: string;
  types: PokemonType[];
  sprite: string;
  moves: Move[];
}
```

---

## PokeAPI クライアント設計

### 基本方針
- fetch API を使用（Next.js のキャッシュ機能活用）
- エラーハンドリングを統一
- 日本語データ取得のためのヘルパー関数

### クライアント実装 (`src/lib/pokeapi/client.ts`)

```typescript
const BASE_URL = 'https://pokeapi.co/api/v2';

// ポケモン基本情報取得
export async function fetchPokemon(idOrName: number | string): Promise<PokeAPIPokemon>

// ポケモン種族情報（日本語名）取得
export async function fetchPokemonSpecies(id: number): Promise<PokeAPISpecies>

// 技情報取得
export async function fetchMove(idOrName: number | string): Promise<PokeAPIMove>

// ポケモン詳細（日本語名込み）取得
export async function getPokemonWithJapaneseName(idOrName: number | string): Promise<Pokemon>

// 技詳細（日本語名込み）取得
export async function getMoveWithJapaneseName(idOrName: number | string): Promise<Move>
```

### キャッシュ戦略
- Next.js の `fetch` オプションでキャッシュ
- ポケモンデータは変更されないため、長期キャッシュ可能
- `{ next: { revalidate: 86400 } }` （24時間）

---

## UIコンポーネント設計

### PokemonCard

ポケモン1匹の情報を表示するカード。

**Props:**
```typescript
interface PokemonCardProps {
  pokemon: Pokemon;
}
```

**表示要素:**
- ポケモン画像（sprite）
- 日本語名
- タイプバッジ（1〜2つ）
- 技リスト（4つ）

**レイアウト:**
```
┌─────────────────────────┐
│      [ポケモン画像]       │
│                         │
│     ピカチュウ           │
│   [でんき]              │
│                         │
│  ・10まんボルト          │
│  ・でんこうせっか         │
│  ・アイアンテール         │
│  ・ボルテッカー          │
└─────────────────────────┘
```

### TypeBadge

タイプを表示するバッジ。

**Props:**
```typescript
interface TypeBadgeProps {
  type: PokemonType;
  size?: 'sm' | 'md';
}
```

**スタイル:**
- 角丸の背景色（タイプカラー）
- 白文字で日本語名表示
- タップターゲット 44px 以上（NFR-7）

### MoveList

技一覧を表示。

**Props:**
```typescript
interface MoveListProps {
  moves: Move[];
}
```

**表示:**
- 技名（日本語）
- 技タイプ（小さいバッジ）

---

## ページ設計

### トップページ (`src/app/page.tsx`)

Unit 1 では、デモとして1匹のポケモンを表示。

**実装:**
1. サーバーコンポーネントで PokeAPI からデータ取得
2. PokemonCard で表示
3. レスポンシブデザイン（モバイルファースト）

---

## NFR 対応

| NFR | 対応方法 |
|-----|----------|
| NFR-6 モバイルファースト | Tailwind の `max-w-md mx-auto`、モバイル幅優先 |
| NFR-7 タップターゲット | ボタン・バッジは `min-h-[44px] min-w-[44px]` |
| NFR-9 日本語対応 | PokeAPI から日本語名取得、タイプ日本語定義 |
| NFR-12 コード品質 | TypeScript strict、ESLint/Prettier |

---

## 実装順序（Bolt）

| Bolt | タスク | ファイル |
|------|--------|----------|
| 1-1 | プロジェクト初期化 | package.json, tsconfig.json, tailwind.config.ts |
| 1-2 | PokeAPI 調査 | （調査のみ） |
| 1-3 | 型定義 | src/lib/pokemon/types.ts, src/lib/pokeapi/types.ts |
| 1-4 | タイプデータ | src/data/type-data.ts |
| 1-5 | API クライアント | src/lib/pokeapi/client.ts, mapper.ts |
| 1-6 | UIコンポーネント | src/components/*.tsx |
| 1-7 | トップページ | src/app/page.tsx |
| 1-8 | デプロイ | vercel.json（必要に応じて）|

---

## エラーハンドリング

### API エラー
```typescript
export class PokeApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
  }
}
```

### UI でのエラー表示
- ユーザーフレンドリーなメッセージ（NFR-5）
- 「ポケモンが見つかりませんでした」
- 「通信エラーが発生しました。再度お試しください」
