# Bolt Plan v6 - 技の入れ替え機能

## 概要

v6の機能を1つのUnitで実装する。
- Unit 11: 技の入れ替え機能

---

## Unit 構成

```
Unit 11: 技の入れ替え機能
```

---

## Unit 11: 技の入れ替え機能

### 目的
パーティ生成後に個別の技を入れ替え可能にする

### 対応ストーリー
- US-V6-1（技の入れ替え）
- US-V6-2（技の詳細表示）
- US-V6-3（タイプフィルタ）
- US-V6-4（既存技との連携）

### 成果物
- 技データの拡張（威力、分類を追加）
- ポケモンの覚える技取得ロジック
- 技入れ替えモーダル
- タイプフィルタUI
- MoveListの更新

### Bolt（実装タスク）

| Bolt | タスク | 詳細 |
|------|--------|------|
| 11-1 | 技データ拡張 | move-list.jsonに威力・分類を追加 |
| 11-2 | 覚える技取得 | PokeAPIからポケモンの覚える技を取得するロジック |
| 11-3 | 技入れ替えモーダル | 候補表示、選択、入れ替え処理 |
| 11-4 | タイプフィルタ | フィルタUI、フィルタロジック |
| 11-5 | MoveList更新 | 技タップで入れ替えモーダルを開く |
| 11-6 | テスト・デプロイ | 動作確認、本番デプロイ |

### 完了条件
- [ ] 技をタップすると入れ替えモーダルが開く
- [ ] 候補に威力・分類が表示される
- [ ] タイプフィルタが機能する
- [ ] 技の入れ替えが正常に動作する
- [ ] 入れ替え後も相性チェックが動作する
- [ ] 本番環境にデプロイ済み

---

## 技術詳細

### 技データ拡張

```typescript
// 現在
interface MoveEntry {
  id: number;
  name: string;
  japaneseName: string;
  type: PokemonTypeName;
}

// 拡張後
interface MoveEntry {
  id: number;
  name: string;
  japaneseName: string;
  type: PokemonTypeName;
  power: number | null;      // 威力（変化技はnull）
  damageClass: DamageClass;  // physical | special | status
}
```

### 覚える技の取得

```typescript
// PokeAPIから動的に取得
async function fetchLearnableMoves(pokemonId: number): Promise<MoveEntry[]> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
  const data = await response.json();

  // data.moves から技IDリストを取得
  // move-list.json とマッチングして詳細情報付きで返す
  return learnableMoves;
}
```

### 状態管理

```typescript
// PartyDisplayで技の入れ替えを管理
const [partyMembers, setPartyMembers] = useState<PartyPokemon[]>(party.members);

const handleMoveSwap = (pokemonIndex: number, moveIndex: number, newMove: Move) => {
  setPartyMembers(prev => {
    const updated = [...prev];
    updated[pokemonIndex].selectedMoves[moveIndex] = newMove;
    return updated;
  });
};
```

---

## リスク

| リスク | 影響 | 対策 |
|--------|------|------|
| API呼び出し遅延 | 中 | ローディング表示、キャッシュ活用 |
| 覚える技が多すぎる | 中 | タイプフィルタで絞り込み |
| 技データ不整合 | 低 | move-list.jsonとの整合性チェック |

---

## 見積もり

| Unit | 作業量 |
|------|--------|
| Unit 11 | 中（技データ拡張とAPI連携がメイン） |
