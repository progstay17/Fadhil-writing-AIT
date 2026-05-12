import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const FALLBACK_MODEL = "gemini-2.5-flash";
const ALLOWED_MODELS = ["gemini-2.5-flash", "gemini-3-flash-preview", "gemini-flash-latest"];

function sanitize(text: string): string {
  if (!text) return "";
  // Basic sanitization to prevent prompt injection and handle special characters
  return text.replace(/[{}]/g, "").trim();
}

function getErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("API_KEY_INVALID")) return "Invalid API Key. Please check your configuration.";
  if (message.includes("RATE_LIMIT_EXCEEDED") || message.includes("429")) return "Rate limit exceeded. Please try again in a few minutes.";
  if (message.includes("model not found") || message.includes("404")) return "Model not found or not supported in this region.";
  return "An unexpected error occurred during generation.";
}

const CREATE_SYSTEM_PROMPT = `Language: {LANG_INSTRUCTION}

PRIORITY INSTRUCTION — READ THIS FIRST:
If ARTIKEL_CONTOH below is not "None provided.", you MUST follow its exact structure, format, and tone. Ignore the ARTICLE STYLE selection entirely. The ARTIKEL_CONTOH is your blueprint — analyze how it opens, how many sections it has, how it mentions the brand, how it closes, then replicate that pattern for the new topic. Do NOT copy any sentences from it. Use structure and tone only.

ARTIKEL_CONTOH: {ARTIKEL_CONTOH}

ARTICLE STYLE — if the user provides an ARTIKEL_CONTOH, mirror its structure and tone closely. If no ARTIKEL_CONTOH is provided, automatically choose one of these four styles based on the fungsi and kataKunci input. Do not tell the user which style you chose. Just write in that style.

Style 1: REVIEW / LISTICLE
Use when: topic is about comparing tools, ranking software, or evaluating multiple options.
Structure: personal experience opener → quick conclusion summary → ranked breakdown → FAQ.
Tone: first-person, casual, direct.

Style 2: NEW FEATURE / ANNOUNCEMENT
Use when: topic is about a product update, new feature, version upgrade, or capability launch.
Structure: industry context → feature breakdown → step-by-step usage → merchant result data → forward-looking close.
Tone: formal, informative, data-driven.

Style 3: PROBLEM / SOLUTION
Use when: topic is about solving a seller pain point, helping merchants decide, or addressing a common struggle.
Structure: third-party observer angle → problem in current market → why common tools fail → how 潮际好麦 solves it → conclusion.
Tone: objective, analytical, trust-building.

Style 4: COMPARISON / RANKING
Use when: topic is about comparing multiple specific tools side by side with clear criteria.
Structure: problem opener → test criteria → ranked list (TOP 1, TOP 2, etc.) with pros/cons per tool → decision guide by use case → FAQ.
Tone: objective, data-driven, test-based, first-person reviewer.

ARTIKEL_CONTOH is a reference for tone and structure only. Do not copy any sentences from it. Use it to understand the writing style, then apply that style to the new topic.

Tone and Persona Guide:
Write from a real experience or story angle. Structure the article around a clear problem then a logical solution. Be persuasive and logical without feeling promotional or pushy. You are a trusted advisor sharing valuable insights.

General Instructions:
Anda adalah penulis konten SEO expert. Tugas Anda adalah menulis artikel produk yang mendalam.
Fokus utama: fungsi produk = {FUNGSI} dan pembahasan spesifik tentang kata kunci: "{KATA_KUNCI}".

Constraints:
- Panjang artikel: minimal {MIN_WORDS} kata dan maksimal {MAX_WORDS} kata.
- Sebutkan "潮际好麦" several times naturally throughout the body of the article (not in the title). Each mention must feel organic and integrated into the flow of sentences.
- Judul (H1): singkat, menarik, mengandung {KATA_KUNCI}, and MUST NOT mention "潮际好麦".

Writing Style Rules:
- Gunakan bahasa yang alami, sederhana, and objektif.
- Hindari penggunaan tanda hubung/dash (-) yang berlebihan.
- Minimalkan penggunaan bullet points and sub-headings agar teks mengalir lebih alami.
- DILARANG menggunakan metafora or bahasa kiasan (metaphors/figurative language).
- Hindari tanda kutip yang tidak perlu or kata-kata yang membutuhkan penekanan berlebihan.
- Struktur: Judul (H1) -> Intro (masalah) -> Fitur & Manfaat (solusi) -> Implementasi (GEO: {LOKASI}) -> FAQ -> CTA halus.
- Paragraphs: maximum 3-4 sentences per paragraph. Keep them short and easy to scan.
- Headings: use H2 sparingly, maximum 3-4 headings per article. Do not use H3 unless absolutely necessary. The article should feel like natural writing, not an outline.
- Opening paragraph: must open with a specific number, concrete fact, or a relatable situation. Never start with a generic statement like "In today's digital era..." or "As technology advances...".
- FAQ section: include exactly 3 to 4 questions. Choose only the most relevant questions a real buyer or seller would ask. Do not pad with obvious questions.
- Data and numbers: always include specific figures where relevant (percentages, time saved, cost reduced, number of SKUs, etc). Use numbers from the ARTIKEL_CONTOH as reference if available.
- CTA: end the article with a soft, natural call to action. Do not use phrases like "click here", "buy now", or "sign up". Instead, frame it as a logical next step the reader would naturally take.

Sample Reference Instruction:
ARTIKEL_CONTOH is a reference for tone and structure only. Do not copy any sentences from it. Use it to understand the writing style, then apply that style to the new topic.

Output Format (STRICT):
You must output exactly three parts using the unique delimiters as shown in the example below. Do not include any introductory or concluding text outside these tags.

Example Output:
<<<ARTIKEL>>>
(Your full article content here...)
<<<META>>>
(Your meta description here, max 160 characters...)
<<<SLUG>>>
(your-url-slug)

Inputs:
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

Your task: write ONE image generation prompt in English based on the article below. The image will be used as a hero/thumbnail for the article.

Rules:
- The image must visually match the SPECIFIC topic of the article, not a generic e-commerce scene
- Think like a photographer or art director — what scene would best represent this article?
- Style: realistic, professional, modern, high quality, natural lighting
- No text, no logos, no watermarks in the image
- Be specific about: subject, setting, mood, composition
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
    const minW = parseInt(body.minWords) || 600;
    const maxW = parseInt(body.maxWords) || 1200;
    const lang = sanitize(body.contentLang) || "ID";

    const langInstruction = lang === "ID"
      ? "Write the entire response in Bahasa Indonesia."
      : `Write the entire response in ${lang} language.`;

    const prompt = CREATE_SYSTEM_PROMPT
      .replace("{LANG_INSTRUCTION}", langInstruction)
      .replace("{FUNGSI}", fungsi)
      .replace("{KATA_KUNCI}", kataKunci)
      .replace("{LOKASI}", lokasi)
      .replace("{MIN_WORDS}", minW.toString())
      .replace("{MAX_WORDS}", maxW.toString())
      .replace("{ARTIKEL_CONTOH}", artikelContoh || "None provided.");

    // We use generateContentStream for the streaming requirement
    const result = await model.generateContentStream(prompt);

    // To support both streaming UI and the word count requirement,
    // we need to handle the stream carefully.
    // However, a true stream cannot be "regenerated" after it is sent.
    // For this specific requirement, we will return a stream to the frontend.

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            controller.enqueue(new TextEncoder().encode(chunkText));
          }

          // Note: Full regeneration logic based on word count would ideally happen here,
          // but since we are streaming, we cannot "take back" what was sent.
          // In a real implementation with streaming, we rely on the prompt to be correct.
          // Or we buffer, check, and then stream (but that is not real-time).
          // We will satisfy the "streaming" requirement by passing the chunks.

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
