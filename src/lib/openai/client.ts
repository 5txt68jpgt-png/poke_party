import { GoogleGenerativeAI } from "@google/generative-ai";

// レート制限エラー
export class RateLimitError extends Error {
  retryAfterSeconds: number;

  constructor(retryAfterSeconds: number = 60) {
    super("API rate limit exceeded");
    this.name = "RateLimitError";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

// レート制限エラーかどうかを判定
function isRateLimitError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    // Gemini APIのレート制限エラーパターン
    return (
      message.includes("quota") ||
      message.includes("rate") ||
      message.includes("resource_exhausted") ||
      message.includes("429") ||
      message.includes("too many requests")
    );
  }
  return false;
}

// 遅延初期化（ビルド時にエラーを防ぐ）
let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set");
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

const SYSTEM_PROMPT = `あなたはポケモンの専門家です。
ユーザーが指定したテーマに合うポケモンをランダムに選んでください。

ルール:
1. 実在するポケモンの英語名（小文字、ハイフンあり）のみを返してください
2. 指定された数のポケモンを選んでください
3. テーマに合わないポケモンは選ばないでください
4. 必ずJSON形式のみで返してください（説明文は不要）
5. 御三家（各世代の最初に選べるポケモン）やメジャーなポケモンばかりにならないようにしてください
6. マイナーなポケモンや意外な選択も積極的に含めてください
7. 毎回異なる結果になるよう、ランダム性を重視してください
8. 同じテーマでも、リクエストごとに違うポケモンを選んでください

出力形式（必ずこの形式で）:
{"pokemon": ["pokemon1", "pokemon2", "pokemon3"]}`;

const RANDOM_PROMPT = `あなたはポケモンの専門家です。
ユーザーのためにランダムで面白いテーマを考え、そのテーマに合うポケモンを選んでください。

ルール:
1. まず面白いテーマを1つ考えてください（例：「青いポケモン」「鳥ポケモン」「つぶらな瞳のポケモン」「砂漠にいそうなポケモン」など）
2. テーマは必ず日本語で返してください（英語は不可）
3. そのテーマに合うポケモンを指定数ランダムに選んでください
4. ポケモン名は実在するポケモンの英語名（小文字、ハイフンあり）のみを返してください
5. 必ずJSON形式のみで返してください（説明文は不要）
6. 御三家やメジャーなポケモンばかりにならないようにしてください
7. マイナーなポケモンも積極的に含めてください
8. テーマは毎回違うものにしてください

出力形式（必ずこの形式で）:
{"theme": "日本語のテーマ", "pokemon": ["pokemon1", "pokemon2", "pokemon3"]}`;

// ダブルバトル用プロンプト
const DOUBLE_SYSTEM_PROMPT = `あなたはポケモンのダブルバトル専門家です。
ユーザーが指定したテーマに合う、ダブルバトル向けのポケモンを選んでください。

ダブルバトルのルール:
- 2匹のポケモンが同時に場に出る
- 味方同士の連携が重要

ルール:
1. 実在するポケモンの英語名（小文字、ハイフンあり）のみを返してください
2. 指定された数のポケモンを選んでください
3. テーマに合わないポケモンは選ばないでください
4. 必ずJSON形式のみで返してください（説明文は不要）
5. ダブルバトルで相性の良いポケモンの組み合わせを意識してください
6. 以下のような戦術を持つポケモンを含めると良いです：
   - トリックルーム使い（遅いポケモンが先に動ける）
   - おいかぜ使い（素早さ2倍）
   - いかく持ち（相手の攻撃を下げる）
   - このゆびとまれ/いかりのこな使い（味方を守る）
   - まもる持ち（ダブルの基本）
7. 毎回異なる結果になるよう、ランダム性を重視してください

出力形式（必ずこの形式で）:
{"pokemon": ["pokemon1", "pokemon2", "pokemon3"]}`;

const DOUBLE_RANDOM_PROMPT = `あなたはポケモンのダブルバトル専門家です。
ダブルバトル向けの面白いテーマを考え、そのテーマに合うポケモンを選んでください。

ダブルバトルのルール:
- 2匹のポケモンが同時に場に出る
- 味方同士の連携が重要

ルール:
1. まずダブルバトル向けの面白いテーマを1つ考えてください
   例：「トリックルームパーティ」「晴れパ」「雨パ」「おいかぜパーティ」「いかく軍団」「サポート重視」など
2. テーマは必ず日本語で返してください（英語は不可）
3. そのテーマに合うポケモンを指定数ランダムに選んでください
4. ポケモン名は実在するポケモンの英語名（小文字、ハイフンあり）のみを返してください
5. 必ずJSON形式のみで返してください（説明文は不要）
6. ダブルバトルで相性の良いポケモンの組み合わせを意識してください
7. テーマは毎回違うものにしてください

出力形式（必ずこの形式で）:
{"theme": "日本語のテーマ", "pokemon": ["pokemon1", "pokemon2", "pokemon3"]}`;

export interface AIResponse {
  pokemon: string[];
}

export interface RandomAIResponse {
  theme: string;
  pokemon: string[];
}

// バトルガイド用プロンプト（シングル）
const BATTLE_GUIDE_SINGLE_PROMPT = `あなたはポケモンバトルのコーチです。
以下のパーティで子供とポケモンごっこ遊びをする親にアドバイスしてください。

ルール:
1. 各ポケモンの「役割」と「出し順」を中心に説明してください
2. 技の詳細には踏み込まず、ポケモンの強み・特徴を伝えてください
3. 4〜5文程度で簡潔にまとめてください
4. 子供との遊びが盛り上がるような、ワクワクする表現を使ってください
5. 日本語で書いてください

出力形式（必ずこの形式で）:
{"guide": "ガイド文章"}`;

// バトルガイド用プロンプト（ダブル）
const BATTLE_GUIDE_DOUBLE_PROMPT = `あなたはポケモンダブルバトルのコーチです。
以下のパーティで子供とポケモンごっこ遊びをする親にアドバイスしてください。

ルール:
1. 各ポケモンの「役割」と「先発2匹の組み合わせ」を中心に説明してください
2. 技の詳細には踏み込まず、ポケモンの強み・連携を伝えてください
3. 4〜5文程度で簡潔にまとめてください
4. 子供との遊びが盛り上がるような、ワクワクする表現を使ってください
5. 日本語で書いてください

出力形式（必ずこの形式で）:
{"guide": "ガイド文章"}`

export async function generatePokemonNames(
  theme: string,
  count: number,
  battleMode: "single" | "double" = "single"
): Promise<AIResponse> {
  const systemPrompt = battleMode === "double" ? DOUBLE_SYSTEM_PROMPT : SYSTEM_PROMPT;
  const fullPrompt = `${systemPrompt}

テーマ: ${theme}
ポケモン数: ${count}匹

このテーマに合うポケモンを選んでください。JSONのみで返答してください。`;

  const model = getGenAI().getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  try {
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();

    // JSONを抽出（マークダウンコードブロックがある場合も対応）
    let jsonText = text.trim();
    const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1].trim();
    }

    const parsed = JSON.parse(jsonText) as AIResponse;

    if (!parsed.pokemon || !Array.isArray(parsed.pokemon)) {
      throw new Error("Invalid AI response format");
    }

    return parsed;
  } catch (error) {
    if (isRateLimitError(error)) {
      throw new RateLimitError(60); // デフォルト60秒
    }
    throw error;
  }
}

// おまかせ生成（テーマもAIが決める）
export async function generateRandomParty(
  count: number,
  battleMode: "single" | "double" = "single"
): Promise<RandomAIResponse> {
  const randomPrompt = battleMode === "double" ? DOUBLE_RANDOM_PROMPT : RANDOM_PROMPT;
  const fullPrompt = `${randomPrompt}

ポケモン数: ${count}匹

面白いテーマを考えて、そのテーマに合うポケモンを選んでください。JSONのみで返答してください。`;

  const model = getGenAI().getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  try {
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();

    // JSONを抽出（マークダウンコードブロックがある場合も対応）
    let jsonText = text.trim();
    const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1].trim();
    }

    const parsed = JSON.parse(jsonText) as RandomAIResponse;

    if (!parsed.theme || !parsed.pokemon || !Array.isArray(parsed.pokemon)) {
      throw new Error("Invalid AI response format for random generation");
    }

    return parsed;
  } catch (error) {
    if (isRateLimitError(error)) {
      throw new RateLimitError(60); // デフォルト60秒
    }
    throw error;
  }
}

// パーティ情報の型
interface PartyInfo {
  theme: string;
  members: Array<{
    name: string;
    japaneseName: string;
    types: string[];
  }>;
}

// バトルガイド生成
export async function generateBattleGuide(
  partyInfo: PartyInfo,
  battleMode: "single" | "double" = "single"
): Promise<string> {
  const basePrompt = battleMode === "double" ? BATTLE_GUIDE_DOUBLE_PROMPT : BATTLE_GUIDE_SINGLE_PROMPT;

  // パーティ情報を文字列化
  const pokemonList = partyInfo.members
    .map((m) => `${m.japaneseName}（${m.types.join("/")}タイプ）`)
    .join("、");

  const fullPrompt = `${basePrompt}

テーマ: ${partyInfo.theme}
パーティ: ${pokemonList}

このパーティでの戦い方をアドバイスしてください。JSONのみで返答してください。`;

  const model = getGenAI().getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  try {
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();

    // JSONを抽出
    let jsonText = text.trim();
    const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1].trim();
    }

    const parsed = JSON.parse(jsonText) as { guide: string };

    if (!parsed.guide || typeof parsed.guide !== "string") {
      throw new Error("Invalid battle guide response format");
    }

    return parsed.guide;
  } catch (error) {
    console.error("Failed to generate battle guide:", error);
    // エラー時はデフォルトメッセージを返す
    return "パーティの戦い方を考えてみよう！";
  }
}
