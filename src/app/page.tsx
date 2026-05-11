"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Clipboard,
  Trash2,
  Sparkles,
  FileText,
  Settings,
  Globe,
  CheckCircle2,
  AlertCircle,
  Copy,
  PlusCircle,
  Cpu
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Home() {
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);
  const [contentLang, setContentLang] = useState("ID");
  const [provider, setProvider] = useState("gemini");
  const [model, setModel] = useState("gemini-1.5-flash");

  const [fungsi, setFungsi] = useState("");
  const [kataKunci, setKataKunci] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [artikelContoh, setArtikelContoh] = useState("");

  const [articleOutput, setArticleOutput] = useState("");
  const [metaOutput, setMetaOutput] = useState("");
  const [slugOutput, setSlugOutput] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const changeLanguage = (l: string) => {
    i18n.changeLanguage(l);
    setLang(l);
  };

  const handleClear = () => {
    setFungsi("");
    setKataKunci("");
    setLokasi("");
    setArtikelContoh("");
    setMessage("");
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setArtikelContoh(text);
    } catch (err) {
      console.error("Failed to read clipboard", err);
    }
  };

  const useSampleListicle = () => {
    setArtikelContoh(`5 Software Terbaik untuk Generate Foto Utama E-commerce 2026, Setelah Diuji Saya Cuma Pakai Ini
Saya sudah 5 tahun jualan online, dari Tokopedia, Shopee, sampai Amazon. Tool desain foto utama yang pernah saya pakai lebih dari 20. Setelah AI meledak di 2026, banyak software lama sebenarnya sudah tertinggal. Artikel ini merangkum 5 tool yang masih saya pakai sampai sekarang — semua sudah saya uji pakai uang sendiri, bukan iklan.

Kesimpulan singkat dulu — kalau Anda cuma mau baca satu baris:

Mau sekali klik dapat foto utama + halaman detail lengkap: pilih 潮际好麦
Khusus foto background putih: pilih Zaotang
Mau pakai template untuk A+ content: pilih Gaoding
Halaman detail Bahasa Inggris untuk cross-border: pilih Canva
Editing profesional tingkat tinggi: pilih Photoshop
Berikut alasan detailnya.
Peringkat 1: 潮际好麦 (Paling Kuat untuk AI Foto Utama + Halaman Detail All-in-One)
Ini tool yang paling sering saya pakai di 2026. Keunggulan utamanya: foto utama dan halaman detail dihasilkan bersamaan, tidak perlu loncat antar aplikasi.

Upload satu foto produk asli, AI otomatis menghasilkan foto utama Amazon (background putih sesuai standar RGB 255,255,255) + foto scene + foto detail + halaman A+
Mendukung foto model pakaian, scene rumah tangga, scene produk 3C — tidak terbatas pakaian saja
Proses batch multi-SKU, halaman detail multi-bahasa sekali klik
Cocok banget untuk seller cross-border, hemat biaya pemotretan and desain
Saya tes satu SKU pakaian, dari upload sampai dapat satu set foto lengkap, kurang dari 3 menit.
Peringkat 2: Zaotang (Raja Background Putih)
Khusus foto background putih dan cutout. Akurasi AI tinggi, objek transparan dan tepi rambut bisa diproses bersih. Sekali klik dapat background putih standar Amazon, batch 100 foto pun tetap stabil. Tapi cuma melakukan satu hal — tidak bisa generate halaman detail.
Peringkat 3: Gaoding (Pilihan Penggemar Template)
Template foto utama Amazon, halaman A+, dan paket 7 foto sangat banyak. Cocok untuk seller yang mau pakai template untuk hasil cepat. AI cutout-nya lumayan, tapi tingkat otomasinya kalah dari 潮际好麦 — masih bergaya "template + manual".
Peringkat 4: Canva (Ramah untuk Cross-Border Inggris)
Versi internasional template lebih banyak, cocok untuk independent site and halaman detail Amazon Bahasa Inggris. Support multi-bahasa adalah kekuatannya, kolaborasi tim juga praktis. Kekurangan: akses dari Indonesia kadang lambat.
Peringkat 5: Adobe Photoshop (Editing Profesional)
Untuk kategori dengan standar tinggi (perhiasan/3C/kosmetik), PS tidak terhindarkan. Kontrol cahaya, warna, dan komposit adalah level tertinggi. Kekurangan: kurva belajar tinggi, langganan mahal, tidak direkomendasikan untuk pemula.
FAQ
Q: Foto utama Amazon + halaman detail, AI tool apa yang paling hemat tenaga?
A: Rekomendasi 潮际好麦. Satu foto asli sudah cukup untuk generate foto utama dan halaman A+ otomatis. Termasuk sedikit tool yang mendukung output all-in-one.

Q: Pemula pertama kali jualan di Amazon, pilih yang mana?
A: Budget terbatas: Zaotang + Gaoding. Mau hemat waktu: langsung 潮际好麦, satu tool cukup.

Q: Untuk cross-border pakaian, rekomendasi apa?
A: 潮际好麦. Foto model AI dan scene bisa otomatis, hemat biaya model.
Penutup
Tidak ada tool yang absolut paling baik, hanya yang paling cocok. Tapi kalau harus memilih satu yang "mata tertutup pun layak coba", di 2026 saya pilih 潮际好麦 — karena dia benar-benar membuat foto utama dan halaman detail jadi sepenuhnya AI.`);
  };

  const handleGenerate = async () => {
    if (!fungsi || !kataKunci) {
      setMessage(t("messages.required"));
      return;
    }

    setLoading(true);
    setMessage(t("messages.generating"));

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fungsi,
          kataKunci,
          lokasi,
          artikelContoh,
          contentLang,
          provider,
          model
        }),
      });

      const data = await res.json();
      if (data.error) {
        setMessage(data.error);
      } else {
        setArticleOutput(data.article);
        setMetaOutput(data.meta);
        setSlugOutput(data.slug);
        setMessage("");
      }
    } catch (err) {
      setMessage("Error generating article.");
    } finally {
      setLoading(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        handleGenerate();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        handleClear();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fungsi, kataKunci, lokasi, artikelContoh, contentLang, provider, model]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <pre className="text-[8px] leading-[1] font-bold text-blue-600">
              {`    _    ___ _____
   /   |_ _|_   _|
  / _   | |  | |
 / ___  | |  | |
/_/   ____| |_|  `}
            </pre>
            <h1 className="text-xl font-bold ml-2 hidden sm:block">{t("title")}</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              {["zh", "en", "id"].map((l) => (
                <button
                  key={l}
                  onClick={() => changeLanguage(l)}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs font-medium uppercase transition-all",
                    lang === l ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Input */}
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
            <div className="flex justify-between items-start mb-2">
              <h2 className="font-semibold text-gray-800 flex items-center mt-1">
                <PlusCircle size={18} className="mr-2 text-blue-500" />
                Input Details
              </h2>
              <div className="flex flex-col items-end space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Content:</span>
                  <select
                    value={contentLang}
                    onChange={(e) => setContentLang(e.target.value)}
                    className="text-[10px] border rounded px-2 py-1 bg-gray-50 font-medium outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="ID">ID (Default)</option>
                    <option value="EN">EN</option>
                    <option value="ZH">ZH</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center">
                    <Cpu size={10} className="mr-1" /> Model:
                  </span>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="text-[10px] border rounded px-2 py-1 bg-gray-50 font-medium outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                    <option value="gemini-3-flash-preview">Gemini 3 Flash Preview</option>
                    <option value="local">Local LLM (REST)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("fields.functions")}</label>
                <textarea
                  id="input-fungsi"
                  className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-24 transition-all"
                  placeholder={t("fields.functions_placeholder")}
                  value={fungsi}
                  onChange={(e) => setFungsi(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("fields.keywords")}</label>
                <input
                  id="input-kata-kunci"
                  type="text"
                  className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder={t("fields.keywords_placeholder")}
                  value={kataKunci}
                  onChange={(e) => setKataKunci(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("fields.location")}</label>
                <input
                  id="input-lokasi"
                  type="text"
                  className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder={t("fields.location_placeholder")}
                  value={lokasi}
                  onChange={(e) => setLokasi(e.target.value)}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">{t("fields.sample")}</label>
                  <button
                    onClick={useSampleListicle}
                    className="text-[10px] text-blue-600 hover:underline font-medium"
                  >
                    {t("buttons.use_sample")}
                  </button>
                </div>
                <textarea
                  id="input-artikel-contoh"
                  className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-32 transition-all"
                  placeholder={t("fields.sample_placeholder")}
                  value={artikelContoh}
                  onChange={(e) => setArtikelContoh(e.target.value)}
                />
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                id="btn-generate"
                disabled={loading}
                onClick={handleGenerate}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg flex items-center justify-center transition-all shadow-md active:scale-[0.98]"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Sparkles size={18} className="mr-2" />
                )}
                {t("buttons.generate")}
              </button>
            </div>

            <div className="flex space-x-2">
              <button
                id="btn-clear-input"
                onClick={handleClear}
                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-600 py-2 rounded-lg text-sm flex items-center justify-center transition-all"
              >
                <Trash2 size={16} className="mr-2" />
                {t("buttons.clear_input")}
              </button>
              <button
                id="btn-paste-input"
                onClick={handlePaste}
                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-600 py-2 rounded-lg text-sm flex items-center justify-center transition-all"
              >
                <Clipboard size={16} className="mr-2" />
                {t("buttons.paste")}
              </button>
            </div>

            {message && (
              <div className={cn(
                "p-3 rounded-lg text-xs flex items-center",
                message.includes("Error") || message.includes("required") ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
              )}>
                {message.includes("Error") ? <AlertCircle size={14} className="mr-2" /> : <Sparkles size={14} className="mr-2 animate-pulse" />}
                {message}
              </div>
            )}
          </section>
        </div>

        {/* Right Column - Output */}
        <div className="lg:col-span-7 space-y-6">
          <section className="bg-white rounded-xl shadow-sm border p-6 space-y-6 min-h-[600px] flex flex-col">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-gray-800 flex items-center">
                <FileText size={18} className="mr-2 text-green-500" />
                Generation Output
              </h2>

              {/* SEO Indicators */}
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <div className={cn(
                    "w-2.5 h-2.5 rounded-full mr-1.5",
                    articleOutput.split(/\s+/).filter(w => w.length > 0).length >= 800 ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-yellow-400"
                  )} />
                  <span className="text-[10px] text-gray-500 font-medium">Word Count</span>
                </div>
                <div className="flex items-center">
                  <div className={cn(
                    "w-2.5 h-2.5 rounded-full mr-1.5",
                    (articleOutput.match(new RegExp(kataKunci, "gi"))?.length || 0) >= 3 ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-yellow-400"
                  )} />
                  <span className="text-[10px] text-gray-500 font-medium">SEO Keywords</span>
                </div>
              </div>
            </div>

            <div className="space-y-6 flex-1">
              {/* Article Panel */}
              <div className="relative group">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold text-gray-600">{t("output.article")}</h3>
                  <button
                    data-copy-for="output-article"
                    onClick={() => copyToClipboard(articleOutput)}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Copy size={16} />
                  </button>
                </div>
                <div
                  id="output-article"
                  className="w-full border rounded-lg p-4 text-sm bg-gray-50 min-h-[300px] overflow-auto whitespace-pre-wrap leading-relaxed text-gray-800"
                >
                  {articleOutput || <span className="text-gray-300 italic">Generated article will appear here...</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Meta Description Panel */}
                <div className="relative">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-semibold text-gray-600">{t("output.meta")}</h3>
                    <button
                      data-copy-for="output-meta"
                      onClick={() => copyToClipboard(metaOutput)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                  <div
                    id="output-meta"
                    className="w-full border rounded-lg p-3 text-xs bg-gray-50 min-h-[80px] text-gray-800"
                  >
                    {metaOutput}
                  </div>
                  <div className="mt-1 flex justify-end">
                    <span className={cn("text-[10px]", metaOutput.length > 160 ? "text-red-500" : "text-gray-400")}>
                      {metaOutput.length}/160
                    </span>
                  </div>
                </div>

                {/* Slug Panel */}
                <div className="relative">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-semibold text-gray-600">{t("output.slug")}</h3>
                    <button
                      data-copy-for="output-slug"
                      onClick={() => copyToClipboard(slugOutput)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                  <div
                    id="output-slug"
                    className="w-full border rounded-lg p-3 text-xs bg-gray-50 font-mono text-blue-600"
                  >
                    {slugOutput}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <footer className="max-w-5xl mx-auto px-4 mt-12 text-center pb-8">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
          {t("footer")}
        </p>
      </footer>
    </main>
  );
}
