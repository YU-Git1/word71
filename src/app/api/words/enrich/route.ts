import { enrichWord } from "@/lib/dictionary";
import { IndustryOption } from "@/types/word";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      word?: string;
      industry?: IndustryOption;
    };
    const word = payload.word?.trim();

    if (!word) {
      return Response.json({ error: "缺少单词内容。" }, { status: 400 });
    }

    const data = await enrichWord(word, payload.industry || "general");

    return Response.json({ data });
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "自动生成词卡失败。",
      },
      { status: 500 },
    );
  }
}
