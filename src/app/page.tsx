"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Clipboard,
  Trash2,
  Sparkles,
  FileText,
  Globe,
  CheckCircle2,
  AlertCircle,
  Copy,
  PlusCircle,
  Cpu,
  Edit3,
  Wand2
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Home() {
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);
  const [activeTab, setActiveTab] = useState("create"); // "create" or "fix"

  // Create Content States
  const [contentLang, setContentLang] = useState("ID");
  const [model, setModel] = useState("gemini-2.5-flash");
  const [fungsi, setFungsi] = useState("");
  const [kataKunci, setKataKunci] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [artikelContoh, setArtikelContoh] = useState("");
  const [articleOutput, setArticleOutput] = useState("");
  const [metaOutput, setMetaOutput] = useState("");
  const [slugOutput, setSlugOutput] = useState("");

  // Fix Sentence States
  const [sentenceInput, setSentenceInput] = useState("");
  const [sentenceOutput, setSentenceOutput] = useState("");
  const [rewriteType, setRewriteType] = useState<"yellow" | "red">("yellow");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const changeLanguage = (l: string) => {
    i18n.changeLanguage(l);
    setLang(l);
  };

  const handleClear = () => {
    if (activeTab === "create") {
      setFungsi("");
      setKataKunci("");
      setLokasi("");
      setArtikelContoh("");
    } else {
      setSentenceInput("");
      setSentenceOutput("");
    }
    setMessage("");
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (activeTab === "create") {
        setArtikelContoh(text);
      } else {
        setSentenceInput(text);
      }
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
A: 潮际好麦. Foto model AI and scene bisa otomatis, hemat biaya model.
Penutup
Tidak ada tool yang absolut paling baik, hanya yang paling cocok. Tapi kalau harus memilih satu yang "mata tertutup pun layak coba", di 2026 saya pilih 潮际好麦 — karena dia benar-benar membuat foto utama dan halaman detail jadi sepenuhnya AI.`);
  };

  const handleGenerate = async () => {
    if (activeTab === "create") {
      if (!fungsi || !kataKunci) {
        setMessage(t("messages.required"));
        return;
      }
    } else {
      if (!sentenceInput) {
        setMessage(t("messages.sentence_required"));
        return;
      }
    }

    setLoading(true);
    setMessage(activeTab === "create" ? t("messages.generating") : t("messages.fixing"));

    try {
      const body = activeTab === "create"
        ? { type: "create", fungsi, kataKunci, lokasi, artikelContoh, contentLang, model }
        : { type: "fix", sentence: sentenceInput, rewriteType, model };

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.error) {
        setMessage(data.error);
      } else {
        if (activeTab === "create") {
          setArticleOutput(data.article);
          setMetaOutput(data.meta);
          setSlugOutput(data.slug);
        } else {
          setSentenceOutput(data.rewritten);
        }
        setMessage("");
      }
    } catch (err) {
      setMessage("Error generating content.");
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
  }, [fungsi, kataKunci, lokasi, artikelContoh, contentLang, model, activeTab, sentenceInput, rewriteType]);

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

          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("create")}
                className={cn(
                  "px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center",
                  activeTab === "create" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"
                )}
              >
                <PlusCircle size={16} className="mr-2" />
                {t("tabs.create")}
              </button>
              <button
                onClick={() => setActiveTab("fix")}
                className={cn(
                  "px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center",
                  activeTab === "fix" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"
                )}
              >
                <Edit3 size={16} className="mr-2" />
                {t("tabs.fix")}
              </button>
            </nav>

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
          </div>
        </div>
      </header>

      {/* Mobile Tab Switcher */}
      <div className="md:hidden max-w-5xl mx-auto px-4 mt-4">
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("create")}
            className={cn(
              "flex-1 py-2 rounded-md text-sm font-medium transition-all",
              activeTab === "create" ? "bg-white shadow-sm text-blue-600" : "text-gray-500"
            )}
          >
            {t("tabs.create")}
          </button>
          <button
            onClick={() => setActiveTab("fix")}
            className={cn(
              "flex-1 py-2 rounded-md text-sm font-medium transition-all",
              activeTab === "fix" ? "bg-white shadow-sm text-blue-600" : "text-gray-500"
            )}
          >
            {t("tabs.fix")}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Input */}
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
            <div className="flex justify-between items-start mb-2">
              <h2 className="font-semibold text-gray-800 flex items-center mt-1">
                {activeTab === "create" ? (
                  <><PlusCircle size={18} className="mr-2 text-blue-500" /> {t("tabs.create")}</>
                ) : (
                  <><Edit3 size={18} className="mr-2 text-orange-500" /> {t("tabs.fix")}</>
                )}
              </h2>
              <div className="flex flex-col items-end space-y-2">
                {activeTab === "create" && (
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t("fields.content_lang")}</span>
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
                )}
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center">
                    <Cpu size={10} className="mr-1" /> {t("fields.model_label")}
                  </span>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="text-[10px] border rounded px-2 py-1 bg-gray-50 font-medium outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                    <option value="gemini-3-flash-preview">Gemini 3 Flash Preview</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {activeTab === "create" ? (
                <>
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
                </>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t("fields.original_sentence")}</label>
                    <textarea
                      className="w-full border rounded-lg p-4 text-sm focus:ring-2 focus:ring-orange-500 outline-none h-48 transition-all"
                      placeholder={t("fields.sentence_placeholder")}
                      value={sentenceInput}
                      onChange={(e) => setSentenceInput(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">{t("fields.edit_level")}</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setRewriteType("yellow")}
                        className={cn(
                          "p-3 rounded-xl border-2 transition-all text-left group",
                          rewriteType === "yellow" ? "border-yellow-400 bg-yellow-50" : "border-gray-100 hover:border-yellow-200"
                        )}
                      >
                        <div className="flex items-center mb-1">
                          <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2" />
                          <span className="font-bold text-sm">{t("fields.yellow_label")}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 leading-tight">{t("fields.yellow_desc")}</p>
                      </button>
                      <button
                        onClick={() => setRewriteType("red")}
                        className={cn(
                          "p-3 rounded-xl border-2 transition-all text-left group",
                          rewriteType === "red" ? "border-red-400 bg-red-50" : "border-gray-100 hover:border-red-200"
                        )}
                      >
                        <div className="flex items-center mb-1">
                          <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                          <span className="font-bold text-sm">{t("fields.red_label")}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 leading-tight">{t("fields.red_desc")}</p>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                id="btn-generate"
                disabled={loading}
                onClick={handleGenerate}
                className={cn(
                  "flex-1 text-white font-semibold py-3 rounded-lg flex items-center justify-center transition-all shadow-md active:scale-[0.98]",
                  activeTab === "create" ? "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400" : "bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300"
                )}
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  activeTab === "create" ? <Sparkles size={18} className="mr-2" /> : <Wand2 size={18} className="mr-2" />
                )}
                {activeTab === "create" ? t("buttons.generate") : t("buttons.fix_now")}
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
                message.includes("Error") || message.includes("required") || message.includes("Masukkan") || message.includes("enter") || message.includes("请输入") ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
              )}>
                {message.includes("Error") || message.includes("required") || message.includes("Masukkan") || message.includes("enter") || message.includes("请输入") ? <AlertCircle size={14} className="mr-2" /> : <Sparkles size={14} className="mr-2 animate-pulse" />}
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
                {activeTab === "create" ? t("output.generation_output") : t("output.fix_result")}
              </h2>

              {activeTab === "create" && (
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <div className={cn(
                      "w-2.5 h-2.5 rounded-full mr-1.5",
                      articleOutput.split(/\s+/).filter(w => w.length > 0).length >= 800 ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-yellow-400"
                    )} />
                    <span className="text-[10px] text-gray-500 font-medium">{t("output.word_count")}</span>
                  </div>
                  <div className="flex items-center">
                    <div className={cn(
                      "w-2.5 h-2.5 rounded-full mr-1.5",
                      (articleOutput.match(new RegExp(kataKunci, "gi"))?.length || 0) >= 3 ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-yellow-400"
                    )} />
                    <span className="text-[10px] text-gray-500 font-medium">{t("output.seo_keywords")}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6 flex-1">
              {activeTab === "create" ? (
                <>
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
                      {articleOutput || <span className="text-gray-300 italic">{t("output.rewritten_placeholder")}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>

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
                </>
              ) : (
                <div className="relative group flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-semibold text-gray-600">{t("output.rewritten_label")}</h3>
                    <button
                      onClick={() => copyToClipboard(sentenceOutput)}
                      className="text-gray-400 hover:text-orange-600 transition-colors"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                  <div
                    className={cn(
                      "w-full border rounded-xl p-6 text-lg font-medium bg-gray-50 flex-1 min-h-[400px] leading-relaxed text-gray-800 transition-all",
                      rewriteType === "yellow" ? "focus-within:ring-2 focus-within:ring-yellow-400" : "focus-within:ring-2 focus-within:ring-red-400"
                    )}
                  >
                    {sentenceOutput || <span className="text-gray-300 italic">{t("output.rewritten_placeholder")}</span>}
                  </div>
                </div>
              )}
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
