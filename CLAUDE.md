# Project: PokeParty

## AI-DLC Configuration
- このプロジェクトはAI-DLC（AI-Driven Development Lifecycle）を採用しています。
- Intentにおいての質問は1問1答形式にしてください
- 全てのUnitを実装し、Constructionフェーズが終わったらIntentから次の検討をするようにしてください
- ドキュメント、ログ類は常に記録・保存(commit/push)するようにしてください

### Artifact Locations
- Intent: `.ai-dlc/intent/intent.md`
- Inception: `.ai-dlc/inception/`
- Construction: `.ai-dlc/construction/`
- Sessions: `.ai-dlc/sessions/`

### Current Phase
Construction

### Active Unit
Unit 1: 基盤構築 & PokeAPI統合

## Tech Stack
- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- API: PokeAPI, OpenAI API
- Hosting: Vercel

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
