/**
 * ダブルバトルで味方にも当たる技のリスト
 * これらの技は味方を巻き込む可能性があるため注意が必要
 */

export interface AllyHittingMove {
  name: string;           // 英語名
  japaneseName: string;   // 日本語名
  immuneTypes?: string[]; // この技を無効化できるタイプ
  note?: string;          // 補足説明
}

export const ALLY_HITTING_MOVES: AllyHittingMove[] = [
  // 地面技
  { name: "earthquake", japaneseName: "じしん", immuneTypes: ["flying"], note: "ひこうタイプ・ふゆうは無効" },
  { name: "magnitude", japaneseName: "マグニチュード", immuneTypes: ["flying"], note: "ひこうタイプ・ふゆうは無効" },
  { name: "bulldoze", japaneseName: "じならし", immuneTypes: ["flying"], note: "ひこうタイプ・ふゆうは無効" },

  // 水技
  { name: "surf", japaneseName: "なみのり", note: "味方全体に当たる" },
  { name: "muddy-water", japaneseName: "だくりゅう", note: "味方全体に当たる" },

  // 氷技
  { name: "blizzard", japaneseName: "ふぶき", note: "味方全体に当たる" },

  // 岩技
  { name: "rock-slide", japaneseName: "いわなだれ", note: "相手全体攻撃（味方には当たらない）" },

  // 爆発系
  { name: "explosion", japaneseName: "だいばくはつ", note: "自分も倒れる、味方も巻き込む" },
  { name: "self-destruct", japaneseName: "じばく", note: "自分も倒れる、味方も巻き込む" },

  // 炎技
  { name: "lava-plume", japaneseName: "ふんえん", note: "味方全体に当たる" },
  { name: "heat-wave", japaneseName: "ねっぷう", note: "相手全体攻撃（味方には当たらない）" },

  // 電気技
  { name: "discharge", japaneseName: "ほうでん", note: "味方全体に当たる" },

  // フェアリー技
  { name: "dazzling-gleam", japaneseName: "マジカルシャイン", note: "相手全体攻撃（味方には当たらない）" },

  // 悪技
  { name: "snarl", japaneseName: "バークアウト", note: "相手全体攻撃（味方には当たらない）" },

  // ドラゴン技
  { name: "twister", japaneseName: "たつまき", note: "相手全体攻撃" },

  // その他
  { name: "boomburst", japaneseName: "ばくおんぱ", note: "味方全体に当たる" },
  { name: "hyper-voice", japaneseName: "ハイパーボイス", note: "相手全体攻撃（味方には当たらない）" },
];

// 技名で検索（英語名）
export function isAllyHittingMove(moveName: string): AllyHittingMove | undefined {
  return ALLY_HITTING_MOVES.find((m) => m.name === moveName);
}

// 味方にダメージを与える可能性がある技かどうか
export function canHitAlly(moveName: string): boolean {
  const move = isAllyHittingMove(moveName);
  if (!move) return false;
  // 「相手全体攻撃」のものは味方に当たらない
  return !move.note?.includes("味方には当たらない");
}
