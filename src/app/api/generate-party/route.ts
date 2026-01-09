import { NextResponse } from "next/server";
import { generateParty } from "@/lib/party/generator";
import { GenerationRequest, GeneratePartyResponse } from "@/lib/party/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerationRequest;

    // 入力バリデーション
    if (!body.theme || typeof body.theme !== "string") {
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

    // テーマのサニタイズ（NFR-11）
    const sanitizedTheme = body.theme.trim().slice(0, 200);

    // パーティ生成
    const party = await generateParty({
      theme: sanitizedTheme,
      count: body.count,
    });

    return NextResponse.json<GeneratePartyResponse>({ party });
  } catch (error) {
    console.error("Party generation error:", error);

    // エラーの種類に応じてレスポンスを返す
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json<GeneratePartyResponse>(
          {
            error: {
              code: "CONFIG_ERROR",
              message: "サーバー設定エラーが発生しました",
            },
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json<GeneratePartyResponse>(
      {
        error: {
          code: "GENERATION_ERROR",
          message: "パーティ生成に失敗しました。再度お試しください。",
        },
      },
      { status: 500 }
    );
  }
}
