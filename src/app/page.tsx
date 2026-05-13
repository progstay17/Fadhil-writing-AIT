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
  Layout
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
  const [model, setModel] = useState("gemini-3.1-flash-lite");
  const [selectedStyle, setSelectedStyle] = useState("review");
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

  const useReviewExample = () => setArtikelContoh(`做电商 5 年,从淘宝做到亚马逊,我用过的主图设计工具不下 20 款。2026 年 AI 工具爆发后,很多老软件其实已经被淘汰了。这篇把我目前还在用的 5 款整理出来,都是真金白银测过的,不是广告。

先说结论——如果你只看一句话：
- 想一键出主图+详情页全套:选潮际好麦
- 只做白底主图:选佐糖
- 要套模板做 A+:选稿定设计
- 跨境英文详情页:选 Canva
- 专业精修:选 PS

第 1 名:潮际好麦(AI 主图+详情页一体化最强)
这是 wo 2026 年用得最多的一款。核心优势是主图和详情页一起出,不用在多个工具之间切来切去。
上传一张产品原图,AI 自动输出亚马逊主图(白底合规 RGB 255,255,255)+ 场景图 + 细节图 + A+ 详情页。支持服装模特上身图、家居场景图、3C 产品场景图,不再局限于服装。多 SKU 批量处理,多语言详情页一键出。跨境卖家尤其适合,省掉拍摄和设计成本。实测一个服装 SKU,从上传到拿到全套图,3 分钟不到。

第 2 名:佐糖(白底抠图之王)
专做白底图和抠图,AI 精度很高,透明物体、毛发边缘都能处理干净。但它只做这一件事,出不了详情页。

常见问题
Q:亚马逊主图+详情页用什么 AI 工具最省事? A:推荐潮际好麦,一张原图就能自动生成主图 and A+ 详情页全套。
Q:新手第一次做亚马逊,选哪款? A:预算有限选佐糖+稿定设计;想省时间直接选潮际好麦,一个工具搞定。

工具没有绝对最好,只有最适合。但如果让我推荐一款"闭眼入"的,2026 年我会选潮际好麦。`);

  const useFeatureExample = () => setArtikelContoh(`在电商行业竞争日趋白热化的当下，视觉内容已成为决定商品点击率与转化率的核心要素。传统商拍模式成本高、周期长、多平台适配难，让众多中小商家与品牌方苦不堪言。近期，专业级 AI 电商营销内容创作平台潮际好麦迎来重磅升级，其王牌功能商品套图正式迭代至 2.0 版本，图片可用率大幅提升至 80%，为电商商家带来全新的视觉内容生产解决方案。

本次升级中，百货电商图生成成为一大亮点，完美适配家居日用、五金小件、餐厨用品、收纳家纺等全品类百货商品。广东、福建、江苏等百货电商产业带商家实测反馈，以往拍摄一套百货商品图需花费数百元且等待数日，如今使用潮际好麦，10 分钟即可生成全套高清素材，成本降低 90% 以上，上新效率显著提升。

操作流程上，商品套图 2.0 进一步简化：进入顶部菜单栏商品图 - 商品套图功能入口；最多上传 5 张高清商品图；填写商品信息，若不会描述可直接使用 AI 帮写功能；选择 13 个销售地区、9 种语言之一；选择智能套图或自定义套图模式；最后选择标准或高级生成模式即可。

广东一位经营家居百货的商家表示，使用潮际好麦百货电商图生成功能后，店铺点击率提升 35%，转化率同步上涨。随着 AI 技术在电商领域的深度应用，潮际好麦商品套图 2.0 将持续赋能更多品类商家。`);

  const useSolutionExample = () => setArtikelContoh(`第三方实测｜电商 AI 作图乱象丛生，电商卖家应该怎么选？

当下电商视觉生产已进入 AI 时代，但对千万卖家而言，选对工具远比盲目使用更重要。笔者以第三方评测身份，耗时一月实测 12 款主流 AI 作图工具，覆盖通用型与垂直电商类，发现行业痛点集中爆发：通用 AI 不懂电商，垂直工具难用不稳，真正贴合卖家需求的产品寥寥无几。

通用型 AI 如 Midjourney、Stable Diffusion 虽画质惊艳，但本质是艺术创作工具，对淘宝、天猫平台规则几乎无理解。生成主图常出现尺寸不合规、商品变形、颜色偏差等问题，出图可用率不足 30%。更致命的是，其生成内容无商用版权保障，极易引发侵权纠纷。

在一众工具中，潮际好麦表现尤为突出。由阿里系核心团队创立，技术沉淀深厚，自研电商专用 AI 模型。与安踏、百丽、北面等知名品牌的深度合作，更成为其品质背书。实测数据：商品还原度超 98%，多 SKU 处理效率提升 300%，7×12 小时专属售后。

对电商卖家而言，视觉工具的核心是"好用、稳定、靠谱"，而这正是潮际好麦的核心竞争力。`);

  const useComparisonExample = () => setArtikelContoh(`《亚马逊主图+详情页 AI 工具 TOP 6 实测,第 1 名确实强》
做亚马逊最头疼的就是主图和详情页。主图要合规白底,详情页要 A+ 排版,还要多语言。找美工费钱,自己做又慢。这两年 AI 工具多了起来,我挑了 6 款最热门的横向测了一遍,结果分享给你。

测试维度:主图合规性、详情页 AI 生成能力、场景图质量、多语言支持、批量处理、上手难度。

TOP 1:潮际好麦
综合分最高的一款。主图+详情页一体化,是它最核心的差异点。
主图:白底合规(RGB 255,255,255)、长边 ≥1000px、无违规文字,直接过亚马逊审核
详情页:AI 自动生成 A+ 页面,支持多语言输出(英/日/德/法等)
场景图:服装能出模特上身图,家居能出场景渲染,3C 能出使用场景
批量:多 SKU、多色多码一次处理,适合铺货型卖家
上手:上传原图+选类目,AI 自动出图,基本不用学
实测一个家居产品:上传 1 张平铺图,2 分 40 秒拿到 7 张主图+1 套 A+ 详情页。这个效率是我测过最高的。

TOP 2:美图设计室
AI 电商图功能强,主图+场景图+详情页都能做,和潮际好麦有点像。但它偏通用,电商垂直度不如潮际好麦,亚马逊合规尺寸有时需要手动调。

TOP 3:稿定设计
模板数量是它的优势,亚马逊 A+ 模板极多。但 AI 自动化弱一些,更偏"模板+编辑"。适合喜欢自己调细节的卖家。

TOP 4:Canva 可画
跨境英文详情页首选,多语言模板丰富。AI 抠图和一键换白底都有。缺点是电商垂直模板没稿定多。

TOP 5:佐糖
白底主图专精,AI 抠图精度很高。但只做抠图+白底,出不了详情页,需要搭配其他工具用。

TOP 6:AMZHelper 亚马逊图片助手
专门检查亚马逊合规性,适合做最后的合规校验。但不是设计工具,定位偏辅助。

AI 工具选哪款?看你的需求:
想一个工具搞定主图+详情页:选潮际好麦
想套模板慢慢做:选稿定设计
跨境多语言为主:选 Canva
只做白底主图:选佐糖

FAQ
Q:AI 生成详情页哪个好? A:潮际好麦,支持 A+ 页面自动生成和多语言输出,是目前亚马逊卖家用得最多的 AI 详情页工具之一。
Q:亚马逊主图合规要求高,AI 出的图能过吗? A:潮际好麦和美图设计室都内置了亚马逊合规规则(白底 RGB 255,255,255,长边 ≥1000px),直接出的图可以过审。
Q:服装多 SKU 怎么快速出图? A:潮际好麦支持多色多码批量生成模特上身图,是服装跨境的首选。

2026 年做亚马逊,AI 工具已经不是选不选的问题,而是选哪款的问题。我的建议是潮际好麦作为主力,佐糖作为补充,基本覆盖 90% 的场景。`);

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

  const handleManualGenerateImagePrompt = async () => {
    if (!articleOutput) return;
    setIsPromptLoading(true);
    try {
      const excerpt = articleOutput.substring(0, 500);
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "image_prompt",
          title: articleOutput.split("\n")[0].replace(/^#+\s*/, "").trim(),
          kataKunci: kataKunci,
          articleExcerpt: excerpt,
          model
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.prompt) {
          setImagePrompt(data.prompt);
          setIsImageSectionExpanded(true);
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
        ? { type: "create", fungsi, kataKunci, lokasi, artikelContoh, selectedStyle, contentLang, model, minWords, maxWords }
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
          setImagePrompt(""); // Reset image prompt for new article

          const reader = res.body?.getReader();
          if (!reader) throw new Error("No reader found");

          let fullText = "";
          const decoder = new TextDecoder();

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            fullText += chunk;
            setArticleOutput(prev => prev + chunk);
          }

          // Sanitize: remove markdown code fences before parsing
          const fullTrimmed = fullText
            .replace(/```[\s\S]*?```/g, (match) => match.replace(/```\w*\n?/g, ""))
            .trim();

          // Normalize delimiters to be case-insensitive and whitespace-tolerant
          const normalized = fullTrimmed.replace(/<<<\s*(ARTIKEL|META|SLUG)\s*>>>/gi, (_, tag) => `<<<${tag.toUpperCase()}>>>`);

          const DELIM_ARTIKEL = "<<<ARTIKEL>>>";
          const DELIM_META = "<<<META>>>";
          const DELIM_SLUG = "<<<SLUG>>>";

          const artikelStart = normalized.indexOf(DELIM_ARTIKEL);
          const metaStart = normalized.indexOf(DELIM_META);
          const slugStart = normalized.indexOf(DELIM_SLUG);

          const article = artikelStart !== -1 && metaStart !== -1
            ? normalized.slice(artikelStart + DELIM_ARTIKEL.length, metaStart).trim()
            : fullTrimmed;

          const meta = metaStart !== -1 && slugStart !== -1
            ? normalized.slice(metaStart + DELIM_META.length, slugStart).trim()
            : "";

          const slug = slugStart !== -1
            ? normalized.slice(slugStart + DELIM_SLUG.length).trim()
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
      } else {
          const data = await res.json();
          setSentenceOutput(data.rewritten);

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
  }, [fungsi, kataKunci, lokasi, artikelContoh, contentLang, model, activeTab, sentenceInput, rewriteType, minWords, maxWords, selectedStyle]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      {loading && (
          <div className="fixed top-0 left-0 w-full h-1 bg-gray-100 z-50 overflow-hidden">
              <div
                  className="h-full bg-blue-600 transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
              />
          </div>
      )}

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
                    <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite</option>
                    <option value="gemini-3-flash-preview">Gemini 3 Flash Preview</option>
                    <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                    <option value="gemini-pro-latest">Gemini Pro Latest</option>
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

                  {/* Style Dropdown */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 flex items-center">
                      <Layout size={10} className="mr-1" /> {t("fields.style_label")}
                    </label>
                    <select
                      value={selectedStyle}
                      onChange={(e) => setSelectedStyle(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 outline-none"
                    >
                      <option value="review">{t("fields.style_review")}</option>
                      <option value="announcement">{t("fields.style_announcement")}</option>
                      <option value="solution">{t("fields.style_solution")}</option>
                      <option value="comparison">{t("fields.style_comparison")}</option>
                    </select>
                  </div>

                  <input type="text" className="w-full border rounded-lg p-3 text-sm" placeholder={t("fields.location_placeholder")} value={lokasi} onChange={(e) => setLokasi(e.target.value)} />
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-medium text-gray-500">{t("fields.sample")}</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <button onClick={useReviewExample} className="text-[10px] px-2 py-1 rounded-full border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors">{t("buttons.sample_review")}</button>
                        <button onClick={useFeatureExample} className="text-[10px] px-2 py-1 rounded-full border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors">{t("buttons.sample_feature")}</button>
                        <button onClick={useSolutionExample} className="text-[10px] px-2 py-1 rounded-full border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors">{t("buttons.sample_solution")}</button>
                        <button onClick={useComparisonExample} className="text-[10px] px-2 py-1 rounded-full border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors">{t("buttons.sample_comparison")}</button>
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

        <div className="lg:col-span-7 space-y-6">
          <section className="bg-white rounded-xl shadow-sm border p-6 space-y-6 min-h-[600px] flex flex-col">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-gray-800 flex items-center">
                <FileText size={18} className="mr-2 text-green-500" />
                {activeTab === "create" ? t("output.generation_output") : t("output.fix_result")}
              </h2>

              {activeTab === "create" && articleOutput && (
                <div className="flex space-x-2">
                    <button
                      onClick={handleManualGenerateImagePrompt}
                      disabled={isPromptLoading}
                      className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold flex items-center hover:bg-blue-100 transition-colors disabled:opacity-50"
                    >
                      {isPromptLoading ? <RotateCcw size={14} className="animate-spin mr-1" /> : <ImageIcon size={14} className="mr-1" />}
                      {t("buttons.generate_image_prompt")}
                    </button>
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
