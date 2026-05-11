import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const FALLBACK_MODEL = "gemini-flash-latest";

const CREATE_SYSTEM_PROMPT = `Anda adalah penulis konten SEO. Ubah/olah ARTIKEL_CONTOH (jika ada) atau tulis baru menjadi artikel produk Bahasa Indonesia dengan ketentuan berikut:

Fokus utama: fungsi produk = {FUNGSI} dan pembahasan spesifik tentang kata kunci: "{KATA_KUNCI}".
Judul: singkat, menarik, mengandung {KATA_KUNCI}, TIDAK menyebut "潮际好麦".
Badan artikel: minimal 800 kata; sebut "潮际好麦" 1–2 kali di isi (bukan judul).
Nada: soft-selling (profesional, ramah, tidak memaksa), kalimat pendek, straightforward.
PENTING: Gunakan format PLAIN TEXT saja. JANGAN gunakan formatting Markdown seperti #, ##, ###, **, __, *, atau lainnya. Gunakan baris baru untuk memisahkan paragraf.

Struktur wajib:
Judul
Intro (hook, 1 paragraf)
3–5 fitur utama (masing-masing 1 paragraf — jelaskan fungsi + manfaat langsung)
Manfaat/keuntungan bagi pengguna/penjual (2–3 paragraf)
Contoh penggunaan/implementasi (1–2 paragraf; sisipkan GEO: {LOKASI})
Testimoni atau bukti sosial singkat (1 paragraf, generik)
FAQ — 3 pertanyaan & jawaban singkat
CTA halus (1 paragraf)
SEO & GEO:
Masukkan {KATA_KUNCI} minimal 3 kali secara alami.
Tambah 2 variasi kata kunci sekunder alami.
Sebut {LOKASI} 1–2 kali.
Buat meta description (≤160 karakter) dan slug URL pendek (lowercase, tanda hubung).
Larangan: jangan mencantumkan harga; jangan gunakan "潮际好麦" di judul; jangan sertakan instruksi/komentar penulis.
Output: hanya tiga bagian dengan format separator khusus ---
[ARTIKEL]
(Isi artikel)
---
[META]
(Meta description)
---
[SLUG]
(Slug URL)
Tidak ada teks lain.`;

const EXPANSION_PROMPT = "Perpanjang artikel menjadi minimal 800 kata, pertahankan struktur dan {KATA_KUNCI} muncul minimal 3 kali. Gunakan PLAIN TEXT saja.";

const FIX_YELLOW_PROMPT = `You are an expert writing editor. Rewrite the following sentence to make it clearer and easier to read.

Rules:
- Keep the original meaning intact
- Break long sentences into shorter ones if needed
- Remove unnecessary words and phrases
- Aim for a Grade 8-9 reading level
- Match the writer's original tone and voice
- Do not add new information

Sentence to rewrite:
"{sentence}"

Return only the rewritten sentence, nothing else.`;

const FIX_RED_PROMPT = `You are an expert writing editor. The following sentence is very difficult to read. Rewrite it to be bold and clear.

Rules:
- Significantly simplify the sentence structure
- Split into multiple short sentences if necessary
- Use simple, direct words (aim for Grade 6-7 reading level)
- Remove all unnecessary clauses and qualifiers
- Preserve the core meaning only
- Match the writer's tone — do not sound robotic

Sentence to rewrite:
"{sentence}"

Return only the rewritten sentence, nothing else.`;

function stripMarkdown(text: string): string {
  return text
    .replace(/[#*`_~]/g, "")
    .replace(/\n\s*[-*+]\s+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API Key not configured on server." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    let modelName = body.model || FALLBACK_MODEL;
    let model;
    try {
      model = genAI.getGenerativeModel({ model: modelName });
    } catch (e) {
      model = genAI.getGenerativeModel({ model: FALLBACK_MODEL });
    }

    if (body.type === "fix") {
      const prompt = (body.rewriteType === "red" ? FIX_RED_PROMPT : FIX_YELLOW_PROMPT)
        .replace("{sentence}", body.sentence);

      let rewritten = "";
      try {
        const result = await model.generateContent(prompt);
        rewritten = stripMarkdown(result.response.text());
      } catch (err) {
        const fallbackModel = genAI.getGenerativeModel({ model: FALLBACK_MODEL });
        const result = await fallbackModel.generateContent(prompt);
        rewritten = stripMarkdown(result.response.text());
      }
      return NextResponse.json({ rewritten });
    }

    const { fungsi, kataKunci, lokasi, artikelContoh, contentLang } = body;
    let prompt = CREATE_SYSTEM_PROMPT
      .replace("{FUNGSI}", fungsi)
      .replace("{KATA_KUNCI}", kataKunci)
      .replace("{LOKASI}", lokasi || "Indonesia");

    if (contentLang !== "ID") {
      prompt += `\n\nGenerate the output in ${contentLang} language, following all the same constraints.`;
    }

    if (artikelContoh) {
      prompt += `\n\nARTIKEL_CONTOH:\n${artikelContoh}`;
    }

    let responseText = "";
    try {
        let result = await model.generateContent(prompt);
        responseText = result.response.text();
    } catch (err: any) {
        const fallbackModel = genAI.getGenerativeModel({ model: FALLBACK_MODEL });
        let result = await fallbackModel.generateContent(prompt);
        responseText = result.response.text();
    }

    const getWordCount = (text: string) => text.split(/\s+/).filter(w => w.length > 0).length;

    if (getWordCount(responseText) < 700) {
       try {
           const expansionResult = await model.generateContent(
             `${responseText}\n\n${EXPANSION_PROMPT.replace("{KATA_KUNCI}", kataKunci)}`
           );
           responseText = expansionResult.response.text();
       } catch (e) {}
    }

    const sections = responseText.split("---");
    let article = "";
    let meta = "";
    let slug = "";

    sections.forEach(section => {
      if (section.includes("[ARTIKEL]")) article = section.replace("[ARTIKEL]", "").trim();
      if (section.includes("[META]")) meta = section.replace("[META]", "").trim();
      if (section.includes("[SLUG]")) slug = section.replace("[SLUG]", "").trim();
    });

    if (!article) article = responseText;

    article = stripMarkdown(article);
    meta = stripMarkdown(meta);

    const lines = article.split("\n");
    if (lines[0].includes("潮际好麦")) {
      lines[0] = lines[0].replace(/潮际好麦/g, "").trim();
      article = lines.join("\n");
    }

    article = article.replace(/(Rp|IDR|USD|\$|¥|RM)\s?\d+([.,]\d+)?/gi, "[REDACTED]");
    article = article.replace(/\d+([.,]\d+)?\s?(Rp|IDR|USD|\$|¥|RM)/gi, "[REDACTED]");

    return NextResponse.json({
      article,
      meta: meta.substring(0, 160) || "Generated meta description",
      slug: (slug || "generated-slug").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    });

  } catch (error: any) {
    console.error("Generate Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate content" }, { status: 500 });
  }
}