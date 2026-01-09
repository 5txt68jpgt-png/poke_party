# Domain Design - Unit 1: 基盤構築 & PokeAPI統合

## 概要

Unit 1 では、PokeAPI からデータを取得し、ポケモン情報を表示するための基盤を構築する。
ドメインモデルは PokeAPI のデータ構造を参考にしつつ、アプリケーションに必要な形に整理する。

---

## ドメインモデル

### Entity

#### Pokemon（ポケモン）
ポケモンの基本情報を表すエンティティ。

| 属性 | 型 | 説明 |
|------|-----|------|
| id | number | ポケモンID（全国図鑑番号） |
| name | string | 英語名（API識別子） |
| japaneseName | string | 日本語名 |
| types | Type[] | タイプ（1〜2つ） |
| sprite | string | 画像URL |
| moves | Move[] | 覚える技リスト（最大4つ選定後） |
| learnableMoves | Move[] | 習得可能な全技リスト |

#### Move（技）
技の情報を表すエンティティ。

| 属性 | 型 | 説明 |
|------|-----|------|
| id | number | 技ID |
| name | string | 英語名（API識別子） |
| japaneseName | string | 日本語名 |
| type | Type | 技のタイプ |
| damageClass | DamageClass | 分類（物理/特殊/変化） |
| description | string | 技の説明（日本語） |

---

### Value Object

#### Type（タイプ）
ポケモンや技のタイプを表す値オブジェクト。

| 属性 | 型 | 説明 |
|------|-----|------|
| id | number | タイプID |
| name | string | 英語名 |
| japaneseName | string | 日本語名 |
| color | string | 表示用カラーコード |

**タイプ一覧（18種）:**
| 英語名 | 日本語名 | カラー |
|--------|----------|--------|
| normal | ノーマル | #A8A878 |
| fire | ほのお | #F08030 |
| water | みず | #6890F0 |
| electric | でんき | #F8D030 |
| grass | くさ | #78C850 |
| ice | こおり | #98D8D8 |
| fighting | かくとう | #C03028 |
| poison | どく | #A040A0 |
| ground | じめん | #E0C068 |
| flying | ひこう | #A890F0 |
| psychic | エスパー | #F85888 |
| bug | むし | #A8B820 |
| rock | いわ | #B8A038 |
| ghost | ゴースト | #705898 |
| dragon | ドラゴン | #7038F8 |
| dark | あく | #705848 |
| steel | はがね | #B8B8D0 |
| fairy | フェアリー | #EE99AC |

#### DamageClass（ダメージ分類）
技の分類を表す値オブジェクト。

| 値 | 日本語名 |
|----|----------|
| physical | ぶつり |
| special | とくしゅ |
| status | へんか |

---

### Aggregate

#### PartyPokemon（パーティ用ポケモン）
パーティに登録されたポケモン。Pokemon に選定された4つの技を持つ。

| 属性 | 型 | 説明 |
|------|-----|------|
| pokemon | Pokemon | ポケモン基本情報 |
| selectedMoves | Move[4] | 選定された4つの技 |

※ Unit 2 で本格的に使用

---

## ドメインサービス

### PokeApiService
PokeAPI との通信を担当するサービス。

| メソッド | 説明 |
|----------|------|
| getPokemonById(id: number) | IDでポケモン取得 |
| getPokemonByName(name: string) | 名前でポケモン取得 |
| getMoveById(id: number) | IDで技取得 |
| getMoveByName(name: string) | 名前で技取得 |
| getPokemonLearnableMoves(pokemonId: number) | 習得可能技リスト取得 |

### TypeService（Unit 3 で実装）
タイプ相性計算を担当するサービス。

---

## PokeAPI データマッピング

### ポケモンデータ取得
```
GET https://pokeapi.co/api/v2/pokemon/{id or name}
```

| PokeAPI フィールド | ドメインモデル属性 |
|-------------------|-------------------|
| id | Pokemon.id |
| name | Pokemon.name |
| sprites.front_default | Pokemon.sprite |
| types[].type.name | Pokemon.types (要変換) |
| moves[].move.name | Pokemon.learnableMoves (要変換) |

### 日本語名取得
```
GET https://pokeapi.co/api/v2/pokemon-species/{id}
```

| PokeAPI フィールド | ドメインモデル属性 |
|-------------------|-------------------|
| names[].name (language.name === 'ja') | Pokemon.japaneseName |

### 技データ取得
```
GET https://pokeapi.co/api/v2/move/{id or name}
```

| PokeAPI フィールド | ドメインモデル属性 |
|-------------------|-------------------|
| id | Move.id |
| name | Move.name |
| type.name | Move.type (要変換) |
| damage_class.name | Move.damageClass |
| names[].name (language.name === 'ja') | Move.japaneseName |
| flavor_text_entries[].flavor_text (language.name === 'ja') | Move.description |

---

## 境界づけられたコンテキスト

```
┌─────────────────────────────────────────┐
│           PokeParty アプリケーション        │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────┐    ┌─────────────┐    │
│  │   Pokemon   │    │    Move     │    │
│  │   Context   │    │   Context   │    │
│  └─────────────┘    └─────────────┘    │
│         │                  │            │
│         └────────┬─────────┘            │
│                  │                      │
│         ┌────────▼────────┐            │
│         │  PokeApiService │            │
│         └────────┬────────┘            │
│                  │                      │
└──────────────────│──────────────────────┘
                   │
           ┌───────▼───────┐
           │   PokeAPI     │
           │  (External)   │
           └───────────────┘
```

---

## Unit 1 で実装するもの

1. **型定義**: Pokemon, Move, Type, DamageClass
2. **PokeApiService**: 基本的なデータ取得メソッド
3. **日本語マッピング**: タイプの日本語名・カラー定義
4. **UIコンポーネント**: PokemonCard（単体ポケモン表示）
