import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface ParsedScaleData {
  yield_g: number | null;
  duration_s: number | null;
}

export async function parseScaleImage(
  base64Image: string,
  mimeType: string
): Promise<ParsedScaleData> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const result = await model.generateContent([
    {
      inlineData: { data: base64Image, mimeType },
    },
    `This is a photo of a digital scale used when pulling espresso.
Extract: (1) the weight in grams shown on the display, (2) the timer/shot duration in seconds if visible.
Return ONLY valid JSON with no markdown: { "yield_g": number | null, "duration_s": number | null }`,
  ]);

  try {
    const text = result.response.text().trim();
    return JSON.parse(text) as ParsedScaleData;
  } catch {
    return { yield_g: null, duration_s: null };
  }
}

export interface ParsedBagData {
  name: string | null;
  producer: string | null;
  region: string | null;
  varietal: string | null;
  process: string | null;
  altitude: string | null;
  roast_date: string | null;
  tasting_notes: string | null;
}

export async function parseBagImage(
  base64Image: string,
  mimeType: string
): Promise<ParsedBagData> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const result = await model.generateContent([
    {
      inlineData: { data: base64Image, mimeType },
    },
    `This is a photo of a bag of coffee beans.
Extract the following information if visible:
- name: the coffee or blend name
- producer: the farm, cooperative, or producer name
- region: the country and/or region of origin (e.g. "Yirgacheffe, Ethiopia")
- varietal: the coffee variety or cultivar (e.g. "Heirloom", "Bourbon", "Gesha")
- process: the processing method (e.g. "Washed", "Natural", "Honey")
- altitude: the growing altitude (e.g. "1900–2200 masl")
- roast_date: the roast date in YYYY-MM-DD format (or null if not visible)
- tasting_notes: flavour descriptors or tasting notes listed on the bag

Return ONLY valid JSON with no markdown: { "name": string | null, "producer": string | null, "region": string | null, "varietal": string | null, "process": string | null, "altitude": string | null, "roast_date": string | null, "tasting_notes": string | null }`,
  ]);

  try {
    const text = result.response.text().trim();
    return JSON.parse(text) as ParsedBagData;
  } catch {
    return { name: null, producer: null, region: null, varietal: null, process: null, altitude: null, roast_date: null, tasting_notes: null };
  }
}
