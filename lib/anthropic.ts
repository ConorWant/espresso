import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface ParsedScaleData {
  yield_g: number | null;
  duration_s: number | null;
}

export async function parseScaleImage(
  base64Image: string,
  mimeType: string
): Promise<ParsedScaleData> {
  const response = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 256,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mimeType as
                | "image/jpeg"
                | "image/png"
                | "image/gif"
                | "image/webp",
              data: base64Image,
            },
          },
          {
            type: "text",
            text: `This is a photo of a digital scale used when pulling espresso.
Extract: (1) the weight in grams shown on the display, (2) the timer/shot duration in seconds if visible.
Return ONLY valid JSON with no markdown: { "yield_g": number | null, "duration_s": number | null }`,
          },
        ],
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  try {
    return JSON.parse(text) as ParsedScaleData;
  } catch {
    return { yield_g: null, duration_s: null };
  }
}
