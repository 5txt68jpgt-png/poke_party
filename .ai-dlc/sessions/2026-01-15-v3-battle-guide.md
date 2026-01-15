# Session Log: v3 バトル展開ガイド

## Date: 2026-01-15

## Goal
親がポケモンの良さを知らないため、生成されたパーティでの戦い方ガイドを追加する

## VoC
「シングル/ダブル共に、そのパーティでの戦い方の展開イメージを添えて欲しい。親はそれぞれのポケモンの良さを知らないので、盛り上がる戦い方ができないから。」

## Decisions Made
1. **ガイドの内容**: 基本戦術のみ（シンプルな流れ）
2. **表示方法**: ボタンで展開/折りたたみ
3. **長さ**: 中程度（4〜5文）
4. **生成タイミング**: パーティ生成時に同時生成
5. **技入れ替え対応**: ポケモン中心の説明にして技入れ替え後も有効に

## Completed Tasks

### Unit 1: バトルガイド生成ロジック
- [x] Party型にbattleGuide追加
- [x] シングル/ダブル用プロンプト作成
- [x] generateBattleGuide関数実装
- [x] generator.tsへの統合

### Unit 2: ガイド表示UI
- [x] BattleGuideDisplayコンポーネント作成
- [x] 折りたたみアニメーション実装
- [x] PartyDisplayへの統合

## Files Changed
- `src/lib/party/types.ts` - battleGuide追加
- `src/lib/openai/client.ts` - generateBattleGuide関数追加
- `src/lib/party/generator.ts` - ガイド生成呼び出し
- `src/components/battle-guide-display.tsx` - 新規
- `src/components/party-display.tsx` - ガイド表示追加

## Deployment
- Production: https://pokeparty-three.vercel.app

## Next Steps
- ユーザーフィードバックを待つ
- 必要に応じてガイド内容の調整
