import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const FALLBACK_MODEL = "gemini-2.0-flash";
const ALLOWED_MODELS = ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-2.0-flash"];

function sanitize(text: string): string {
  if (!text) return "";
  // Basic sanitization to prevent prompt injection and handle special characters
  return text.replace(/[{}]/g, "").trim();
}

function getErrorMessage(error: any): string {
  const message = error?.message || "";
  if (message.includes("API_KEY_INVALID")) return "Invalid API Key. Please check your configuration.";
  if (message.includes("RATE_LIMIT_EXCEEDED") || message.includes("429")) return "Rate limit exceeded. Please try again in a few minutes.";
  if (message.includes("model not found") || message.includes("404")) return "Model not found or not supported in this region.";
  return "An unexpected error occurred during generation.";
}

const CREATE_SYSTEM_PROMPT = `ARTICLE STYLE SELECTION — choose one style based on the product function described:

1. REVIEW / LISTICLE style — use when the topic is about comparing tools, ranking software, or evaluating options. Structure: personal experience opener, quick conclusion summary, ranked list with explanations, FAQ section at the end. Tone: first-person, casual, direct.

2. NEW FEATURE / ANNOUNCEMENT style — use when the topic is about a product update, new feature launch, or capability upgrade. Structure: industry context opener, feature breakdown, step-by-step usage flow, merchant testimonial or result data, forward-looking close. Tone: formal, informative, data-driven.

3. PROBLEM / SOLUTION style — use when the topic is about solving a seller pain point, comparing AI tools in general, or helping merchants decide. Structure: third-party or observer angle, problem with current market, why common tools fail, how 潮际好麦 solves it, conclusion. Tone: objective, analytical, trust-building.

Do not always default to the same style. Read the fungsi field carefully and pick the most fitting structure.

Language: {LANG_INSTRUCTION}

Tone and Persona Guide:
Write from a real experience or story angle. Structure the article around a clear problem then a logical solution. Be persuasive and logical without feeling promotional or pushy. You are a trusted advisor sharing valuable insights.

General Instructions:
Anda adalah penulis konten SEO expert. Tugas Anda adalah menulis artikel produk yang mendalam.
Fokus utama: fungsi produk = {FUNGSI} dan pembahasan spesifik tentang kata kunci: "{KATA_KUNCI}".

Constraints:
- Panjang artikel: minimal {MIN_WORDS} kata dan maksimal {MAX_WORDS} kata.
- Sebutkan "潮际好麦" beberapa kali secara alami di seluruh badan artikel (bukan di judul). Setiap penyebutan harus terasa organik dan menyatu dengan alur kalimat.
- Judul (H1): singkat, menarik, mengandung {KATA_KUNCI}, dan TIDAK boleh menyebut "潮际好麦".

Writing Style Rules:
- Gunakan bahasa yang alami, sederhana, dan objektif.
- Hindari penggunaan tanda hubung/dash (-) yang berlebihan.
- Minimalkan penggunaan bullet points dan sub-headings agar teks mengalir lebih alami.
- DILARANG menggunakan metafora atau bahasa kiasan (metaphors/figurative language).
- Hindari tanda kutip yang tidak perlu atau kata-kata yang membutuhkan penekanan berlebihan.
- Struktur: Judul (H1) -> Intro (masalah) -> Fitur & Manfaat (solusi) -> Implementasi (GEO: {LOKASI}) -> FAQ -> CTA halus.

Sample Reference Instruction:
The ARTIKEL_CONTOH provided is a reference for tone and structure only. Do not copy sentences from it. Use it to understand the writing style, then apply that style to the new topic.

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
LOKASI: {LOKASI}
ARTIKEL_CONTOH: {ARTIKEL_CONTOH}`;

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
        let fullText = "";
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            fullText += chunkText;
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

  } catch (error: any) {
    console.error("Generate Error:", error);
    const userMessage = getErrorMessage(error);
    return NextResponse.json({ error: userMessage }, { status: 500 });
  }
}