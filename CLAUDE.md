# Project: PokeParty

## Overview
ポケモンバトルごっこ用パーティ生成Webアプリ。
ポケモンの知識に乏しい親が子供とごっこ遊びをする際に使用する。

## AI-DLC Configuration
- このプロジェクトはAI-DLC（AI-Driven Development Lifecycle）を採用しています。
- Intentにおいての質問は1問1答形式にしてください
- 全てのUnitを実装し、Constructionフェーズが終わったらIntentから次の検討をするようにしてください
- ドキュメント、ログ類は常に記録・保存(commit/push)するようにしてください

### Artifact Locations
- Intent: `.ai-dlc/intent/intent.md`
- Inception: `.ai-dlc/inception/`
- Construction: `.ai-dlc/construction/unit{n}/`
- Sessions: `.ai-dlc/sessions/`

### Current Phase
Construction（v4）

### Active Units
- Unit 7: おまかせ生成改善
- Unit 8: ゲーム風デザイン

### Completed Units
| Unit | 機能 | 状態 |
|------|------|------|
| 1 | 基盤構築 & PokeAPI統合 | 完了 |
| 2 | AIパーティ生成 | 完了 |
| 3 | タイプ相性判定 | 完了 |
| 4 | UI/UX改善 | 完了 |
| 5 | パーティ生成改善（v2） | 完了 |
| 6 | ポケモン検索機能（v3） | 完了 |

## Tech Stack
- Framework: Next.js 14 (App Router)
- Language: TypeScript (strict mode)
- Styling: Tailwind CSS v3
- AI: Google Gemini API (gemini-2.5-flash)
- Data: PokeAPI
- Hosting: Vercel

## Deployment
- **Production URL**: https://pokeparty-three.vercel.app
- **GitHub**: https://github.com/5txt68jpgt-png/poke_party

## Project Structure
```
src/
├── app/
│   ├── api/generate-party/    # パーティ生成API
│   ├── page.tsx               # トップページ
│   └── globals.css
├── components/
│   ├── party-generator.tsx    # メインフォーム
│   ├── party-display.tsx      # パーティ表示
│   ├── pokemon-card.tsx       # ポケモンカード
│   ├── move-list.tsx          # 技リスト（相性チェック付き）
│   ├── type-badge.tsx         # タイプバッジ
│   ├── type-selector.tsx      # タイプ選択
│   ├── effectiveness-result.tsx
│   ├── move-effectiveness-modal.tsx
│   ├── theme-suggestions.tsx  # おすすめテーマ
│   └── ...
├── lib/
│   ├── pokeapi/               # PokeAPIクライアント
│   ├── openai/                # AI クライアント（Gemini）
│   ├── party/                 # パーティ生成ロジック
│   ├── effectiveness/         # 相性計算
│   └── pokemon/               # ドメイン型
└── data/
    ├── type-data.ts           # タイプ日本語名・カラー
    └── type-chart.ts          # 相性表
```

## Git Commit Convention
Format: `[phase]: [type] [description]`

| Phase | 用途 |
|-------|------|
| inception | Inceptionフェーズの成果物 |
| construct | Constructionフェーズの成果物 |
| operation | Operationフェーズの成果物 |
| chore | 設定・ドキュメント等 |

| Type | 用途 |
|------|------|
| intent | Intent定義 |
| prfaq | PRFAQ |
| story | ユーザーストーリー |
| nfr | 非機能要件 |
| domain | ドメイン設計 |
| logical | 論理設計 |
| adr | Architecture Decision Record |
| code | コード実装 |
| test | テスト |
| fix | バグ修正 |

## Branch Convention
- Inception: `inception/[intent-name]`
- Unit: `unit/[unit-name]`
- Bolt: `unit/[unit-name]/bolt-[n]`

## AI-DLC Workflow Rules
1. 成果物は `.ai-dlc/` に保存
2. セッション終了時にログを作成
3. 各決定ポイントで人間の承認を得る

## Environment Variables
```
GEMINI_API_KEY=...
```
