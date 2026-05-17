import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { verifyToken } from "@/lib/auth";

export const runtime = "nodejs";
export const maxDuration = 60;

const ALLOWED_MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-3-flash-preview",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash-lite",
  "gemini-flash-latest",
  "gemini-flash-lite-latest",
  "gemini-pro-latest",
];

const FALLBACK_MODEL = "gemini-3.1-flash-lite";

const HUMANIZE_ZH_PROMPT = `You are an expert text humanizer. Your task is to rewrite the given Chinese (Mandarin) AI-generated text so it reads as authentically human-written, while preserving all facts, meaning, and original tone.

RULES (apply strictly):
- Write in very short, standalone sentences. One idea per sentence.
- Repeat the subject explicitly in consecutive sentences instead of using pronouns or omitting it.
- Write ALL numbers as Chinese characters (百分之八十五 not 85%，十八个月 not 18个月).
- Never wrap up with a clean conclusion — end with a simple practical sentence, never motivational or conclusive.
- Vary sentence length — mix 3-5 character sentences with occasional longer ones.
- Remove all AI-typical transitions: 此外、值得注意的是、综上所述、不可否认、随着X的不断Y.
- FAQ format: always convert to "有人问：" narrative style, never Q: A: format.
- Use explicit subject repetition every 1-2 sentences (他用了这个。他发现效果好。他继续用。).
- Mix simplified casual register — not textbook Mandarin.
- Avoid perfectly structured paragraphs — slight messiness is natural.
- Do NOT change facts, data, names, or core meaning.
- Do NOT over-synonymize.

OUTPUT:
Return only the rewritten text. No explanation, no preamble, no metadata. Preserve all HTML tags (h1, h2, strong, etc.) exactly as they appear in the input.

Text to rewrite:
"{TEXT}"`;

const STYLE_INSTRUCTIONS: Record<string, string> = {
  review: `- Article type: Product review / listicle.
- Use a conversational tone, like a blogger.
- Structure: Intro, "Why I tested this", "Key Features", "Pros & Cons", Verdict.`,
  announcement: `- Article type: New feature launch / company announcement.
- Tone: Professional, authoritative, exciting.
- Focus on the benefits for existing users.`,
  solution: `- Article type: Problem / Solution.
- Identify a common seller pain point first.
- Show how the product solves it step-by-step.`,
  comparison: `- Article type: Comparison / Ranking.
- Compare with generic market solutions.
- Highlight unique competitive advantages.`,
  other: `- Article type: Free / Custom style.
- Use a natural, informative tone.
- Balance informative value and product mention.`,
};

const CREATE_SYSTEM_PROMPT = `{LANG_INSTRUCTION}

Role: You are a professional e-commerce content marketing expert.
Task: Write a high-quality product marketing article based on the provided FUNCTION and KEYWORDS.

{SELECTED_STYLE_NAME} Style Instructions:
{SELECTED_STYLE_INSTRUCTION}

{SOFT_SELLING_BLOCK}

{FAQ_INSTRUCTION}

Localization:
- Naturally weave {LOKASI} into at least 2–3 places in the article. Mention local market context, local seller pain points, or local platform habits where relevant.
- It should feel like the article was written specifically for that market, not translated from a generic version.

---

TONE REFERENCE (optional — tone and voice only):
If ARTIKEL_CONTOH below is not "None provided.", extract ONLY the author's tone, voice, and personality.
Do NOT replicate its content, topic, structure, or any ranking/comparison patterns it may contain.
Do NOT introduce product rankings or comparisons unless the selected ARTICLE STYLE explicitly calls for it.
Treat it purely as a personality sample — how the author writes, not what they write about.

ARTIKEL_CONTOH: {ARTIKEL_CONTOH}

---

OUTPUT FORMAT (STRICT):
Output exactly three parts with these delimiters. No text outside these tags.

<<<ARTIKEL>>>
(full article content)
<<<META>>>
(meta description, max 160 characters)
<<<SLUG>>>
(url-slug-here)

INPUTS:
FUNGSI: {FUNGSI}
KATA_KUNCI: {KATA_KUNCI}
LOKASI: {LOKASI}`;

const SOFT_SELLING_BLOCK = `
---

SOFT SELLING (CRITICAL):
This article must never feel like an advertisement. The reader should arrive at 潮际好麦 as their own logical conclusion, not because they were pushed.

Rules:
- The article topic is the hero, not the brand. 潮际好麦 is a supporting character that solves a problem the reader already feels.
- Brand mention cap: mention "潮际好麦" maximum 5 times per article. Quality over quantity.
- "潮际好麦" must NEVER appear as an H2 heading or any heading level.
- Never write a paragraph that is purely about 潮际好麦's features without connecting it to a reader pain point first.
- Vary persuasion angles — use data in one section, a real use case in another, a credibility signal elsewhere. Never repeat the same persuasion pattern twice in one article.
- Promotional language is strictly forbidden: avoid "terbaik", "solusi terbaik", "wajib coba", "segera gunakan", "jangan lewatkan", "platform unggulan", "pilihan utama".
- CTA must feel like a natural next thought. Wrong: "Segera coba 潮际好麦 sekarang!" Correct: "Bagi seller yang ingin memangkas waktu produksi konten, 潮际好麦 layak dijadikan pilihan pertama."
- The overall tone must feel like advice from a trusted friend who knows the product well — not a copywriter hired to sell it.`;
const FAQ_ON = `- FAQ section: include exactly 3–4 questions. FAQ answers must be complete standalone answers, not partial responses that require context. Each answer: 2–3 sentences max, factual, no fluff.`;
const FAQ_OFF = `- Do NOT include a FAQ section in this article.`;

const FIX_PROMPT = `Language: Respond in the same language as the input sentence or paragraph.

Role: You are an expert writing editor.
{REWRITE_INSTRUCTION}

Original text to rewrite:
"{sentence}"

Return only the rewritten text, nothing else.`;

const sanitize = (val: any) => (typeof val === "string" ? val.trim() : val);

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return String(error);
};

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("ait_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const username = await verifyToken(token);
    if (!username) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const key1 = process.env[`USER_${username.toUpperCase()}_KEY1`];
    const key2 = process.env[`USER_${username.toUpperCase()}_KEY2`];

    if (!key1) {
      return NextResponse.json({ error: "No API key configured" }, { status: 500 });
    }

    const body = await req.json();

    const generateWithKey = async (apiKey: string) => {
      const genAI = new GoogleGenerativeAI(apiKey);
      let modelName = sanitize(body.model);
      if (!ALLOWED_MODELS.includes(modelName)) {
        modelName = FALLBACK_MODEL;
      }
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          maxOutputTokens: 4096,
        },
      });

      if (body.type === "humanize") {
        const inputText = sanitize(body.text);
        const prompt = HUMANIZE_ZH_PROMPT.replace("{TEXT}", inputText);
        return await model.generateContent(prompt);
      }

      if (body.type === "fix") {
        const isRed = body.rewriteType === "red";
        const rewriteInstruction = isRed
          ? "The following text is very difficult to read. Rewrite it to be bold and clear. Significantly simplify the structure, split into multiple short sentences if necessary, use simple direct words, and remove unnecessary clauses. Preserve core meaning."
          : "Rewrite the following text to make it clearer and easier to read. Keep the original meaning, break long sentences if needed, and aim for a Grade 8-9 reading level.";

        const prompt = FIX_PROMPT
          .replace("{REWRITE_INSTRUCTION}", rewriteInstruction)
          .replace("{sentence}", sanitize(body.sentence));

        return await model.generateContent(prompt);
      }

      if (body.type === "image_prompt") {
        const title = sanitize(body.title || "");
        const keywords = sanitize(body.kataKunci || "");
        const excerpt = sanitize(body.articleExcerpt || "");

        const imagePromptInstruction = `You are an expert visual art director and prompt engineer for AI image generation.

Your task: write ONE highly technical image generation prompt in English based on the article below.
The image will be used as a hero/thumbnail for the article.

Rules:
- Analyze the article topic deeply. Choose the most visually compelling representation — this could be a realistic photo, a graphic design poster, an infographic layout, a product mockup, a flat lay, or a cinematic scene.
- Be highly specific and technical. Include: subject, composition, camera angle, lens type, lighting setup, color palette, mood, and style.
- If photographic: specify camera (e.g. Sony A7III), lens (e.g. 85mm f/1.4), lighting (e.g. softbox key light, rim light), shot type (e.g. medium close-up, bird's eye view).
- If graphic design / poster: specify layout style, typography mood (e.g. bold sans-serif), color scheme, visual hierarchy, design era (e.g. modern minimalist, brutalist, Swiss grid).
- If infographic: specify data visualization style, icon style, color coding, layout grid.
- Output only the prompt. No explanation, no quotes, no labels.

Article title: ${title}
Keywords: ${keywords}
Article excerpt: ${excerpt}`;

        return await model.generateContent(imagePromptInstruction);
      }

      // CREATE CONTENT
      const fungsi = sanitize(body.fungsi);
      const kataKunci = sanitize(body.kataKunci);
      const lokasi = sanitize(body.lokasi || "Indonesia");
      const artikelContoh = sanitize(body.artikelContoh);
      const selectedStyle = sanitize(body.selectedStyle) || "solution";
      const minW = parseInt(body.minWords) || 600;
      const maxW = parseInt(body.maxWords) || 1200;
      const lang = sanitize(body.contentLang) || "ID";

      const langInstruction = lang === "ID"
        ? "Write the entire response in Bahasa Indonesia."
        : `Write the entire response in ${lang} language.`;

      const STYLE_NAMES: Record<string, string> = {
        review: "Review / Listicle",
        announcement: "New Feature / Announcement",
        solution: "Problem / Solution",
        comparison: "Comparison / Ranking",
        other: "Free / Custom",
      };

      const styleInstruction = STYLE_INSTRUCTIONS[selectedStyle] ?? STYLE_INSTRUCTIONS["solution"];
      const styleNameLabel = STYLE_NAMES[selectedStyle] ?? "Problem / Solution";

      const prompt = CREATE_SYSTEM_PROMPT
        .replace("{LANG_INSTRUCTION}", langInstruction)
        .replace("{FUNGSI}", fungsi)
        .replace("{KATA_KUNCI}", kataKunci)
        .replace("{LOKASI}", lokasi)
        .replace("{MIN_WORDS}", minW.toString())
        .replace("{MAX_WORDS}", maxW.toString())
        .replace("{ARTIKEL_CONTOH}", artikelContoh || "None provided.")
        .replace("{SELECTED_STYLE_NAME}", styleNameLabel)
        .replace("{SELECTED_STYLE_INSTRUCTION}", styleInstruction)
        .replace("{SOFT_SELLING_BLOCK}", body.softSelling ? SOFT_SELLING_BLOCK : "")
        .replace("{FAQ_INSTRUCTION}", body.includeFaq !== false ? FAQ_ON : FAQ_OFF);

      return body.type === "create"
        ? await model.generateContentStream(prompt)
        : await model.generateContent(prompt);
    };

    let result;
    try {
      result = await generateWithKey(key1);
    } catch (error: any) {
      const status = error?.status;
      if ((status === 429 || status === 401) && key2) {
        console.log(`Key1 failed with ${status}, retrying with Key2 for user ${username}`);
        try {
          result = await generateWithKey(key2);
        } catch (retryError: any) {
          throw retryError;
        }
      } else {
        throw error;
      }
    }

    if (body.type === "humanize") {
      const response = await (result as any).response;
      return NextResponse.json({ humanized: response.text().trim() });
    }

    if (body.type === "fix") {
      const response = await (result as any).response;
      return NextResponse.json({ rewritten: response.text().trim() });
    }

    if (body.type === "image_prompt") {
      const response = await (result as any).response;
      return NextResponse.json({ prompt: response.text().trim() });
    }

    if (body.type === "create" || !body.type) {
      const stream = new ReadableStream({
        async start(controller) {
          try {
            if ("stream" in (result as any)) {
              for await (const chunk of (result as any).stream) {
                controller.enqueue(new TextEncoder().encode(chunk.text()));
              }
            } else {
              const response = await (result as any).response;
              controller.enqueue(new TextEncoder().encode(response.text()));
            }
            controller.close();
          } catch (e) {
            controller.error(e);
          }
        },
      });

      return new Response(stream, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    return NextResponse.json({ error: "Invalid request type" }, { status: 400 });

  } catch (error: unknown) {
    console.error("Generate Error:", error);
    const userMessage = getErrorMessage(error);
    return NextResponse.json({ error: userMessage }, { status: 500 });
  }
}
