import OpenAI from "openai";

// 遅延初期化（ビルド時にエラーを防ぐ）
let openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set");
    }
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
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
  const userPrompt = `テーマ: ${theme}
ポケモン数: ${count}匹

このテーマに合うポケモンを選んでください。`;

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.8,
    max_tokens: 200,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("AI response is empty");
  }

  const parsed = JSON.parse(content) as AIResponse;

  if (!parsed.pokemon || !Array.isArray(parsed.pokemon)) {
    throw new Error("Invalid AI response format");
  }

  return parsed;
}
