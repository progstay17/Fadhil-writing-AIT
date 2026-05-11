import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `Anda adalah penulis konten SEO. Ubah/olah ARTIKEL_CONTOH (jika ada) atau tulis baru menjadi artikel produk Bahasa Indonesia dengan ketentuan berikut:

Fokus utama: fungsi produk = {FUNGSI} dan pembahasan spesifik tentang kata kunci: "{KATA_KUNCI}".
Judul: singkat, menarik, mengandung {KATA_KUNCI}, TIDAK menyebut "潮际好麦".
Badan artikel: minimal 800 kata; sebut "潮际好麦" 1–2 kali di isi (bukan judul).
Nada: soft-selling (profesional, ramah, tidak memaksa), kalimat pendek, straightforward.
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

const EXPANSION_PROMPT = "Perpanjang artikel menjadi minimal 800 kata, pertahankan struktur dan {KATA_KUNCI} muncul minimal 3 kali.";

export async function POST(req: NextRequest) {
  try {
    const { fungsi, kataKunci, lokasi, artikelContoh, contentLang, model: requestedModel } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API Key not configured on server." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Attempt to use requested model, fallback to 1.5-flash if it looks like a gemini model but name might be wrong
    let modelName = requestedModel || "gemini-1.5-flash";
    if (modelName === "local") {
        return NextResponse.json({ error: "Local LLM support is not fully implemented in this demo." }, { status: 501 });
    }

    // Note: The SDK might throw if model name is totally unknown.
    // We'll wrap in a try-catch to fallback.
    let model;
    try {
        model = genAI.getGenerativeModel({ model: modelName });
    } catch (e) {
        model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }

    let prompt = SYSTEM_PROMPT
      .replace("{FUNGSI}", fungsi)
      .replace("{KATA_KUNCI}", kataKunci)
      .replace("{LOKASI}", lokasi || "Indonesia");

    if (contentLang !== "ID") {
      prompt += `\n\nGenerate the output in ${contentLang} language, following all the same constraints.`;
    }

    if (artikelContoh) {
      prompt += `\n\nARTIKEL_CONTOH:\n${artikelContoh}`;
    }

    let result = await model.generateContent(prompt);
    let responseText = result.response.text();

    // Expansion logic
    const getWordCount = (text: string) => text.split(/\s+/).filter(w => w.length > 0).length;

    if (getWordCount(responseText) < 700) {
       const expansionResult = await model.generateContent(
         `${responseText}\n\n${EXPANSION_PROMPT.replace("{KATA_KUNCI}", kataKunci)}`
       );
       responseText = expansionResult.response.text();
    }

    // Parse
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

    // Post-processing
    // 1. No brand in title
    const lines = article.split("\n");
    if (lines[0].includes("潮际好麦")) {
      lines[0] = lines[0].replace(/潮际好麦/g, "").trim();
      article = lines.join("\n");
    }

    // 2. No prices
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
