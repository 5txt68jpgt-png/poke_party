# Session Log: Inception Phase

## 日時
2026-01-09

## フェーズ
Inception

## 参加者
- Human（プロダクトオーナー）
- AI（Claude）

---

## 実施内容

### 1. Intent 定義
1問1答形式で以下を確認：
- ビジネス目標：子供とのポケモンバトルごっこをスムーズに
- ターゲット：ポケモン知識のない親（子供は小学生）
- 機能：テーマ指定 → AI がパーティ生成
- 技術：Next.js / Vercel / OpenAI API / PokeAPI

### 2. PRFAQ 作成
- プレスリリース形式でプロダクトビジョンを明文化
- FAQ 10問（利用者向け・技術向け）

### 3. User Stories 作成
8つのストーリーを定義：
- Must: US-1（テーマ生成）, US-2（匹数指定）, US-3（パーティ確認）, US-7（スマホUI）
- Should: US-4（再生成）, US-5（相性判定）
- Could: US-6（技詳細）, US-8（素早いアクセス）

### 4. NFR 作成
15の非機能要件を定義：
- パフォーマンス（生成10秒以内、UI 100ms以内）
- セキュリティ（APIキー保護、入力バリデーション）
- ユーザビリティ（モバイルファースト、日本語）

### 5. Risks 分析
8つのリスクを特定：
- High: 日本語データ品質、存在しない技の提案
- 対策：AIはポケモン選定のみ、技はPokeAPIから

### 6. Bolt Plan 作成
4つのUnitに分割：
1. 基盤構築 & PokeAPI統合
2. AIパーティ生成
3. 相性判定
4. UI/UX改善 & 仕上げ

---

## 決定事項

| 項目 | 決定内容 |
|------|----------|
| パーティ匹数 | 1〜6匹（デフォルト3匹） |
| 技の数 | 4つ固定 |
| AI の役割 | ポケモン選定のみ（技はPokeAPIから） |
| 相性判定 | MVPに含める |
| オフライン | 将来機能 |
| パーティ保存 | 将来機能 |

---

## 成果物

| 成果物 | パス |
|--------|------|
| Intent | `.ai-dlc/intent/intent.md` |
| PRFAQ | `.ai-dlc/inception/prfaq.md` |
| User Stories | `.ai-dlc/inception/user-stories.md` |
| NFR | `.ai-dlc/inception/nfr.md` |
| Risks | `.ai-dlc/inception/risks.md` |
| Bolt Plan | `.ai-dlc/inception/bolt-plan.md` |

---

## 次のアクション

1. **Construction フェーズ開始**
2. **Unit 1: 基盤構築 & PokeAPI統合** から着手
   - Next.js プロジェクト初期化
   - PokeAPI の日本語データ品質検証（RISK-1対応）

---

## メモ

- 「パパ、その技覚えないよ！」を防ぐことが重要
- AIのハルシネーション対策としてPokeAPIでのバリデーションが必須
- テーマ例・おすすめ機能でユーザーの入力ハードルを下げる
