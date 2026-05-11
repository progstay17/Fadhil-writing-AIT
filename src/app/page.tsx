"use client";

import { useState, useEffect, useRef } from "react";
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
  Wand2,
  Hash,
  Download,
  History,
  RotateCcw
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GenerationResult {
  id: number;
  timestamp: string;
  type: "create" | "fix";
  article?: string;
  meta?: string;
  slug?: string;
  rewritten?: string;
  params: any;
}

export default function Home() {
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);
  const [activeTab, setActiveTab] = useState("create");

  // Create Content States
  const [contentLang, setContentLang] = useState("ID");
  const [model, setModel] = useState("gemini-2.5-flash");
  const [minWords, setMinWords] = useState(600);
  const [maxWords, setMaxWords] = useState(1200);
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

  // History State
  const [history, setHistory] = useState<GenerationResult[]>([]);

  // UI States
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [message, setMessage] = useState("");

  const loadingInterval = useRef<any>(null);
  const statusInterval = useRef<any>(null);

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
      setArticleOutput("");
      setMetaOutput("");
      setSlugOutput("");
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
A: 潮际好麦. Foto model AI dan scene bisa otomatis, hemat biaya model.
Penutup
Tidak ada tool yang absolut paling baik, hanya yang paling cocok. Tapi kalau harus memilih satu yang "mata tertutup pun layak coba", di 2026 saya pilih 潮际好麦 — karena dia benar-benar membuat foto utama dan halaman detail jadi sepenuhnya AI.`);
  };

  const startLoadingAnimation = () => {
    setProgress(0);
    const texts = ["Menulis artikel...", "Mengecek SEO...", "Menyusun meta...", "Optimalisasi brand...", "Menyelesaikan..."];
    let textIdx = 0;
    setStatusText(texts[0]);

    loadingInterval.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev;
        const inc = Math.random() * 10;
        return Math.min(prev + inc, 98);
      });
    }, 1500);

    statusInterval.current = setInterval(() => {
      textIdx = (textIdx + 1) % texts.length;
      setStatusText(texts[textIdx]);
    }, 3000);
  };

  const stopLoadingAnimation = () => {
    if (loadingInterval.current) clearInterval(loadingInterval.current);
    if (statusInterval.current) clearInterval(statusInterval.current);
    setProgress(100);
    setTimeout(() => { setProgress(0); setLoading(false); }, 500);
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
    setMessage("");
    startLoadingAnimation();

    try {
      const body = activeTab === "create"
        ? { type: "create", fungsi, kataKunci, lokasi, artikelContoh, contentLang, model, minWords, maxWords }
        : { type: "fix", sentence: sentenceInput, rewriteType, model };

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to generate");
      }

      if (activeTab === "create") {
          setArticleOutput("");
          setMetaOutput("");
          setSlugOutput("");

          const reader = res.body?.getReader();
          if (!reader) throw new Error("No reader found");

          let fullText = "";
          const decoder = new TextDecoder();

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            fullText += chunk;

            // Incrementally parse if possible, or just update the raw article for now
            setArticleOutput(prev => prev + chunk);
          }

          // Post-parse tags
          const article = fullText.split("<<<ARTIKEL>>>")[1]?.split("<<<META>>>")[0] || "";
          const meta = fullText.split("<<<META>>>")[1]?.split("<<<SLUG>>>")[0] || "";
          const slug = fullText.split("<<<SLUG>>>")[1] || "";

          if (article) {
              setArticleOutput(article.trim());
              setMetaOutput(meta.trim());
              setSlugOutput(slug.trim());

              // Add to history
              const result: GenerationResult = {
                  id: Date.now(),
                  timestamp: new Date().toLocaleTimeString(),
                  type: "create",
                  article: article.trim(),
                  meta: meta.trim(),
                  slug: slug.trim(),
                  params: { fungsi, kataKunci }
              };
              setHistory(prev => [result, ...prev].slice(0, 5));
          }
      } else {
          const data = await res.json();
          setSentenceOutput(data.rewritten);

          // Add to history
          const result: GenerationResult = {
              id: Date.now(),
              timestamp: new Date().toLocaleTimeString(),
              type: "fix",
              rewritten: data.rewritten,
              params: { sentence: sentenceInput.substring(0, 30) + "..." }
          };
          setHistory(prev => [result, ...prev].slice(0, 5));
      }
    } catch (err: any) {
      setMessage(err.message || "Error generating content.");
    } finally {
      stopLoadingAnimation();
    }
  };

  const restoreHistory = (item: GenerationResult) => {
      setActiveTab(item.type);
      if (item.type === "create") {
          setArticleOutput(item.article || "");
          setMetaOutput(item.meta || "");
          setSlugOutput(item.slug || "");
      } else {
          setSentenceOutput(item.rewritten || "");
      }
  };

  const downloadFile = (content: string, ext: string) => {
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `article-${slugOutput || "output"}.${ext}`;
      link.click();
      URL.revokeObjectURL(url);
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
  }, [fungsi, kataKunci, lokasi, artikelContoh, contentLang, model, activeTab, sentenceInput, rewriteType, minWords, maxWords]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      {/* Progress Bar Header */}
      {loading && (
          <div className="fixed top-0 left-0 w-full h-1 bg-gray-100 z-50 overflow-hidden">
              <div
                  className="h-full bg-blue-600 transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
              />
          </div>
      )}

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

      <div className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Input & History */}
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
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t("fields.content_lang")}</span>
                  <select
                    value={contentLang}
                    onChange={(e) => setContentLang(e.target.value)}
                    className="text-[10px] border rounded px-2 py-1 bg-gray-50 font-medium outline-none"
                  >
                    <option value="ID">ID</option>
                    <option value="EN">EN</option>
                    <option value="ZH">ZH</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center">
                    <Cpu size={10} className="mr-1" /> {t("fields.model_label")}
                  </span>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="text-[10px] border rounded px-2 py-1 bg-gray-50 font-medium outline-none"
                  >
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                    <option value="gemini-3-flash-preview">Gemini 3 Flash Preview</option>
                    <option value="gemini-flash-latest">Gemini Flash Latest</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {activeTab === "create" ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">{t("fields.min_words")}</label>
                      <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm" value={minWords} onChange={(e) => setMinWords(parseInt(e.target.value) || 0)} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">{t("fields.max_words")}</label>
                      <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm" value={maxWords} onChange={(e) => setMaxWords(parseInt(e.target.value) || 0)} />
                    </div>
                  </div>
                  <textarea className="w-full border rounded-lg p-3 text-sm h-20" placeholder={t("fields.functions_placeholder")} value={fungsi} onChange={(e) => setFungsi(e.target.value)} />
                  <input type="text" className="w-full border rounded-lg p-3 text-sm" placeholder={t("fields.keywords_placeholder")} value={kataKunci} onChange={(e) => setKataKunci(e.target.value)} />
                  <input type="text" className="w-full border rounded-lg p-3 text-sm" placeholder={t("fields.location_placeholder")} value={lokasi} onChange={(e) => setLokasi(e.target.value)} />
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-medium text-gray-500">{t("fields.sample")}</label>
                      <button onClick={useSampleListicle} className="text-[10px] text-blue-600 hover:underline">{t("buttons.use_sample")}</button>
                    </div>
                    <textarea className="w-full border rounded-lg p-3 text-sm h-24" placeholder={t("fields.sample_placeholder")} value={artikelContoh} onChange={(e) => setArtikelContoh(e.target.value)} />
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <textarea
                    className="w-full border rounded-lg p-4 text-sm h-48"
                    placeholder="Masukkan paragraf atau kalimat yang sulit dibaca di sini..."
                    value={sentenceInput}
                    onChange={(e) => setSentenceInput(e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setRewriteType("yellow")} className={cn("p-3 rounded-xl border-2 text-left", rewriteType === "yellow" ? "border-yellow-400 bg-yellow-50" : "border-gray-100")}>
                      <span className="font-bold text-sm block">🟡 {t("fields.yellow_label")}</span>
                      <span className="text-[10px] text-gray-500">{t("fields.yellow_desc")}</span>
                    </button>
                    <button onClick={() => setRewriteType("red")} className={cn("p-3 rounded-xl border-2 text-left", rewriteType === "red" ? "border-red-400 bg-red-50" : "border-gray-100")}>
                      <span className="font-bold text-sm block">🔴 {t("fields.red_label")}</span>
                      <span className="text-[10px] text-gray-500">{t("fields.red_desc")}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button id="btn-generate" disabled={loading} onClick={handleGenerate} className={cn("w-full text-white font-semibold py-3 rounded-lg flex items-center justify-center transition-all", activeTab === "create" ? "bg-blue-600" : "bg-orange-500")}>
              {loading ? <span className="flex items-center"><RotateCcw size={16} className="animate-spin mr-2" /> {statusText}</span> : <><Sparkles size={18} className="mr-2" /> {activeTab === "create" ? t("buttons.generate") : t("buttons.fix_now")}</>}
            </button>

            <div className="flex space-x-2">
              <button onClick={handleClear} className="flex-1 border py-2 rounded-lg text-sm flex items-center justify-center"><Trash2 size={14} className="mr-2" /> {t("buttons.clear_input")}</button>
              <button onClick={handlePaste} className="flex-1 border py-2 rounded-lg text-sm flex items-center justify-center"><Clipboard size={14} className="mr-2" /> {t("buttons.paste")}</button>
            </div>

            {message && <div className="p-3 rounded-lg text-xs bg-red-50 text-red-600 flex items-center"><AlertCircle size={14} className="mr-2" /> {message}</div>}
          </section>

          {/* History Panel */}
          {history.length > 0 && (
              <section className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
                  <h3 className="text-sm font-bold text-gray-700 flex items-center"><History size={16} className="mr-2" /> Recent Generations</h3>
                  <div className="space-y-2">
                      {history.map(item => (
                          <button key={item.id} onClick={() => restoreHistory(item)} className="w-full text-left p-2 hover:bg-gray-50 rounded border border-transparent hover:border-gray-200 transition-all">
                              <div className="flex justify-between items-center mb-1">
                                  <span className="text-[10px] font-bold text-blue-600 uppercase">{item.type}</span>
                                  <span className="text-[10px] text-gray-400">{item.timestamp}</span>
                              </div>
                              <p className="text-xs text-gray-600 truncate">{item.type === "create" ? item.params.kataKunci : item.params.sentence}</p>
                          </button>
                      ))}
                  </div>
              </section>
          )}
        </div>

        {/* Right Column - Output */}
        <div className="lg:col-span-7 space-y-6">
          <section className="bg-white rounded-xl shadow-sm border p-6 space-y-6 min-h-[600px] flex flex-col">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-gray-800 flex items-center">
                <FileText size={18} className="mr-2 text-green-500" />
                {activeTab === "create" ? t("output.generation_output") : t("output.fix_result")}
              </h2>

              {activeTab === "create" && articleOutput && (
                <div className="flex space-x-2">
                    <button onClick={() => downloadFile(articleOutput, "txt")} className="p-1.5 hover:bg-gray-100 rounded text-gray-500" title="Download .txt"><Download size={16} /></button>
                    <button onClick={() => downloadFile(articleOutput, "md")} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 font-bold text-xs" title="Download .md">MD</button>
                </div>
              )}
            </div>

            <div className="space-y-6 flex-1">
              {activeTab === "create" ? (
                <>
                  <div className="relative group">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-semibold text-gray-600">{t("output.article")}</h3>
                      <button onClick={() => copyToClipboard(articleOutput)} className="text-gray-400 hover:text-blue-600"><Copy size={16} /></button>
                    </div>
                    <div className="w-full border rounded-lg p-4 text-sm bg-gray-50 min-h-[400px] whitespace-pre-wrap text-gray-800">
                      {articleOutput || <span className="text-gray-300 italic">{t("output.rewritten_placeholder")}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xs font-semibold text-gray-600">{t("output.meta")}</h3>
                        <button onClick={() => copyToClipboard(metaOutput)} className="text-gray-400 hover:text-blue-600"><Copy size={12} /></button>
                      </div>
                      <div className="w-full border rounded-lg p-3 text-xs bg-gray-50 min-h-[60px]">{metaOutput}</div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xs font-semibold text-gray-600">{t("output.slug")}</h3>
                        <button onClick={() => copyToClipboard(slugOutput)} className="text-gray-400 hover:text-blue-600"><Copy size={12} /></button>
                      </div>
                      <div className="w-full border rounded-lg p-3 text-xs bg-gray-50 font-mono text-blue-600">{slugOutput}</div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="relative group flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-semibold text-gray-600">{t("output.rewritten_label")}</h3>
                    <button onClick={() => copyToClipboard(sentenceOutput)} className="text-gray-400 hover:text-orange-600"><Copy size={18} /></button>
                  </div>
                  <div className="w-full border rounded-xl p-6 text-lg font-medium bg-gray-50 flex-1 min-h-[400px] leading-relaxed text-gray-800">
                    {sentenceOutput || <span className="text-gray-300 italic">{t("output.rewritten_placeholder")}</span>}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      <footer className="max-w-5xl mx-auto px-4 mt-12 text-center pb-8">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">{t("footer")}</p>
      </footer>
    </main>
  );
}
