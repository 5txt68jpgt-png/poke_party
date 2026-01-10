/**
 * フォーム違いでスキップされたポケモンを補完するスクリプト
 */

import * as fs from 'fs';
import * as path from 'path';

interface PokemonEntry {
  id: number;
  name: string;
  japaneseName: string;
  types: string[];
}

// フォーム違いのポケモン: [id, species_name, api_name, japanese_name, types]
const FORM_POKEMON: [number, string, string, string, string[]][] = [
  [386, 'deoxys', 'deoxys-normal', 'デオキシス', ['psychic']],
  [413, 'wormadam', 'wormadam-plant', 'ミノマダム', ['bug', 'grass']],
  [487, 'giratina', 'giratina-altered', 'ギラティナ', ['ghost', 'dragon']],
  [492, 'shaymin', 'shaymin-land', 'シェイミ', ['grass']],
  [550, 'basculin', 'basculin-red-striped', 'バスラオ', ['water']],
  [555, 'darmanitan', 'darmanitan-standard', 'ヒヒダルマ', ['fire']],
  [641, 'tornadus', 'tornadus-incarnate', 'トルネロス', ['flying']],
  [642, 'thundurus', 'thundurus-incarnate', 'ボルトロス', ['electric', 'flying']],
  [645, 'landorus', 'landorus-incarnate', 'ランドロス', ['ground', 'flying']],
  [647, 'keldeo', 'keldeo-ordinary', 'ケルディオ', ['water', 'fighting']],
  [648, 'meloetta', 'meloetta-aria', 'メロエッタ', ['normal', 'psychic']],
  [678, 'meowstic', 'meowstic-male', 'ニャオニクス', ['psychic']],
  [681, 'aegislash', 'aegislash-shield', 'ギルガルド', ['steel', 'ghost']],
  [710, 'pumpkaboo', 'pumpkaboo-average', 'バケッチャ', ['ghost', 'grass']],
  [711, 'gourgeist', 'gourgeist-average', 'パンプジン', ['ghost', 'grass']],
  [718, 'zygarde', 'zygarde-50', 'ジガルデ', ['dragon', 'ground']],
  [741, 'oricorio', 'oricorio-baile', 'オドリドリ', ['fire', 'flying']],
  [745, 'lycanroc', 'lycanroc-midday', 'ルガルガン', ['rock']],
  [746, 'wishiwashi', 'wishiwashi-solo', 'ヨワシ', ['water']],
  [774, 'minior', 'minior-red-meteor', 'メテノ', ['rock', 'flying']],
  [778, 'mimikyu', 'mimikyu-disguised', 'ミミッキュ', ['ghost', 'fairy']],
  [849, 'toxtricity', 'toxtricity-amped', 'ストリンダー', ['electric', 'poison']],
  [875, 'eiscue', 'eiscue-ice', 'コオリッポ', ['ice']],
  [876, 'indeedee', 'indeedee-male', 'イエッサン', ['psychic', 'normal']],
  [877, 'morpeko', 'morpeko-full-belly', 'モルペコ', ['electric', 'dark']],
  [892, 'urshifu', 'urshifu-single-strike', 'ウーラオス', ['fighting', 'dark']],
  [902, 'basculegion', 'basculegion-male', 'イダイトウ', ['water', 'ghost']],
  [905, 'enamorus', 'enamorus-incarnate', 'ラブトロス', ['fairy', 'flying']],
  [916, 'oinkologne', 'oinkologne-male', 'パフュートン', ['normal']],
  [925, 'maushold', 'maushold-family-of-four', 'イッカネズミ', ['normal']],
  [931, 'squawkabilly', 'squawkabilly-green-plumage', 'イキリンコ', ['normal', 'flying']],
  [964, 'palafin', 'palafin-zero', 'イルカマン', ['water']],
  [978, 'tatsugiri', 'tatsugiri-curly', 'シャリタツ', ['dragon', 'water']],
  [982, 'dudunsparce', 'dudunsparce-two-segment', 'ノココッチ', ['normal']],
];

async function main(): Promise<void> {
  const filePath = path.join(__dirname, '..', 'src', 'data', 'pokemon-list.json');
  const data: PokemonEntry[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  console.log(`Current count: ${data.length}`);

  // 既存のIDセット
  const existingIds = new Set(data.map(p => p.id));

  // 欠けているポケモンを追加
  let added = 0;
  for (const [id, , apiName, japaneseName, types] of FORM_POKEMON) {
    if (!existingIds.has(id)) {
      data.push({
        id,
        name: apiName,
        japaneseName,
        types,
      });
      console.log(`Added: ${japaneseName} (ID: ${id})`);
      added++;
    }
  }

  // IDでソート
  data.sort((a, b) => a.id - b.id);

  // 保存
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

  console.log(`\nAdded ${added} Pokemon. New total: ${data.length}`);
  console.log(`File size: ${(fs.statSync(filePath).size / 1024).toFixed(1)} KB`);
}

main().catch(console.error);
