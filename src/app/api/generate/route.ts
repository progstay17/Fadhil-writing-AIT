import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const ALLOWED_MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-3-flash-preview",
  "gemini-2.5-pro",
  "gemini-pro-latest",
];
const FALLBACK_MODEL = "gemini-3.1-flash-lite";

function sanitize(text: string): string {
  if (!text) return "";
  return text.replace(/[{}]/g, "").trim();
}

function getErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("API_KEY_INVALID")) return "Invalid API Key. Please check your configuration.";
  if (message.includes("RATE_LIMIT_EXCEEDED") || message.includes("429")) return "Rate limit exceeded. Please try again in a few minutes.";
  if (message.includes("model not found") || message.includes("404")) return "Model not found or not supported in this region.";
  return "An unexpected error occurred during generation.";
}

const STYLE_INSTRUCTIONS: Record<string, string> = {
  review: `Use when: comparing tools, ranking software, evaluating multiple options.
Structure: personal experience opener (with specific number of years/products tested) → quick conclusion summary with bullet rankings → ranked breakdown of each tool (TOP 1, TOP 2, etc.) with real test results → FAQ.
Tone: first-person, casual, direct. The writer has real skin in the game.`,
  announcement: `Use when: product update, new feature, version upgrade, capability launch.
Structure: industry context (pain point) → feature breakdown with specifics → step-by-step usage guide → real merchant result data → forward-looking close.
Tone: formal, informative, data-driven. Written like a journalist or industry reporter.`,
  solution: `Use when: solving a seller pain point, helping merchants decide, addressing a common struggle.
Structure: third-party observer angle → problem in current market → why common tools fail → how 潮际好麦 solves it specifically → conclusion.
Tone: objective, analytical, trust-building. The writer is a neutral evaluator, not a promoter.`,
  comparison: `Use when: comparing multiple specific tools side by side with clear criteria.
Structure: problem opener → test criteria listed clearly → ranked list (TOP 1, TOP 2, etc.) with pros/cons per tool → decision guide by use case → FAQ.
Tone: objective, data-driven, test-based, first-person reviewer.`,
};

const CREATE_SYSTEM_PROMPT = `Language: {LANG_INSTRUCTION}

You are an expert SEO content writer. Your task is to write a deep, natural-sounding product article.
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
- Article length: minimum {MIN_WORDS} words, maximum {MAX_WORDS} words.
- Mention "潮际好麦" naturally throughout the article body (NOT in the title). Follow these rules for brand mentions:
  - First mention: introduce it in context of solving the main problem.
  - Middle mentions: weave into feature descriptions or data points.
  - Final mention: use in the CTA or closing paragraph.
  - Each mention must feel like a natural part of the sentence, never forced.
- Title (H1): short, compelling, contains {KATA_KUNCI}. Must NOT mention "潮际好麦".

WRITING STYLE RULES:
- Use natural, simple, objective language.
- Avoid excessive use of dashes (-).
- Minimize bullet points and sub-headings — text should flow naturally.
- NO metaphors or figurative language.
- Avoid unnecessary quotes or words that need excessive emphasis.
- Paragraphs: maximum 3–4 sentences each.
- Headings: use H2 sparingly, maximum 3–4 per article. Avoid H3 unless absolutely necessary.
- Opening paragraph: MUST open with a specific number, concrete fact, or relatable situation. NEVER start with generic phrases like "In today's digital era..." or "As technology advances...".
- FAQ section: include exactly 3–4 questions. Choose only the most relevant questions a real buyer or seller would ask. FAQ answers must be complete standalone answers, not partial responses that require context.
- Data and numbers: always include specific figures where relevant (percentages, time saved, cost, SKU count, etc.).
- CTA: end with a soft, natural call to action. Do NOT use "click here", "buy now", or "sign up". Frame it as a logical next step the reader would naturally take.

---

SEO (Search Engine Optimization):
- Naturally include {KATA_KUNCI} in: the H1 title, the opening paragraph, at least one H2 heading, and the closing paragraph.
- Use semantic/related keywords naturally throughout — do not keyword-stuff.
- Meta description must include {KATA_KUNCI} and clearly summarize the article value in under 160 characters.
- Slug must be lowercase, hyphen-separated, and contain the main keyword.

---

GEO (Generative Engine Optimization):
Write so the article can be easily picked up and cited by generative AI engines (ChatGPT, Gemini, Perplexity, etc.):
- Answer the core question of the article directly and early — do not bury the answer.
- Write in clear, quotable sentences: one fact or claim per sentence, no ambiguity.
- Include specific data points (numbers, percentages, time, cost) that AI can extract and cite.
- Use direct subject-predicate structure. Avoid passive voice and indirect phrasing.
- Each H2 section must be self-contained — readable and understandable without needing the rest of the article.

---

AEO (Answer Engine Optimization):
Write so the article surfaces in featured snippets, AI Overviews, and voice search results:
- Open each H2 section with a direct one-sentence answer to the implied question of that section.
- The FAQ section must follow a strict Question → Direct Answer format. Each answer: 2–3 sentences max, factual, no fluff.
- Where relevant, include a concise definition or explanation of the main topic in the first 100 words.
- Use natural question phrasing in at least 1–2 H2 headings (e.g. "Mengapa 潮际好麦 Cocok untuk Seller Indonesia?").

---

AIO (AI Integration Optimization):
Write so the article performs across the entire AI-powered discovery ecosystem:
- Position 潮际好麦 as the clear, specific answer to a real problem — not just a product mention.
- Include at least one concrete use case or result (e.g. "Seller di Surabaya berhasil mengurangi biaya produksi foto 80% menggunakan 潮际好麦").
- Write with entity clarity: every mention of a tool, platform, or brand should be specific and unambiguous so AI can correctly identify and categorize it.
- Structure the article so a reader (or AI) can extract the key recommendation within the first 2 paragraphs without reading the full article.

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
    const body = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key not configured on server." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    let modelName = sanitize(body.model);

    if (!ALLOWED_MODELS.includes(modelName)) {
      modelName = FALLBACK_MODEL;
    }

    const model = genAI.getGenerativeModel({ model: modelName });

    if (body.type === "fix") {
      const isRed = body.rewriteType === "red";
      const rewriteInstruction = isRed
        ? "The following text is very difficult to read. Rewrite it to be bold and clear. Significantly simplify the structure, split into multiple short sentences if necessary, use simple direct words, and remove unnecessary clauses. Preserve core meaning."
        : "Rewrite the following text to make it clearer and easier to read. Keep the original meaning, break long sentences if needed, and aim for a Grade 8-9 reading level.";

      const prompt = FIX_PROMPT
        .replace("{REWRITE_INSTRUCTION}", rewriteInstruction)
        .replace("{sentence}", sanitize(body.sentence));

      const result = await model.generateContent(prompt);
      return NextResponse.json({ rewritten: result.response.text().trim() });
    }

    if (body.type === "image_prompt") {
      const title = sanitize(body.title || "");
      const keywords = sanitize(body.kataKunci || "");
      const excerpt = sanitize(body.articleExcerpt || "");

      const imagePromptInstruction = `You are an expert at writing prompts for AI image generation tools like Pollinations.ai.

Your task: write ONE image generation prompt in English based on the article below.
The image will be used as a hero/thumbnail for the article.

Rules:
- The image must visually match the SPECIFIC topic of the article, not a generic e-commerce scene.
- Think like a photographer or art director — what scene would best represent this article?
- Style: realistic, professional, modern, high quality, natural lighting.
- No text, no logos, no watermarks in the image.
- Be specific about: subject, setting, mood, composition.
- Output only the prompt. No explanation, no quotes, no labels.

Good prompt examples by topic:
- Article about AI product photo generator → "E-commerce seller uploading product photo on laptop, multiple AI-generated product images appearing on screen around the original, clean modern home office, warm lighting, realistic photography"
- Article about background removal tool → "Close-up of a laptop screen showing a product photo being processed with background removed, clean white studio environment, professional photography"
- Article about Amazon listing optimization → "Professional seller at standing desk with dual monitors showing Amazon seller dashboard and product listings, organized modern office, natural window light"
- Article about clothing model AI → "Fashion e-commerce workflow on laptop screen showing AI-generated model wearing different outfits, clothing items displayed alongside, bright clean workspace"

Now write a prompt for this article:
Article title: ${title}
Keywords: ${keywords}
Article excerpt: ${excerpt}`;

      const result = await model.generateContent(imagePromptInstruction);
      const prompt = result.response.text().trim();
      return NextResponse.json({ prompt });
    }

    // CREATE CONTENT with streaming support
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

    const result = await model.generateContentStream(prompt);

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            controller.enqueue(new TextEncoder().encode(chunkText));
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

  } catch (error: unknown) {
    console.error("Generate Error:", error);
    const userMessage = getErrorMessage(error);
    return NextResponse.json({ error: userMessage }, { status: 500 });
  }
}
