/**
 * リージョンフォームを pokemon-list.json に追加するスクリプト
 * Usage: npx tsx scripts/add-regional-forms.ts
 */

import * as fs from 'fs';
import * as path from 'path';

interface PokemonEntry {
  id: number;
  name: string;
  japaneseName: string;
  types: string[];
}

interface PokeAPIPokemonListResponse {
  count: number;
  results: { name: string; url: string }[];
}

interface PokeAPIPokemonResponse {
  id: number;
  name: string;
  types: { slot: number; type: { name: string } }[];
  species: { name: string; url: string };
}

interface PokeAPISpeciesResponse {
  names: { language: { name: string }; name: string }[];
}

const API_BASE = 'https://pokeapi.co/api/v2';
const DELAY_MS = 50;

// リージョンフォームの日本語名マッピング
const REGION_NAMES: Record<string, string> = {
  'alola': 'アローラの姿',
  'galar': 'ガラルの姿',
  'hisui': 'ヒスイの姿',
  'paldea': 'パルデアの姿',
};

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry<T>(url: string, retries = 3): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.json() as T;
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`Retry ${i + 1} for ${url}`);
      await sleep(1000);
    }
  }
  throw new Error('Max retries exceeded');
}

function getRegion(name: string): string | null {
  const regions = ['alola', 'galar', 'hisui', 'paldea'];
  for (const region of regions) {
    if (name.includes(`-${region}`)) {
      return region;
    }
  }
  return null;
}

async function getSpeciesJapaneseName(speciesName: string): Promise<string> {
  try {
    const data = await fetchWithRetry<PokeAPISpeciesResponse>(
      `${API_BASE}/pokemon-species/${speciesName}`
    );
    return data.names.find(n => n.language.name === 'ja-Hrkt')?.name
      || data.names.find(n => n.language.name === 'ja')?.name
      || speciesName;
  } catch {
    return speciesName;
  }
}

async function main(): Promise<void> {
  // 既存のポケモンリストを読み込み
  const pokemonListPath = path.join(__dirname, '..', 'src', 'data', 'pokemon-list.json');
  const existingList: PokemonEntry[] = JSON.parse(fs.readFileSync(pokemonListPath, 'utf-8'));
  const existingNames = new Set(existingList.map(p => p.name));

  console.log(`Existing Pokemon: ${existingList.length}`);

  // 全ポケモンリストを取得
  console.log('Fetching all Pokemon from API...');
  const allPokemon = await fetchWithRetry<PokeAPIPokemonListResponse>(
    `${API_BASE}/pokemon?limit=2000`
  );
  console.log(`Total Pokemon in API: ${allPokemon.count}`);

  // リージョンフォームをフィルタ
  const regionalForms = allPokemon.results.filter(p => {
    const region = getRegion(p.name);
    return region !== null && !existingNames.has(p.name);
  });

  console.log(`Found ${regionalForms.length} new regional forms`);

  const newEntries: PokemonEntry[] = [];

  for (let i = 0; i < regionalForms.length; i++) {
    const form = regionalForms[i];
    const region = getRegion(form.name)!;

    if (i % 10 === 0) {
      console.log(`Progress: ${i}/${regionalForms.length}`);
    }

    try {
      // ポケモンデータを取得
      const pokemonData = await fetchWithRetry<PokeAPIPokemonResponse>(form.url);
      await sleep(DELAY_MS);

      // 元の種の日本語名を取得
      const baseJapaneseName = await getSpeciesJapaneseName(pokemonData.species.name);
      await sleep(DELAY_MS);

      // 日本語名を生成（例：ライチュウ（アローラの姿））
      const japaneseName = `${baseJapaneseName}（${REGION_NAMES[region]}）`;

      const types = pokemonData.types
        .sort((a, b) => a.slot - b.slot)
        .map(t => t.type.name);

      newEntries.push({
        id: pokemonData.id,
        name: form.name,
        japaneseName,
        types,
      });

      console.log(`  Added: ${form.name} -> ${japaneseName}`);
    } catch (error) {
      console.error(`Failed to fetch: ${form.name}`, error);
    }
  }

  // 既存リストに追加してIDでソート
  const mergedList = [...existingList, ...newEntries].sort((a, b) => a.id - b.id);

  // ファイル出力
  fs.writeFileSync(pokemonListPath, JSON.stringify(mergedList, null, 2), 'utf-8');

  console.log(`\nDone! Added ${newEntries.length} regional forms`);
  console.log(`Total Pokemon: ${mergedList.length}`);
  console.log(`File size: ${(fs.statSync(pokemonListPath).size / 1024).toFixed(1)} KB`);
}

main().catch(console.error);
