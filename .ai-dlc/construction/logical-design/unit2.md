# Logical Design - Unit 2: AI パーティ生成

## ファイル構成（追加分）

```
src/
├── app/
│   ├── api/
│   │   └── generate-party/
│   │       └── route.ts        # パーティ生成API
│   └── page.tsx                # 更新: パーティ生成UI
│
├── components/
│   ├── party-generator.tsx     # パーティ生成フォーム
│   ├── party-display.tsx       # パーティ一覧表示
│   ├── pokemon-count-select.tsx # 匹数選択
│   └── loading-spinner.tsx     # ローディング表示
│
├── lib/
│   ├── openai/
│   │   └── client.ts           # OpenAI クライアント
│   ├── party/
│   │   ├── types.ts            # パーティ関連型
│   │   ├── generator.ts        # パーティ生成ロジック
│   │   └── move-selector.ts    # 技選定ロジック
│   └── pokeapi/
│       └── client.ts           # 更新: バリデーション追加
│
└── hooks/
    └── use-party-generation.ts # パーティ生成フック
```

---

## 型定義

### パーティ関連型 (`src/lib/party/types.ts`)

```typescript
// 生成リクエスト
export interface GenerationRequest {
  theme: string;
  count: number;  // 1-6
}

// パーティ
export interface Party {
  theme: string;
  members: PartyPokemon[];
}

// 生成状態
export type GenerationState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; party: Party }
  | { status: 'error'; message: string };

// API レスポンス
export interface GeneratePartyResponse {
  party?: Party;
  error?: {
    code: string;
    message: string;
  };
}
```

---

## OpenAI プロンプト設計

### システムプロンプト

```
あなたはポケモンの専門家です。
ユーザーが指定したテーマに合うポケモンを選んでください。

ルール:
1. 実在するポケモンの英語名のみを返してください
2. 指定された数のポケモンを選んでください
3. テーマに合わないポケモンは選ばないでください
4. JSON形式で返してください

出力形式:
{"pokemon": ["pikachu", "charizard", "blastoise"]}
```

### ユーザープロンプト

```
テーマ: {theme}
ポケモン数: {count}匹

このテーマに合うポケモンを選んでください。
```

---

## API Route 設計

### POST /api/generate-party (`src/app/api/generate-party/route.ts`)

```typescript
export async function POST(request: Request) {
  // 1. リクエスト検証
  const { theme, count } = await request.json();

  // 2. 入力バリデーション
  if (!theme || count < 1 || count > 6) {
    return Response.json({ error: { code: 'INVALID_INPUT', message: '...' } });
  }

  // 3. OpenAI API 呼び出し
  const aiResponse = await callOpenAI(theme, count);

  // 4. PokeAPI でバリデーション & データ取得
  const validatedPokemon = await validateAndFetchPokemon(aiResponse.pokemon);

  // 5. 技選定
  const partyMembers = await selectMovesForParty(validatedPokemon);

  // 6. レスポンス
  return Response.json({ party: { theme, members: partyMembers } });
}
```

---

## 技選定ロジック

### 選定アルゴリズム (`src/lib/party/move-selector.ts`)

```typescript
export async function selectMovesForPokemon(
  pokemonId: number,
  pokemonTypes: PokemonType[]
): Promise<Move[]> {
  // 1. 習得可能技を取得
  const learnableMoves = await getPokemonLearnableMoves(pokemonId);

  // 2. 技の詳細を取得（一部をサンプリング）
  const moveDetails = await fetchMoveDetails(learnableMoves.slice(0, 50));

  // 3. バランスを考慮して選定
  const selected = selectBalanced(moveDetails, pokemonTypes);

  return selected;
}
```

### 選定基準

1. **タイプ一致技を1つ以上**
   - ポケモンのタイプと同じタイプの技を優先

2. **異なるタイプの技**
   - 多様な相手に対応できるように

3. **分類のバランス**
   - 物理/特殊/変化をバランス良く

4. **ランダム性**
   - 同じポケモンでも毎回違う技構成に

---

## UIコンポーネント設計

### PartyGenerator（パーティ生成フォーム）

```
┌─────────────────────────────────────┐
│ テーマを入力                          │
│ ┌─────────────────────────────────┐ │
│ │ 第一世代のポケモンで            │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ポケモン数: [3匹 ▼]                 │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │         パーティ生成            │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### PartyDisplay（パーティ表示）

```
┌─────────────────────────────────────┐
│ テーマ: 第一世代のポケモンで          │
│                                     │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐│
│ │ピカチュウ│ │リザードン│ │ギャラドス││
│ └─────────┘ └─────────┘ └─────────┘│
│                                     │
│ [選択中のポケモン詳細カード]           │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │          再生成                 │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## エラーハンドリング

| エラーコード | 原因 | ユーザーメッセージ |
|-------------|------|-------------------|
| INVALID_INPUT | 入力不正 | テーマを入力してください |
| AI_ERROR | OpenAI API エラー | 生成に失敗しました。再度お試しください |
| POKEMON_NOT_FOUND | ポケモン存在しない | 条件に合うポケモンが見つかりませんでした |
| RATE_LIMIT | API制限 | しばらく待ってから再度お試しください |

---

## 環境変数

```
OPENAI_API_KEY=sk-...
```

`.env.local` に設定（NFR-10: サーバーサイドのみで使用）

---

## 実装順序（Bolt）

| Bolt | タスク | ファイル |
|------|--------|----------|
| 2-1 | 入力UI | party-generator.tsx, pokemon-count-select.tsx |
| 2-2 | OpenAI統合 | lib/openai/client.ts, .env.local |
| 2-3 | プロンプト設計 | lib/openai/client.ts |
| 2-4 | バリデーション | lib/pokeapi/client.ts |
| 2-5 | 技選定 | lib/party/move-selector.ts |
| 2-6 | パーティ表示 | party-display.tsx, page.tsx |
| 2-7 | 再生成・ローディング | loading-spinner.tsx, hooks |
