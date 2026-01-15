# Bolt Plan - v3: バトル展開ガイド

## 概要
2つのUnitで実装。パーティ生成と同時にガイドを生成し、折りたたみUIで表示する。

---

## Unit 1: バトルガイド生成ロジック

### 目的
AIでバトル展開ガイドを生成する機能を追加

### Bolts

#### Bolt 1-1: 型定義の拡張
- `Party`型に`battleGuide: string`を追加
- `GeneratePartyResponse`に対応

#### Bolt 1-2: ガイド生成プロンプト作成
- シングル用プロンプト
- ダブル用プロンプト
- パーティ構成（ポケモン名、タイプ、技）を入力として渡す

#### Bolt 1-3: ガイド生成関数の実装
- `generateBattleGuide(party, battleMode)`関数
- パーティ生成後に呼び出し
- エラー時はデフォルトメッセージを返す

#### Bolt 1-4: API統合
- `generator.ts`でガイド生成を呼び出し
- 生成されたガイドをPartyに含める

---

## Unit 2: ガイド表示UI

### 目的
バトルガイドを表示/非表示できるUIを実装

### Bolts

#### Bolt 2-1: 表示コンポーネント作成
- `BattleGuideDisplay`コンポーネント
- 折りたたみ式UI
- アニメーション付き開閉

#### Bolt 2-2: PartyDisplayへの統合
- テーマ表示の下にガイドボタンを配置
- 表示/非表示状態の管理

#### Bolt 2-3: スタイリング
- 既存デザインと調和
- モバイルフレンドリー

---

## 実装順序
1. Unit 1 → Unit 2（依存関係あり）

## 見積もり
- Unit 1: Bolt 4つ
- Unit 2: Bolt 3つ
- 合計: 7 Bolts
