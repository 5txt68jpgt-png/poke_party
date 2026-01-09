import Anthropic from "@anthropic-ai/sdk";

// 遅延初期化（ビルド時にエラーを防ぐ）
let anthropic: Anthropic | null = null;

function getAnthropic(): Anthropic {
  if (!anthropic) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not set");
    }
    anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return anthropic;
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

このテーマに合うポケモンを選んでください。JSONのみで返答してください。`;

  const response = await getAnthropic().messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 200,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const content = response.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type");
  }

  // JSONを抽出（マークダウンコードブロックがある場合も対応）
  let jsonText = content.text.trim();
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
