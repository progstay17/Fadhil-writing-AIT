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
  RotateCcw,
  Layout,
  Sun,
  Moon, LogOut
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GenerationResult {
  id: number;
  timestamp: string;
  type: "create" | "fix" | "humanize";
  article?: string;
  meta?: string;
  slug?: string;
  rewritten?: string;
  humanized?: string;
  params: Record<string, string | number>;
}

const SAMPLES = {
  review: "做电商 5 年,从淘宝做到亚马逊,我用过的主图设计工具不下 20 款。2026 年 AI 工具爆发后,很多老软件其实已经被淘汰了。这篇把我目前还在用的 5 款整理出来,都是真金白银测过的,不是广告。\n\n先说结论——如果你只看一句话：\n- 想一键出主图+详情页全套:选潮际好麦\n- 只做白底主图:选佐糖\n- 要套模板做 A+:选稿定设计\n- 跨境英文详情页:选 Canva\n- 专业精修:选 PS\n\n第 1 名:潮际好麦(AI 主图+详情页一体化最强)\n这是 wo 2026 年用得最多的一款。核心优势是主图和详情页一起出,不用在多个工具之间切来切去。\n上传一张产品原图,AI 自动输出亚马逊主图(白底合规 RGB 255,255,255)+ 场景图 + 细节图 + A+ 详情页。支持服装模特上身图、家居场景图、3C 产品场景图,不再局限于服装. 多 SKU 批量处理,多语言详情页一键出. 跨境卖家尤其适合,省掉拍摄和设计成本. 实测一个服装 SKU,从上传到拿到全套图,3 分钟不到。\n\n第 2 名:佐糖(白底抠图之王)",
  announcement: "重大更新！潮际好麦 AI 写作正式支持 3C 产品场景图生成。\n\n各位跨境卖家朋友，潮际好麦 AI 写作迎来了 2026 年度的重磅更新。除了大家熟悉的服装类目，我们现在正式上线了 3C 数码类目的场景图生成功能。\n\n这次更新解决了 3C 卖家的三大痛点：\n1. 渲染真实感：针对金属、玻璃材质进行了深度优化，反光效果更自然。\n2. 尺寸合规：自动适配亚马逊各个站点的图片尺寸要求。\n3. 批量处理：支持一键为 50 个 SKU 生成不同的生活方式场景图。\n\n现在登录后台，即可在“工具箱”中免费试用这一新功能。",
  solution: "为什么你的亚马逊 A+ 页面转化率低？这里有 3 个核心原因。\n\n很多卖家在做 A+ 页面时，往往陷入一个误区：觉得图片越多越好。但在 2026 年的移动端购物环境下，消费者的耐心只有 3 秒。\n\n如果你的 A+ 页面转化率低于 5%，请检查以下三点：\n1. 卖点不聚焦：首屏图片没有在 1 秒内告诉消费者“这个产品能解决我什么问题”。\n2. 缺乏使用场景：纯白底图无法建立情感连接。消费者需要看到产品在真实生活中的样子。\n3. 文字过于累赘：大段的描述在手机上很难阅读。建议使用“短句+图标”的排版方式。\n\n使用潮际好麦 AI 写作，可以一键生成符合以上逻辑的高转化 A+ 内容。",
  comparison: "2026 年最强 AI 写作工具测评：潮际好麦 vs ChatGPT vs Claude\n\n跨境电商卖家到底该选哪个 AI 写作工具？为了帮大家避坑，我们实测了市面上最火的三款产品。\n\n测评标准：亚马逊规则适配度、详情页排版逻辑、多语言地道程度。\n\n1. ChatGPT (GPT-5): 创意很强，但如果不给详细的 Prompt，输出的内容往往过于空洞，且不懂亚马逊的避雷词规则。\n2. Claude 3.5: 逻辑性极佳，适合写深度博客，但在生成详情页那种“短平快”的卖点描述时，略显臃肿。\n3. 潮际好麦: 专门为跨境卖家开发。优势在于内置了各品类的 A+ 模板和 SEO 逻辑，生成的文字直接能用，基本不需要二次修改。\n\n如果你是专业卖家，追求生产效率，潮际好麦无疑是首选。"
};

export default function Home() {
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);
  const [activeTab, setActiveTab] = useState<"create" | "fix" | "humanize">("create");
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Create Content States
  const [contentLang, setContentLang] = useState("ID");
  const [model, setModel] = useState("gemini-3.1-flash-lite");
  const [selectedStyle, setSelectedStyle] = useState("review");
  const [minWords, setMinWords] = useState(600);
  const [maxWords, setMaxWords] = useState(1200);
  const [fungsi, setFungsi] = useState("");
  const [kataKunci, setKataKunci] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [softSelling, setSoftSelling] = useState(false);
  const [includeFaq, setIncludeFaq] = useState(true);
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

  // Humanize States
  const [humanizeInput, setHumanizeInput] = useState("");
  const [humanizeOutput, setHumanizeOutput] = useState("");

  // History State
  const [history, setHistory] = useState<GenerationResult[]>([]);

  // UI States
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [message, setMessage] = useState("");

  const loadingInterval = useRef<NodeJS.Timeout | null>(null);
  const statusInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved = stored === 'dark' || (!stored && prefersDark) ? 'dark' : 'light';

    fetch("/api/auth/me")
      .then(res => { if (!res.ok) window.location.href = "/login"; })
      .catch(() => { window.location.href = "/login"; });

    setTheme(resolved);
    document.documentElement.classList.toggle('dark', resolved === 'dark');
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  const changeLanguage = (l: string) => {
    i18n.changeLanguage(l);
    setLang(l);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  const startLoadingAnimation = () => {
    setProgress(0);
    setStatusText(activeTab === "humanize" ? t("messages.humanizing") : (activeTab === "fix" ? t("messages.fixing") : t("messages.generating")));

    loadingInterval.current = setInterval(() => {
      setProgress(prev => (prev < 90 ? prev + 1 : prev));
    }, 200);

    const statuses = [
      t("messages.generating"),
      "Analyzing input requirements...",
      "Optimizing structure...",
      "Checking SEO guidelines...",
      "Applying tone of voice...",
      "Finalizing output..."
    ];
    let idx = 0;
    statusInterval.current = setInterval(() => {
      idx = (idx + 1) % statuses.length;
      setStatusText(activeTab === "humanize" ? t("messages.humanizing") : statuses[idx]);
    }, 3000);
  };

  const stopLoadingAnimation = () => {
    if (loadingInterval.current) clearInterval(loadingInterval.current);
    if (statusInterval.current) clearInterval(statusInterval.current);
    setLoading(false);
    setProgress(100);
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
    } else if (activeTab === "fix") {
      setSentenceInput("");
      setSentenceOutput("");
    } else if (activeTab === "humanize") {
      setHumanizeInput("");
      setHumanizeOutput("");
    }
    setMessage("");
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (activeTab === "create") {
        setArtikelContoh(text);
      } else if (activeTab === "fix") {
        setSentenceInput(text);
      } else if (activeTab === "humanize") {
        setHumanizeInput(text);
      }
    } catch (err) {
      console.error("Failed to read clipboard", err);
    }
  };

  const parseOutput = (fullText: string) => {
    const normalized = fullText.replace(/<<<\s*(ARTIKEL|META|SLUG)\s*>>>/gi, (_, tag) => `<<<${tag.toUpperCase()}>>>`);
    const DELIM_ARTIKEL = "<<<ARTIKEL>>>";
    const DELIM_META = "<<<META>>>";
    const DELIM_SLUG = "<<<SLUG>>>";

    const artikelStart = normalized.indexOf(DELIM_ARTIKEL);
    const metaStart = normalized.indexOf(DELIM_META);
    const slugStart = normalized.indexOf(DELIM_SLUG);

    if (artikelStart !== -1 && metaStart !== -1) {
      setArticleOutput(normalized.slice(artikelStart + DELIM_ARTIKEL.length, metaStart).trim());
    } else if (artikelStart !== -1) {
        setArticleOutput(normalized.slice(artikelStart + DELIM_ARTIKEL.length).trim());
    }
    if (metaStart !== -1 && slugStart !== -1) {
      setMetaOutput(normalized.slice(metaStart + DELIM_META.length, slugStart).trim());
    } else if (metaStart !== -1) {
        setMetaOutput(normalized.slice(metaStart + DELIM_META.length).trim());
    }
    if (slugStart !== -1) {
      setSlugOutput(normalized.slice(slugStart + DELIM_SLUG.length).trim());
    }
  };

  const handleGenerate = async () => {
    if (activeTab === "create") {
      if (!fungsi || !kataKunci) {
        setMessage(t("messages.required"));
        return;
      }
    } else if (activeTab === "fix") {
      if (!sentenceInput) {
        setMessage(t("messages.sentence_required"));
        return;
      }
    } else if (activeTab === "humanize") {
      if (!humanizeInput.trim()) {
        setMessage(t("messages.humanize_required"));
        return;
      }
    }

    setLoading(true);
    setMessage("");
    startLoadingAnimation();

    try {
      const body = activeTab === "create"
        ? { type: "create", fungsi, kataKunci, lokasi, artikelContoh, selectedStyle, softSelling, includeFaq, contentLang, model, minWords, maxWords }
        : activeTab === "fix"
        ? { type: "fix", sentence: sentenceInput, rewriteType, model }
        : { type: "humanize", text: humanizeInput, model };

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Generation failed");
      }

      if (activeTab === "create") {
        const reader = res.body?.getReader();
        if (!reader) return;
        let accumulated = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += new TextDecoder().decode(value);
          setArticleOutput(accumulated);
          parseOutput(accumulated);
        }
        const historyResult: GenerationResult = {
          id: Date.now(), timestamp: new Date().toLocaleTimeString(), type: "create",
          article: articleOutput, meta: metaOutput, slug: slugOutput, params: { fungsi, kataKunci }
        };
        setHistory(prev => [historyResult, ...prev].slice(0, 5));
      } else if (activeTab === "fix") {
        const data = await res.json();
        setSentenceOutput(data.rewritten);
        const result: GenerationResult = {
          id: Date.now(), timestamp: new Date().toLocaleTimeString(), type: "fix",
          rewritten: data.rewritten, params: { sentence: sentenceInput.substring(0, 30) + "..." }
        };
        setHistory(prev => [result, ...prev].slice(0, 5));
      } else if (activeTab === "humanize") {
        const data = await res.json();
        setHumanizeOutput(data.humanized);
        const result: GenerationResult = {
          id: Date.now(), timestamp: new Date().toLocaleTimeString(), type: "humanize",
          humanized: data.humanized, params: { text: humanizeInput.substring(0, 30) + "..." }
        };
        setHistory(prev => [result, ...prev].slice(0, 5));
      }
    } catch (err: any) {
      setMessage(err.message || "Error generating content.");
    } finally {
      stopLoadingAnimation();
    }
  };

  const handleManualGenerateImagePrompt = async () => {
    if (!articleOutput) return;
    setIsPromptLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "image_prompt", title: kataKunci, kataKunci, articleExcerpt: articleOutput.substring(0, 500), model }),
      });
      const data = await res.json();
      if (data.prompt) {
        setImagePrompt(data.prompt);
        setIsImageSectionExpanded(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPromptLoading(false);
    }
  };

  const handleGenerateImage = () => {
    if (!imagePrompt) return;
    setIsImageLoading(true);
    setImageError(false);
    const encodedPrompt = encodeURIComponent(imagePrompt);
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=630&nologo=true&seed=${Date.now()}`;
    setGeneratedImageUrl(url);
  };

  const handleDownloadImage = async () => {
    if (!generatedImageUrl) return;
    try {
      const response = await fetch(generatedImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Failed to download image", e);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    const oldMsg = message;
    setMessage(t("messages.copied"));
    setTimeout(() => setMessage(oldMsg), 2000);
  };

  const downloadFile = (text: string, ext: string) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `artikel-${Date.now()}.${ext}`;
    link.click();
  };

  const restoreHistory = (item: GenerationResult) => {
    setActiveTab(item.type);
    if (item.type === "create") {
      setFungsi(item.params.fungsi as string || "");
      setKataKunci(item.params.kataKunci as string || "");
      setArticleOutput(item.article || "");
      setMetaOutput(item.meta || "");
      setSlugOutput(item.slug || "");
    } else if (item.type === "fix") {
      setSentenceInput(item.params.sentence as string || "");
      setSentenceOutput(item.rewritten || "");
    } else if (item.type === "humanize") {
        setHumanizeInput(item.params.text as string || "");
        setHumanizeOutput(item.humanized || "");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-xl"><Layout className="text-white" size={20} /></div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">潮际好麦 <span className="text-blue-600 dark:text-blue-400">AIT</span></h1>
          </div>

          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
              <button
                onClick={() => setActiveTab("create")}
                className={cn(
                  "px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center",
                  activeTab === "create" ? "bg-blue-600 text-white shadow-sm" : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                )}
              >
                <PlusCircle size={16} className="mr-2" />
                {t("tabs.create")}
              </button>
              <button
                onClick={() => setActiveTab("fix")}
                className={cn(
                  "px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center",
                  activeTab === "fix" ? "bg-blue-600 text-white shadow-sm" : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                )}
              >
                <Edit3 size={16} className="mr-2" />
                {t("tabs.fix")}
              </button>
              <button
                onClick={() => setActiveTab("humanize")}
                className={cn(
                  "px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center",
                  activeTab === "humanize" ? "bg-green-600 text-white shadow-sm" : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                )}
              >
                <Sparkles size={16} className="mr-2" />
                {t("tabs.humanize")}
              </button>
            </nav>

            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {["zh", "en", "id"].map((l) => (
                <button
                  key={l}
                  onClick={() => changeLanguage(l)}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs font-medium uppercase transition-all",
                    lang === l ? "bg-blue-600 text-white shadow-sm" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  )}
                >
                  {l}
                </button>
              ))}
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-4 transition-colors duration-300">
            <div className="flex justify-between items-start mb-2">
              <h2 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center mt-1">
                {activeTab === "create" && <><PlusCircle size={18} className="mr-2 text-blue-500" /> {t("tabs.create")}</>}
                {activeTab === "fix" && <><Edit3 size={18} className="mr-2 text-orange-500" /> {t("tabs.fix")}</>}
                {activeTab === "humanize" && <><Sparkles size={18} className="mr-2 text-green-500" /> {t("tabs.humanize")}</>}
              </h2>
              <div className="flex flex-col items-end space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-gray-400 dark:text-gray-400 font-bold uppercase tracking-wider">{t("fields.content_lang")}</span>
                  <select value={contentLang} onChange={(e) => setContentLang(e.target.value)} className="text-[10px] border border-gray-200 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium outline-none">
                    <option value="ID">ID</option><option value="EN">EN</option><option value="ZH">ZH</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-gray-400 dark:text-gray-400 font-bold uppercase tracking-wider flex items-center"><Cpu size={10} className="mr-1" /> {t("fields.model_label")}</span>
                  <select value={model} onChange={(e) => setModel(e.target.value)} className="text-[10px] border border-gray-200 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium outline-none">
                    <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite</option>
                    <option value="gemini-3-flash-preview">Gemini 3 Flash Preview</option>
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {activeTab === "create" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase mb-1">{t("fields.min_words")}</label>
                      <input type="number" className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none" value={minWords} onChange={(e) => setMinWords(parseInt(e.target.value) || 0)} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase mb-1">{t("fields.max_words")}</label>
                      <input type="number" className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none" value={maxWords} onChange={(e) => setMaxWords(parseInt(e.target.value) || 0)} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase mb-1">{t("fields.functions")}</label>
                    <textarea rows={3} className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none" placeholder={t("fields.functions_placeholder")} value={fungsi} onChange={(e) => setFungsi(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase mb-1">{t("fields.keywords")}</label>
                    <textarea rows={2} className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none" placeholder={t("fields.keywords_placeholder")} value={kataKunci} onChange={(e) => setKataKunci(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase mb-1">{t("fields.style_label")}</label>
                    <select className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none" value={selectedStyle} onChange={(e) => setSelectedStyle(e.target.value)}>
                      <option value="review">{t("fields.style_review")}</option>
                      <option value="announcement">{t("fields.style_announcement")}</option>
                      <option value="solution">{t("fields.style_solution")}</option>
                      <option value="comparison">{t("fields.style_comparison")}</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === "fix" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase mb-1">{t("fields.original_sentence")}</label>
                    <textarea rows={6} className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none" placeholder={t("fields.sentence_placeholder")} value={sentenceInput} onChange={(e) => setSentenceInput(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setRewriteType("yellow")} className={cn("p-3 rounded-xl border-2 text-left transition-colors", rewriteType === "yellow" ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20" : "border-gray-100 dark:border-gray-800")}>
                      <span className="font-bold text-sm block text-gray-900 dark:text-gray-100">🟡 {t("fields.yellow_label")}</span>
                      <span className="text-[10px] text-gray-400">{t("fields.yellow_desc")}</span>
                    </button>
                    <button onClick={() => setRewriteType("red")} className={cn("p-3 rounded-xl border-2 text-left transition-colors", rewriteType === "red" ? "border-red-400 bg-red-50 dark:bg-red-900/20" : "border-gray-100 dark:border-gray-800")}>
                      <span className="font-bold text-sm block text-gray-900 dark:text-gray-100">🔴 {t("fields.red_label")}</span>
                      <span className="text-[10px] text-gray-400">{t("fields.red_desc")}</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "humanize" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase mb-1">{t("fields.humanize_lang")}</label>
                    <select className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none" defaultValue="zh" disabled>
                      <option value="zh">🇨🇳 中文 (Mandarin)</option>
                    </select>
                    <p className="text-[10px] text-gray-400 mt-1">More languages coming soon.</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase mb-1">{t("fields.humanize_input")}</label>
                    <textarea rows={10} value={humanizeInput} onChange={(e) => setHumanizeInput(e.target.value)} placeholder={t("fields.humanize_placeholder")} className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none h-48 resize-none transition-colors" />
                  </div>
                </div>
              )}
            </div>

            <button id="btn-generate" disabled={loading} onClick={handleGenerate} className={cn("w-full text-white font-semibold py-3 rounded-lg flex items-center justify-center transition-all", activeTab === "create" ? "bg-blue-600 hover:bg-blue-700" : activeTab === "fix" ? "bg-orange-500 hover:bg-orange-600" : "bg-green-600 hover:bg-green-700")}>
              {loading ? <span className="flex items-center"><RotateCcw size={16} className="animate-spin mr-2" /> {statusText}</span> : <><Sparkles size={18} className="mr-2" /> {activeTab === "create" ? t("buttons.generate") : activeTab === "fix" ? t("buttons.fix_now") : t("buttons.humanize_now")}</>}
            </button>

            <div className="flex space-x-2">
              <button onClick={handleClear} className="flex-1 border border-gray-200 dark:border-gray-700 py-2 rounded-lg text-sm flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"><Trash2 size={14} className="mr-2" /> {t("buttons.clear_input")}</button>
              <button onClick={handlePaste} className="flex-1 border border-gray-200 dark:border-gray-700 py-2 rounded-lg text-sm flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"><Clipboard size={14} className="mr-2" /> {t("buttons.paste")}</button>
            </div>
            {message && <div className="p-3 rounded-lg text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center"><AlertCircle size={14} className="mr-2" /> {message}</div>}
          </section>

          {history.length > 0 && (
            <section className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4 transition-colors duration-300">
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center"><History size={16} className="mr-2" /> Recent Generations</h3>
              <div className="space-y-2">
                {history.map(item => (
                  <button key={item.id} onClick={() => restoreHistory(item)} className="w-full text-left p-2 hover:bg-white dark:hover:bg-gray-700 rounded border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-all">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">{item.type}</span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">{item.timestamp}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{item.type === "create" ? item.params.kataKunci : item.params.sentence}</p>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="lg:col-span-7 space-y-6">
          <section className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-6 min-h-[600px] flex flex-col transition-colors duration-300">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                <FileText size={18} className="mr-2 text-green-500" />
                {activeTab === "create" ? t("output.generation_output") : activeTab === "fix" ? t("output.fix_result") : t("output.humanize_result")}
              </h2>
              {activeTab === "create" && articleOutput && (
                <div className="flex space-x-2">
                  <button onClick={handleManualGenerateImagePrompt} disabled={isPromptLoading} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold flex items-center hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors disabled:opacity-50">
                    {isPromptLoading ? <RotateCcw size={14} className="animate-spin mr-1" /> : <ImageIcon size={14} className="mr-1" />}
                    {t("buttons.generate_image_prompt")}
                  </button>
                  <button onClick={() => downloadFile(articleOutput, "txt")} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-500 dark:text-gray-400 transition-colors"><Download size={16} /></button>
                  <button onClick={() => downloadFile(articleOutput, "md")} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-500 dark:text-gray-400 font-bold text-xs transition-colors">MD</button>
                </div>
              )}
            </div>

            <div className="space-y-6 flex-1">
              {activeTab === "create" && (
                <>
                  <div className="relative group">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t("output.article")}</h3>
                      <button onClick={() => copyToClipboard(articleOutput)} className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><Copy size={16} /></button>
                    </div>
                    <div className="w-full border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-sm bg-gray-50 dark:bg-gray-800 min-h-[400px] whitespace-pre-wrap text-gray-800 dark:text-gray-200 transition-colors">
                      {articleOutput || <span className="text-gray-300 dark:text-gray-600 italic">{t("output.rewritten_placeholder")}</span>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400">{t("output.meta")}</h3>
                        <button onClick={() => copyToClipboard(metaOutput)} className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><Copy size={12} /></button>
                      </div>
                      <div className="w-full border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-xs bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 min-h-[60px] transition-colors">{metaOutput}</div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400">{t("output.slug")}</h3>
                        <button onClick={() => copyToClipboard(slugOutput)} className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><Copy size={12} /></button>
                      </div>
                      <div className="w-full border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-xs bg-gray-50 dark:bg-gray-800 font-mono text-blue-600 dark:text-blue-400 min-h-[40px] flex items-center transition-colors">{slugOutput}</div>
                    </div>
                  </div>
                  <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-6">
                    <button onClick={() => setIsImageSectionExpanded(!isImageSectionExpanded)} className="flex items-center justify-between w-full text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <div className="flex items-center font-bold text-sm"><ImageIcon size={18} className="mr-2" />{t("image_gen.title")}</div>
                      {isImageSectionExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {isImageSectionExpanded && (
                      <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex space-x-2">
                          <textarea className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none h-20 resize-none" value={imagePrompt} onChange={(e) => setImagePrompt(e.target.value)} placeholder={isPromptLoading ? "Generating prompt..." : ""} />
                          <button onClick={handleGenerateImage} disabled={isImageLoading || !imagePrompt} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center self-end">
                            {isImageLoading ? <RotateCcw size={14} className="animate-spin mr-2" /> : <Sparkles size={14} className="mr-2" />} {t("image_gen.generate_button")}
                          </button>
                        </div>
                        {generatedImageUrl && (
                          <div className="space-y-4">
                            <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 aspect-video flex items-center justify-center transition-colors">
                              {isImageLoading && <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10"><RotateCcw size={32} className="animate-spin text-blue-600 dark:text-blue-400" /></div>}
                              {imageError ? (
                                <div className="text-center p-6"><AlertCircle size={32} className="mx-auto text-red-500 mb-2" /><p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t("image_gen.error")}</p><button onClick={handleGenerateImage} className="text-blue-600 dark:text-blue-400 text-sm font-bold hover:underline flex items-center mx-auto"><RotateCcw size={14} className="mr-1" /> {t("image_gen.retry")}</button></div>
                              ) : (
                                <img src={generatedImageUrl} alt="Generated" className={cn("w-full h-full object-cover transition-opacity duration-300", isImageLoading ? "opacity-0" : "opacity-100")} onLoad={() => setIsImageLoading(false)} onError={() => { setIsImageLoading(false); setImageError(true); }} />
                              )}
                            </div>
                            <button onClick={handleDownloadImage} className="w-full border-2 border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 py-2 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-400 flex items-center justify-center transition-colors"><Download size={16} className="mr-2" /> {t("image_gen.download_button")}</button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}

              {activeTab === "fix" && (
                <div className="relative group flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t("output.rewritten_label")}</h3>
                    <button onClick={() => copyToClipboard(sentenceOutput)} className="text-gray-400 dark:text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"><Copy size={18} /></button>
                  </div>
                  <div className="w-full border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-lg font-medium bg-gray-50 dark:bg-gray-800 flex-1 min-h-[400px] leading-relaxed text-gray-800 dark:text-gray-200 transition-colors">
                    {sentenceOutput || <span className="text-gray-300 dark:text-gray-600 italic">{t("output.rewritten_placeholder")}</span>}
                  </div>
                </div>
              )}

              {activeTab === "humanize" && humanizeOutput && (
                <div className="relative group flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t("output.humanize_label")}</h3>
                    <button onClick={() => copyToClipboard(humanizeOutput)} className="text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 transition-colors"><Copy size={18} /></button>
                  </div>
                  <div className="w-full border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-lg font-medium bg-gray-50 dark:bg-gray-800 flex-1 min-h-[400px] leading-relaxed text-gray-800 dark:text-gray-200 transition-colors">
                    {humanizeOutput}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      <footer className="max-w-5xl mx-auto px-4 mt-12 text-center pb-8">
        <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-medium">{t("footer")}</p>
      </footer>
    </main>
  );
}
