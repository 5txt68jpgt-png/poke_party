/**
 * PokeAPIから全技データを取得してJSONファイルに保存するスクリプト
 * Usage: npx tsx scripts/generate-move-list.ts
 */

interface MoveEntry {
  id: number;
  name: string;
  japaneseName: string;
  type: string;
  power: number | null;
  damageClass: "physical" | "special" | "status";
}

interface PokeAPIMoveListResponse {
  count: number;
  results: { name: string; url: string }[];
}

interface PokeAPIMoveDetail {
  id: number;
  name: string;
  type: {
    name: string;
  };
  power: number | null;
  damage_class: {
    name: string;
  };
  names: {
    name: string;
    language: {
      name: string;
    };
  }[];
}

const BASE_URL = "https://pokeapi.co/api/v2";
const BATCH_SIZE = 20;
const DELAY_MS = 100;

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchMoveList(): Promise<{ name: string; url: string }[]> {
  const response = await fetch(`${BASE_URL}/move?limit=1000`);
  if (!response.ok) {
    throw new Error(`Failed to fetch move list: ${response.status}`);
  }
  const data: PokeAPIMoveListResponse = await response.json();
  return data.results;
}

async function fetchMoveDetail(url: string): Promise<MoveEntry | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch move: ${url} - ${response.status}`);
      return null;
    }

    const data: PokeAPIMoveDetail = await response.json();

    // 日本語名を取得
    const japaneseName = data.names.find(n => n.language.name === "ja-Hrkt")?.name
      || data.names.find(n => n.language.name === "ja")?.name
      || data.name;

    return {
      id: data.id,
      name: data.name,
      japaneseName,
      type: data.type.name,
      power: data.power,
      damageClass: data.damage_class.name as "physical" | "special" | "status",
    };
  } catch (error) {
    console.error(`Error fetching move: ${url}`, error);
    return null;
  }
}

async function main() {
  console.log("Fetching move list from PokeAPI...");

  const moveList = await fetchMoveList();
  console.log(`Found ${moveList.length} moves`);

  const moves: MoveEntry[] = [];
  let processed = 0;

  // バッチ処理
  for (let i = 0; i < moveList.length; i += BATCH_SIZE) {
    const batch = moveList.slice(i, i + BATCH_SIZE);

    const results = await Promise.all(
      batch.map(move => fetchMoveDetail(move.url))
    );

    for (const result of results) {
      if (result) {
        moves.push(result);
      }
    }

    processed += batch.length;
    console.log(`Processed ${processed}/${moveList.length} moves`);

    // レート制限対策
    await sleep(DELAY_MS);
  }

  // IDでソート
  moves.sort((a, b) => a.id - b.id);

  // ファイルに書き込み
  const fs = await import("fs");
  const path = await import("path");

  const outputPath = path.join(process.cwd(), "src/data/move-list.json");
  fs.writeFileSync(outputPath, JSON.stringify(moves, null, 2));

  console.log(`\nSaved ${moves.length} moves to ${outputPath}`);

  // ファイルサイズを確認
  const stats = fs.statSync(outputPath);
  console.log(`File size: ${(stats.size / 1024).toFixed(2)} KB`);
}

main().catch(console.error);
