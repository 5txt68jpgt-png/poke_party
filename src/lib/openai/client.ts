import { GoogleGenerativeAI } from "@google/generative-ai";

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
ユーザーが指定したテーマに合うポケモンを選んでください。

ルール:
1. 実在するポケモンの英語名（小文字、ハイフンあり）のみを返してください
2. 指定された数のポケモンを選んでください
3. テーマに合わないポケモンは選ばないでください
4. 必ずJSON形式のみで返してください（説明文は不要）

出力形式（必ずこの形式で）:
{"pokemon": ["pikachu", "charizard", "blastoise"]}`;

export interface AIResponse {
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
}
