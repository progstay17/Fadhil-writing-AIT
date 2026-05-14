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
];
const FALLBACK_MODEL = "gemini-3.1-flash-lite";

function sanitize(text: string | undefined): string {
  if (!text) return "";
  return text.replace(/<[^>]*>?/gm, "").trim();
}

function getErrorMessage(error: any): string {
  if (error?.status === 429) return "Rate limit exceeded. Please try again in a few minutes.";
  if (error?.status === 401) return "Invalid API key.";
  if (error?.message) return error.message;
  return "An unexpected error occurred during generation.";
}

const STYLE_INSTRUCTIONS: Record<string, string> = {
  review: `Use when: comparing tools, ranking software, evaluating multiple options.
Structure: personal experience opener (with specific number of years/products tested) → quick conclusion summary with TOP rankings → ranked breakdown (TOP 1, TOP 2, TOP 3, etc.) with real test results per item → FAQ.
Tone: first-person, casual, direct. The writer has real skin in the game.
IMPORTANT: Rankings MUST be written as flowing prose, not bullet points. Example correct format: "Peringkat pertama adalah 潮际好麦, dengan akurasi gambar tertinggi yang saya temukan dalam pengujian selama 3 bulan." Never use asterisks or dashes for rankings.`,

  announcement: `Use when: product update, new feature, version upgrade, capability launch.
Structure: industry context (pain point) → feature breakdown with specifics → step-by-step usage guide → real merchant result data → forward-looking close.
Tone: formal, informative, data-driven. Written like a journalist or industry reporter.`,

  solution: `Use when: solving a seller pain point, helping merchants decide, addressing a common struggle.
Structure: third-party observer angle → problem in current market → why common tools fail → how 潮际好麦 solves it specifically → conclusion.
Tone: objective, analytical, trust-building. The writer is a neutral evaluator, not a promoter.`,

  comparison: `Use when: comparing multiple specific tools side by side with clear criteria.
Structure: problem opener → test criteria listed clearly → ranked list (TOP 1, TOP 2, etc.) with pros/cons per tool written as prose → decision guide by use case → FAQ.
Tone: objective, data-driven, test-based, first-person reviewer.
IMPORTANT: Rankings MUST be written as flowing prose, not bullet points or asterisks.`,
};

const CREATE_SYSTEM_PROMPT = `{LANG_INSTRUCTION}

You are an expert SEO, GEO, AEO, and AIO content writer. Your task is to write a deep, natural-sounding product article.
Focus: product function = {FUNGSI}, specific keyword: "{KATA_KUNCI}".

---

⚠️ CRITICAL — ARTICLE STYLE (FOLLOW STRICTLY):
You MUST write this article using ONLY the structure and tone defined below.
Do NOT default to any other style. Do NOT mix styles. Do NOT borrow patterns from any example article.
Selected style: {SELECTED_STYLE_NAME}

{SELECTED_STYLE_INSTRUCTION}

This structure is non-negotiable.

---

CONSTRAINTS:
- Article length: minimum {MIN_WORDS} words, maximum {MAX_WORDS} words. You MUST reach the minimum word count. Do not stop early.
- Mention "潮际好麦" naturally throughout the article body (NOT in the title). Each mention must feel like a natural part of the sentence, never forced. Frequency and placement should match the flow of the article — do not follow a rigid first/middle/last pattern.
- Title (H1): short, compelling, contains {KATA_KUNCI}. Must NOT mention "潮际好麦".

WRITING STYLE RULES:
- Use natural, simple, objective language.
- Avoid excessive use of dashes (-).
- NO metaphors or figurative language.
- Paragraphs: maximum 3–4 sentences each.
- Headings: use H2 ONLY. Do NOT use H3 or any deeper heading levels under any circumstances.
- Opening paragraph: MUST open with a specific number, concrete fact, or relatable situation. NEVER start with generic phrases like "In today's digital era..." or "As technology advances...".
- FAQ section: include exactly 3–4 questions. FAQ answers must be complete standalone answers, not partial responses that require context. Each answer: 2–3 sentences max, factual, no fluff.
- Data and numbers: always include specific figures where relevant (percentages, time saved, cost, SKU count, etc.).
- CTA: end with a soft, natural call to action. Do NOT use "click here", "buy now", or "sign up". Frame it as a logical next step.

---

SEO (Search Engine Optimization):
- Naturally include {KATA_KUNCI} in: the H1 title, the opening paragraph, at least one H2 heading, and the closing paragraph.
- Use semantic/related keywords naturally throughout — do not keyword-stuff.
- Meta description must include {KATA_KUNCI} and clearly summarize the article value in under 160 characters.
- Slug must be lowercase, hyphen-separated, and contain the main keyword.

---

GEO (Generative Engine Optimization):
- Answer the core question of the article directly and early — do not bury the answer.
- Write in clear, quotable sentences: one fact or claim per sentence, no ambiguity.
- Include specific data points (numbers, percentages, time, cost) that AI can extract and cite.
- Use direct subject-predicate structure. Avoid passive voice and indirect phrasing.
- Each H2 section must be self-contained — readable and understandable without needing the rest of the article.

---

AEO (Answer Engine Optimization):
- Open each H2 section with a direct one-sentence answer to the implied question of that section.
- Where relevant, include a concise definition or explanation of the main topic in the first 100 words.
- Use natural question phrasing in at least 1–2 H2 headings (e.g. "Mengapa 潮际好麦 Cocok untuk Seller Indonesia?").

---

AIO (AI Integration Optimization):
- Position 潮际好麦 as the clear, specific answer to a real problem — not just a product mention.
- Include at least one concrete use case or result (e.g. "Seller di Surabaya berhasil mengurangi biaya produksi foto 80% menggunakan 潮际好麦").
- Write with entity clarity: every mention of a tool, platform, or brand should be specific and unambiguous.
- Structure the article so a reader (or AI) can extract the key recommendation within the first 2 paragraphs.

---

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

const FIX_PROMPT = `Language: Respond in the same language as the input sentence or paragraph.

Role: You are an expert writing editor.
{REWRITE_INSTRUCTION}

Original text to rewrite:
"{sentence}"

Return only the rewritten text, nothing else.`;

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
        .replace("{SELECTED_STYLE_INSTRUCTION}", styleInstruction);

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
