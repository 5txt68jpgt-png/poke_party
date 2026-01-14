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
2. そのテーマに合うポケモンを指定数ランダムに選んでください
3. 実在するポケモンの英語名（小文字、ハイフンあり）のみを返してください
4. 必ずJSON形式のみで返してください（説明文は不要）
5. 御三家やメジャーなポケモンばかりにならないようにしてください
6. マイナーなポケモンも積極的に含めてください
7. テーマは毎回違うものにしてください

出力形式（必ずこの形式で）:
{"theme": "考えたテーマ", "pokemon": ["pokemon1", "pokemon2", "pokemon3"]}`;

export interface AIResponse {
  pokemon: string[];
}

export interface RandomAIResponse {
  theme: string;
  pokemon: string[];
}

export async function generatePokemonNames(
  theme: string,
  count: number
): Promise<AIResponse> {
  const fullPrompt = `${SYSTEM_PROMPT}

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
  count: number
): Promise<RandomAIResponse> {
  const fullPrompt = `${RANDOM_PROMPT}

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
