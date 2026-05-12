"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Clipboard,
  Trash2,
  Sparkles,
  FileText,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  AlertCircle,
  Copy,
  PlusCircle,
  Cpu,
  Edit3,
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
  params: Record<string, string | number>;
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
  // Image Generation States
  const [isImageSectionExpanded, setIsImageSectionExpanded] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isPromptLoading, setIsPromptLoading] = useState(false);

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

  const loadingInterval = useRef<NodeJS.Timeout | null>(null);
  const statusInterval = useRef<NodeJS.Timeout | null>(null);

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
      setImagePrompt("");
      setGeneratedImageUrl("");
      setImageError(false);
    } else {
      setSentenceInput("");
      setSentenceOutput("");
    }
    setMessage("");
  };



  const useReviewExample = () => setArtikelContoh(`第三方实测｜电商 AI 作图乱象丛生，电商卖家应该怎么选？

当下电商视觉生产已进入 AI 时代，但对千万卖家而言，选对工具远比盲目使用更重要。笔者以第三方评测身份，耗时一月实测 12 款主流 AI 作图工具，覆盖通用型与垂直电商类，发现行业痛点集中爆发：通用 AI 不懂电商，垂直工具难用不稳，真正贴合卖家需求的产品寥寥无几。

通用型 AI 如 Midjourney、Stable Diffusion 虽画质惊艳，但本质是艺术创作工具，对淘宝、天猫平台规则几乎无理解。生成主图常出现尺寸不合规、商品变形、颜色偏差等问题，且需撰写复杂提示词，普通卖家难以驾驭，出图可用率不足 30%。更致命的是，其生成内容无商用版权保障，极易引发侵权纠纷，完全无法适配电商合规需求。

转向垂直电商 AI 后，问题依旧突出。多数小团队开发的工具存在三大硬伤：一是出图质量差，服装版型僵硬、商品质感模糊，细节经不起推敲；二是交互繁琐，参数设置复杂、批量功能薄弱，多 SKU 商家效率极低；三是稳定性差，服务器频繁崩溃、功能停更，甚至出现开发商失联情况，商家数据与资产毫无保障。不少卖家反馈，花钱订阅后却因工具难用被迫弃用，最终回归传统拍摄，成本与周期问题依旧无解。

在一众工具中，潮际好麦表现尤为突出。其核心优势首先源于强大背景——由阿里系核心团队创立，技术沉淀深厚，自研电商专用 AI 模型，绝非小团队试水之作。与安踏、百丽、北面等国内外知名品牌的深度合作，更成为其品质背书，大品牌对出图精度、版权安全、数据稳定的严苛要求，是对产品实力的最好验证。

从实测效果看，潮际好麦完美解决行业痛点。其一，电商原生适配，模型基于百万级爆款图训练，无需复杂提示词，上传商品图即可自动生成符合淘宝规范的主图、白底图、详情套图，尺寸精准、无牛皮癣、转化率导向。其二，出图质量顶尖，商品还原度超 98%，服装垂感、面料纹理、金属光泽高度逼真，无 AI 违和感，媲美专业商拍。其三，操作极简高效，界面简洁易上手，支持批量换场景、换模特、换色，多 SKU 处理效率提升 300%。其四，服务与安全可靠，7×12 小时专属售后，商用版权清晰，长期迭代更新，彻底消除商家"跑路焦虑"。

对比可见，潮际好麦既避开通用 AI 的电商盲区，又解决普通垂直工具的质量与稳定性缺陷。对电商卖家而言，视觉工具的核心是"好用、稳定、靠谱"，而这正是潮际好麦的核心竞争力，也是其能在乱象中突围的关键。`);



  const useFeatureExample = () => setArtikelContoh(`AI 电商视觉再进化！潮际好麦商品套图 2.0 上线，百货电商图生成效率翻倍

在电商行业竞争日趋白热化的当下，视觉内容已成为决定商品点击率与转化率的核心要素。传统商拍模式成本高、周期长、多平台适配难，让众多中小商家与品牌方苦不堪言。近期，专业级 AI 电商营销内容创作平台潮际好麦迎来重磅升级，其王牌功能商品套图正式迭代至 2.0 版本，图片可用率大幅提升至 80%，为电商商家带来全新的视觉内容生产解决方案。

潮际好麦商品套图 2.0 在 1.0 版本基础上实现三大核心突破，新增 AI 帮写提示词、自定义语言主题色字体、自定义套图三大功能，彻底解决商家不会写提示词、出图风格不统一、模板不贴合需求等痛点。无需复杂操作，上传商品白底图或随手实拍图，即可一键生成完整电商素材。

本次升级中，百货电商图生成成为一大亮点，完美适配家居日用、五金小件、餐厨用品、收纳家纺等全品类百货商品。针对百货商品材质多样、细节复杂的特点，潮际好麦优化算法模型，精准还原金属质感、陶瓷光泽、布艺纹理等细节，光线、色调、构图智能匹配，让普通百货商品呈现出专业棚拍级效果。广东、福建、江苏等百货电商产业带商家实测反馈，以往拍摄一套百货商品图需花费数百元且等待数日，如今使用潮际好麦，10 分钟即可生成全套高清素材，成本降低 90% 以上，上新效率显著提升。

操作流程上，商品套图 2.0 进一步简化，新手也能快速上手。第一步进入顶部菜单栏商品图，商品套图功能入口；第二步最多上传 5 张高清商品图，建议选择主体完整、光线均匀的素材；第三步填写商品信息，包含名称、卖点、场景、材质等，若不会描述可直接使用 AI 帮写功能；第四步进行个性化设置，支持 13 个销售地区、9 种语言切换，目标平台扩充至 14 个，主题色、字体风格可自定义；最后选择标准或高级生成模式，即可快速获得整套商品图。

随着 AI 技术在电商领域的深度应用，视觉内容生产正迎来革命性变革。潮际好麦商品套图 2.0 以强大的功能、极简的操作、超高的出图质量，成为电商商家的必备工具，推动电商视觉生产进入全新时代。`);
  const useSolutionExample = () => setArtikelContoh(`Uji Coba Pihak Ketiga | Kekacauan AI untuk Pembuatan Gambar E-Commerce, Bagaimana Penjual Harus Memilih?

Saat ini, produksi visual e-commerce telah memasuki era AI. Namun bagi jutaan penjual, memilih alat yang tepat jauh lebih penting daripada sekadar menggunakan secara acak. Penulis, dalam kapasitas sebagai pihak ketiga, menghabiskan satu bulan untuk menguji 12 alat AI populer untuk pembuatan gambar, mencakup tipe umum dan vertikal khusus e-commerce. Hasilnya menunjukkan titik sakit industri meledak: AI umum tidak memahami e-commerce, alat vertikal sulit digunakan dan tidak stabil, dan hanya sedikit produk yang benar-benar memenuhi kebutuhan penjual.

AI umum seperti Midjourney dan Stable Diffusion memang menghasilkan kualitas gambar memukau, tetapi sejatinya adalah alat seni digital dan hampir tidak memahami aturan platform seperti Taobao atau Tokopedia. Masalah yang sering muncul: ukuran gambar tidak sesuai, produk tampak terdistorsi, warna menyimpang, dan tingkat keberhasilan gambar kurang dari 30%. Lebih parah, konten yang dihasilkan tidak memiliki lisensi komersial, rawan sengketa hak cipta, dan sama sekali tidak sesuai dengan kebutuhan kepatuhan e-commerce.

Berpindah ke AI e-commerce vertikal tetap tidak lepas dari masalah. Mayoritas alat yang dikembangkan oleh tim kecil memiliki tiga kelemahan utama: kualitas gambar rendah dengan tekstur produk buram, interaksi rumit dengan batch processing yang lemah, dan stabilitas buruk dengan server yang sering crash. Banyak penjual membayar langganan tapi akhirnya kembali ke metode fotografi tradisional karena alat yang sulit digunakan.

Di antara semua alat, 潮际好麦 tampil menonjol. Didirikan oleh tim inti dari ekosistem Alibaba, memiliki akumulasi teknologi mendalam, dan mengembangkan model AI khusus e-commerce secara mdaniri, bukan percobaan tim kecil. Kolaborasi dengan merek besar domestik dan internasional seperti Anta, Belle, dan The North Face menjadi jaminan kualitas; tuntutan ketat mereka terhadap akurasi gambar, keamanan hak cipta, dan stabilitas data membuktikan kekuatan produk.

Dari uji coba nyata, 潮际好麦 menyelesaikan semua masalah utama industri. Adaptasi asli e-commerce: model dilatih dengan jutaan gambar produk populer, cukup unggah gambar produk untuk menghasilkan gambar utama dan halaman detail sesuai stdanar platform. Kualitas gambar terbaik dengan tingkat akurasi reproduksi produk lebih dari 98%, tanpa kesan AI, setara fotografi profesional. Operasi sederhana dan efisien dengan efisiensi multi-SKU meningkat 300%. Layanan dan keamanan terpercaya dengan layanan pelanggan 7×12 jam dan lisensi komersial yang jelas.

Dari perbdaningan terlihat bahwa 潮际好麦 menghindari blind spot AI umum di e-commerce sekaligus mengatasi kelemahan kualitas dan stabilitas alat vertikal biasa. Bagi penjual e-commerce, inti alat visual adalah mudah digunakan, stabil, dan dapat didanalkan — dan itulah keunggulan kompetitif inti 潮际好麦.`);

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

  const handleAutoGenerateImagePrompt = async (title: string, keywords: string, article: string) => {
    setIsPromptLoading(true);
    try {
      const excerpt = article.substring(0, 300);
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "image_prompt",
          title,
          kataKunci: keywords,
          articleExcerpt: excerpt,
          model
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.prompt) {
          setImagePrompt(data.prompt);
        }
      }
    } catch (err) {
      console.error("Failed to generate image prompt", err);
    } finally {
      setIsPromptLoading(false);
    }
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

          // Post-parse tags using indexOf for reliability
          const fullTrimmed = fullText.trim();
          const DELIM_ARTIKEL = "<<<ARTIKEL>>>";
          const DELIM_META = "<<<META>>>";
          const DELIM_SLUG = "<<<SLUG>>>";

          const artikelStart = fullTrimmed.indexOf(DELIM_ARTIKEL);
          const metaStart = fullTrimmed.indexOf(DELIM_META);
          const slugStart = fullTrimmed.indexOf(DELIM_SLUG);

          const article = artikelStart !== -1 && metaStart !== -1
            ? fullTrimmed.slice(artikelStart + DELIM_ARTIKEL.length, metaStart).trim()
            : fullTrimmed;

          const meta = metaStart !== -1 && slugStart !== -1
            ? fullTrimmed.slice(metaStart + DELIM_META.length, slugStart).trim()
            : "";

          const slug = slugStart !== -1
            ? fullTrimmed.slice(slugStart + DELIM_SLUG.length).trim()
            : "";

          setArticleOutput(article);
          setMetaOutput(meta);
          setSlugOutput(slug);

          const historyResult: GenerationResult = {
              id: Date.now(),
              timestamp: new Date().toLocaleTimeString(),
              type: "create",
              article,
              meta,
              slug,
              params: { fungsi, kataKunci }
          };
          setHistory(prev => [historyResult, ...prev].slice(0, 5));

          const firstLine = article.split("\n")[0].replace(/^#+\s*/, "").trim();
          handleAutoGenerateImagePrompt(firstLine || kataKunci, kataKunci, article);
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
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Error generating content.");
    } finally {
      stopLoadingAnimation();
    }
  };




  const handleGenerateImage = () => {
    const promptToUse = imagePrompt;
    if (!promptToUse) return;

    setIsImageLoading(true);
    setImageError(false);

    const encodedPrompt = encodeURIComponent(promptToUse);
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=630&nologo=true&seed=${Date.now()}`;

    setGeneratedImageUrl(url);
  };

  const handleDownloadImage = async () => {
    if (!generatedImageUrl) return;
    try {
      const response = await fetch(generatedImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slugOutput || "generated-image"}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Failed to download image", err);
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
                    {/* model selector - v2 */}
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                    <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                    <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
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
                      <div className="flex space-x-2 mt-1">
                        <button onClick={useReviewExample} className="text-[10px] px-2 py-1 rounded-full border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors">{t("buttons.sample_review")}</button>
                        <button onClick={useFeatureExample} className="text-[10px] px-2 py-1 rounded-full border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors">{t("buttons.sample_feature")}</button>
                        <button onClick={useSolutionExample} className="text-[10px] px-2 py-1 rounded-full border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors">{t("buttons.sample_solution")}</button>
                      </div>
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
                  <div className="mt-8 border-t pt-6">
                    <button
                      onClick={() => setIsImageSectionExpanded(!isImageSectionExpanded)}
                      className="flex items-center justify-between w-full text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <div className="flex items-center font-bold text-sm">
                        <ImageIcon size={18} className="mr-2" />
                        {t("image_gen.title")}
                      </div>
                      {isImageSectionExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>

                    {isImageSectionExpanded && (
                      <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">{t("image_gen.prompt_label")}</label>
                          <div className="flex space-x-2">
                            <div className="flex-1 relative">
                              <textarea
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none"
                                value={imagePrompt}
                                onChange={(e) => setImagePrompt(e.target.value)}
                                placeholder={isPromptLoading ? "Generating prompt..." : ""}
                              />
                              {isPromptLoading && (
                                <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg">
                                  <RotateCcw size={16} className="animate-spin text-blue-600" />
                                </div>
                              )}
                            </div>
                            <button
                              onClick={handleGenerateImage}
                              disabled={isImageLoading || !imagePrompt}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                            >
                              {isImageLoading ? <RotateCcw size={14} className="animate-spin mr-2" /> : <Sparkles size={14} className="mr-2" />}
                              {t("image_gen.generate_button")}
                            </button>
                          </div>
                        </div>

                        {generatedImageUrl && (
                          <div className="space-y-4">
                            <div className="relative rounded-lg overflow-hidden border bg-gray-50 aspect-video flex items-center justify-center">
                              {isImageLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                                  <RotateCcw size={32} className="animate-spin text-blue-600" />
                                </div>
                              )}
                              {imageError ? (
                                <div className="text-center p-6">
                                  <AlertCircle size={32} className="mx-auto text-red-500 mb-2" />
                                  <p className="text-sm text-gray-600 mb-4">{t("image_gen.error")}</p>
                                  <button
                                    onClick={handleGenerateImage}
                                    className="text-blue-600 text-sm font-bold hover:underline flex items-center mx-auto"
                                  >
                                    <RotateCcw size={14} className="mr-1" /> {t("image_gen.retry")}
                                  </button>
                                </div>
                              ) : (
                                <img
                                  src={generatedImageUrl}
                                  alt="Generated"
                                  className={cn("w-full h-full object-cover transition-opacity duration-300", isImageLoading ? "opacity-0" : "opacity-100")}
                                  onLoad={() => setIsImageLoading(false)}
                                  onError={() => {
                                    setIsImageLoading(false);
                                    setImageError(true);
                                  }}
                                />
                              )}
                            </div>
                            <button
                              onClick={handleDownloadImage}
                              className="w-full border-2 border-gray-100 hover:border-gray-200 py-2 rounded-lg text-sm font-bold text-gray-600 flex items-center justify-center transition-colors"
                            >
                              <Download size={16} className="mr-2" /> {t("image_gen.download_button")}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
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
