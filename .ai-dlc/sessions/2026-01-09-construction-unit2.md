# Session Log: Construction Phase - Unit 2

## 日時
2026-01-09

## フェーズ
Construction

## Unit
Unit 2: AI パーティ生成

---

## 実施内容

### 1. ドメイン設計
- Party, PartyPokemon, GenerationRequest の型定義
- AI と PokeAPI の役割分担設計（ハルシネーション防止）

### 2. 論理設計
- API Route 設計（/api/generate-party）
- 技選定アルゴリズム設計
- 状態管理設計

### 3. 実装

| Bolt | タスク | 状態 |
|------|--------|------|
| 2-1 | 入力UI | 完了 |
| 2-2 | AI統合 | 完了 |
| 2-3 | プロンプト設計 | 完了 |
| 2-4 | バリデーション | 完了 |
| 2-5 | 技選定 | 完了 |
| 2-6 | パーティ表示 | 完了 |
| 2-7 | 再生成・ローディング | 完了 |

---

## 成果物

### コード
- `src/lib/openai/client.ts` - AI クライアント（Gemini使用）
- `src/lib/party/types.ts` - パーティ関連型
- `src/lib/party/generator.ts` - パーティ生成ロジック
- `src/lib/party/move-selector.ts` - 技選定ロジック
- `src/app/api/generate-party/route.ts` - API Route
- `src/components/party-generator.tsx` - パーティ生成フォーム
- `src/components/party-display.tsx` - パーティ表示
- `src/components/pokemon-count-select.tsx` - 匹数選択
- `src/components/loading-spinner.tsx` - ローディング表示

### 設計書
- `.ai-dlc/construction/unit2/domain-design.md`
- `.ai-dlc/construction/unit2/logical-design.md`

---

## 完了条件の確認

- [x] テーマを入力してパーティが生成される
- [x] 1〜6匹の範囲で匹数指定できる
- [x] 生成されたポケモンは実在し、技も習得可能なもの
- [x] 再生成ができる

---

## 技術的な決定・変更

1. **AI API の変更**
   - OpenAI → Anthropic Claude（クレジット不足）→ **Google Gemini** に変更
   - 最終的に `gemini-2.5-flash` モデルを使用

2. **遅延初期化パターン**
   - ビルド時のAPI キー未設定エラーを防止するため採用

3. **AIの役割限定**
   - AIは「ポケモン名の選定」のみ担当
   - 技は PokeAPI の習得可能技リストから選定（ハルシネーション防止）

---

## 問題と解決

| 問題 | 解決 |
|------|------|
| OpenAI API キー形式不明 | Gemini に切り替え |
| Claude API クレジット不足 | Gemini に切り替え |
| Gemini モデル名不正 | `gemini-2.5-flash` に修正 |
| ビルド時 API キーエラー | 遅延初期化パターン採用 |

---

## 次のアクション

**Unit 3: バトル補助（相性判定）** に進む
- タイプ相性計算
- 相性判定UI
- 技詳細モーダル
