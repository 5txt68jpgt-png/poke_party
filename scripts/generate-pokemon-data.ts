/**
 * PokeAPIから全ポケモンのデータを取得してJSONファイルを生成するスクリプト
 *
 * 使用方法: npx ts-node scripts/generate-pokemon-data.ts
 */

import * as fs from 'fs';
import * as path from 'path';

interface PokemonEntry {
  id: number;
  name: string;           // 英語名（API識別子）
  japaneseName: string;   // 日本語名
  types: string[];        // タイプ（英語）
}

interface PokeAPISpeciesListResponse {
  count: number;
  results: { name: string; url: string }[];
}

interface PokeAPISpeciesResponse {
  id: number;
  name: string;
  names: { language: { name: string }; name: string }[];
}

interface PokeAPIPokemonResponse {
  id: number;
  name: string;
  types: { slot: number; type: { name: string } }[];
}

const API_BASE = 'https://pokeapi.co/api/v2';
const DELAY_MS = 50; // API rate limit対策

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

async function getAllSpecies(): Promise<{ name: string; url: string }[]> {
  console.log('Fetching species list...');
  const response = await fetchWithRetry<PokeAPISpeciesListResponse>(
    `${API_BASE}/pokemon-species?limit=2000`
  );
  console.log(`Found ${response.count} species`);
  return response.results;
}

async function getSpeciesData(name: string): Promise<{ id: number; japaneseName: string } | null> {
  try {
    const data = await fetchWithRetry<PokeAPISpeciesResponse>(
      `${API_BASE}/pokemon-species/${name}`
    );
    const jaName = data.names.find(n => n.language.name === 'ja-Hrkt')?.name
      || data.names.find(n => n.language.name === 'ja')?.name
      || name;
    return { id: data.id, japaneseName: jaName };
  } catch (error) {
    console.error(`Failed to fetch species: ${name}`, error);
    return null;
  }
}

async function getPokemonData(name: string): Promise<string[] | null> {
  try {
    const data = await fetchWithRetry<PokeAPIPokemonResponse>(
      `${API_BASE}/pokemon/${name}`
    );
    return data.types
      .sort((a, b) => a.slot - b.slot)
      .map(t => t.type.name);
  } catch (error) {
    console.error(`Failed to fetch pokemon: ${name}`, error);
    return null;
  }
}

async function main(): Promise<void> {
  const speciesList = await getAllSpecies();
  const pokemonList: PokemonEntry[] = [];

  console.log('Fetching individual Pokemon data...');

  for (let i = 0; i < speciesList.length; i++) {
    const species = speciesList[i];

    if (i % 100 === 0) {
      console.log(`Progress: ${i}/${speciesList.length}`);
    }

    const speciesData = await getSpeciesData(species.name);
    if (!speciesData) continue;

    await sleep(DELAY_MS);

    const types = await getPokemonData(species.name);
    if (!types) continue;

    pokemonList.push({
      id: speciesData.id,
      name: species.name,
      japaneseName: speciesData.japaneseName,
      types,
    });

    await sleep(DELAY_MS);
  }

  // IDでソート
  pokemonList.sort((a, b) => a.id - b.id);

  // ファイル出力
  const outputPath = path.join(__dirname, '..', 'src', 'data', 'pokemon-list.json');
  const outputDir = path.dirname(outputPath);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(pokemonList, null, 2), 'utf-8');

  console.log(`\nDone! Generated ${pokemonList.length} Pokemon entries`);
  console.log(`Output: ${outputPath}`);
  console.log(`File size: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`);
}

main().catch(console.error);
