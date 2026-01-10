import { NextResponse } from "next/server";
import { generateParty } from "@/lib/party/generator";
import { GenerationRequest, GeneratePartyResponse } from "@/lib/party/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerationRequest;

    // モードのバリデーション
    const mode = body.mode || "theme";
    if (mode !== "theme" && mode !== "random") {
      return NextResponse.json<GeneratePartyResponse>(
        {
          error: {
            code: "INVALID_INPUT",
            message: "無効なモードです",
          },
        },
        { status: 400 }
      );
    }

    // テーマモードの場合はテーマが必須
    if (mode === "theme" && (!body.theme || typeof body.theme !== "string")) {
      return NextResponse.json<GeneratePartyResponse>(
        {
          error: {
            code: "INVALID_INPUT",
            message: "テーマを入力してください",
          },
        },
        { status: 400 }
      );
    }

    // countのバリデーション
    if (
      typeof body.count !== "number" ||
      body.count < 1 ||
      body.count > 6
    ) {
      return NextResponse.json<GeneratePartyResponse>(
        {
          error: {
            code: "INVALID_INPUT",
            message: "ポケモン数は1〜6の間で指定してください",
          },
        },
        { status: 400 }
      );
    }

    // パーティ生成
    const party = await generateParty({
      theme: body.theme ? body.theme.trim().slice(0, 200) : undefined,
      count: body.count,
      mode,
    });

    return NextResponse.json<GeneratePartyResponse>({ party });
  } catch (error) {
    console.error("Party generation error:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json<GeneratePartyResponse>(
      {
        error: {
          code: "GENERATION_ERROR",
          message: `エラー: ${errorMessage}`,
        },
      },
      { status: 500 }
    );
  }
}
