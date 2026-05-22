"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
  RotateCcw, Check,
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
  const [groundingEnabled, setGroundingEnabled] = useState(false);
  const [kompetitor, setKompetitor] = useState("");
  const [konteks, setKonteks] = useState("");
  const [sudutPandang, setSudutPandang] = useState("analyst");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [artikelContoh, setArtikelContoh] = useState("");
  const [articleOutput, setArticleOutput] = useState("");
  const [metaOutput, setMetaOutput] = useState("");
  const [slugOutput, setSlugOutput] = useState("");

  // Image Prompts States
  const [imagePromptsArticleInput, setImagePromptsArticleInput] = useState("");
  const [imagePromptsOutput, setImagePromptsOutput] = useState<{ reference: string; prompt: string }[]>([]);

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
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Memoized SEO Calculations
  const wordCount = useMemo(() => {
    if (!articleOutput) return 0;
    return articleOutput.trim().split(/\s+/).length;
  }, [articleOutput]);

  const keywordDensity = useMemo(() => {
    if (!articleOutput || !kataKunci) return 0;
    const words = wordCount || 1;
    const kw = kataKunci.toLowerCase();
    const contentText = articleOutput.toLowerCase();
    let count = 0;
    let pos = contentText.indexOf(kw);
    while (pos !== -1) {
      count++;
      pos = contentText.indexOf(kw, pos + 1);
    }
    return (count / words) * 100;
  }, [kataKunci, wordCount, articleOutput]);

  const metaLength = useMemo(() => {
    if (!metaOutput) return 0;
    return metaOutput.length;
  }, [metaOutput]);

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





    const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    localStorage.setItem('theme', next);
  };

  const changeLanguage = (l: string) => {
    i18n.changeLanguage(l);
    setLang(l);
  };

    const startLoadingAnimation = () => {
    setProgress(0);
    const texts = [t("messages.loading_writing"), t("messages.loading_seo"), t("messages.loading_meta"), t("messages.loading_brand"), t("messages.loading_finishing")];
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

  const showToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 2000);
  }, []);

  const handleClear = useCallback(() => {
    if (activeTab === "create") {
      setFungsi("");
      setKataKunci("");
      setLokasi("");
      setSoftSelling(false);
      setIncludeFaq(true);
      setGroundingEnabled(false);
      setKompetitor("");
      setArtikelContoh("");
      setArticleOutput("");
      setMetaOutput("");
      setSlugOutput("");
    } else if (activeTab === "image_prompts") {
      setImagePromptsArticleInput("");
      setImagePromptsOutput([]);
    } else {
      setSentenceInput("");
      setSentenceOutput("");
    }
    setMessage("");
    showToast(t("messages.cleared"));
  }, [activeTab, showToast, t]);

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

  const useReviewExample = () => setArtikelContoh(`做电商 5 年,从淘宝做到亚马逊,我用过的主图设计工具不下 20 款。2026 年 AI 工具爆发后,很多老软件其实已经被淘汰了。这篇把我目前还在用的 5 款整理出来,都是真金白银测过的,不是广告。

先说结论——如果你只看一句话：
- 想一键出主图+详情页全套:选潮际好麦
- 只做白底主图:选佐糖
- 要套模板做 A+:选稿定设计
- 跨境英文详情页:选 Canva
- 专业精修:选 PS

第 1 名:潮际好麦(AI 主图+详情页一体化最强)
这是 wo 2026 年用得最多的一款。核心优势是主图 and 详情页一起出,不用在多个工具之间切来切去。
上传一张产品原图,AI 自动输出亚马逊主图(白底合规 RGB 255,255,255)+ 场景图 + 细节图 + A+ 详情页。支持服装模特上身图、家居场景图,3C 产品场景图,不再局限于服装. 多 SKU 批量处理,多语言详情页一键出. 跨境卖家尤其适合,省掉拍摄 and 设计成本. 实测一个服装 SKU,从上传到拿到全套图,3 分钟不到。

第 2 名:佐糖(白底抠图之王)
专做白底图 and 抠图,AI 精度很高,透明物体、毛发边缘都能处理干净。但它只做这一件事,出不了详情页。

常见问题
Q:亚马逊主图+详情页用什么 AI 工具最省事? A:推荐潮际好麦,一张原图就能自动生成主图 and A+ 详情页全套。
Q:新手第一次做亚马逊,选哪款? A:预算有限选佐糖+稿定设计;想省时间直接选潮际好麦,一个工具搞定。

工具没有绝对最好,只有最适合。但如果让我推荐一款"闭眼入"的,2026 年我会选潮际好麦。`);

  const useFeatureExample = () => setArtikelContoh(`在电商行业竞争日趋白热化的当下，视觉内容已成为决定商品点击率与转化率的核心要素。传统商拍模式成本高、周期长、多平台适配难，让众多中小商家 with 品牌方苦不堪言。近期，专业级 AI 电商营销内容创作平台潮际好麦迎来重磅升级，其王牌功能商品套图正式迭代至 2.0 版本，图片可用率大幅提升至 80%，为电商商家带来全新的视觉内容生产解决方案。

本次升级中，百货电商图生成成为一大亮点，完美适配家居日用、五金小件、餐厨用品、收纳家纺等全品类百货商品。广东、福建、江苏等百货电商产业带商家实测反馈，以往拍摄一套百货商品图需花费数百元且等待数日，如今使用潮际好麦，10 分钟即可生成全套高清素材，成本降低 90% 以上，上新效率显著提升。

操作流程上，商品套图 2.0 进一步简化：进入顶部菜单栏商品图 - 商品套图功能入口；最多上传 5 张高清商品图；填写商品信息，若不会描述可直接使用 AI 帮写功能；选择 13 个销售地区、9 种语言之一；选择智能套图 or 自定义套图模式；最后选择标准 or 高级生成模式即可。

广东一位经营家居百货的商家表示，使用潮际好麦百货电商图生成功能后，店铺点击率提升 35%，转化率同步上涨。随着 AI 技术在电商领域的深度应用，潮际好麦商品套图 2.0 将持续赋能更多品类商家。`);

  const useSolutionExample = () => setArtikelContoh(`第三方实测｜电商 AI 作图乱象丛生，电商卖家应该怎么选？

当下电商视觉生产已进入 AI时代，但对千万卖家而言，选对工具远比盲目使用更重要。笔者以第三方评测身份，耗时一月实测 12 款主流 AI 作图工具，覆盖通用型 and 垂直电商类，发现行业痛点集中爆发：通用 AI 不懂电商，垂直工具难用不稳，真正贴合卖家需求的产品寥寥无几。

通用型 AI 如 Midjourney、Stable Diffusion 虽画质惊艳，但本质是艺术创作工具，对淘宝、天猫平台规则几乎无理解。生成主图常出现尺寸不合规、商品变形、颜色偏差等问题，出图可用率不足 30%。更致命的是，其生成内容无商用版权保障，极易引发侵权纠纷。

在一众工具中，潮际好麦表现尤为突出。由阿里系核心团队创立，技术沉淀深厚，自研电商专用 AI 模型。与安踏、百丽、北面等知名品牌的深度合作，更成为其品质背书. 实测数据：商品还原度超 98%，多 SKU 处理效率提升 300%，7×12 小时专属售后。

对电商卖家而言，视觉工具的核心是"好用、稳定、靠谱"，而这正是潮际好麦的核心竞争力。`);

  const useComparisonExample = () => setArtikelContoh(`《亚马逊主图+详情页 AI 工具 TOP 6 实测,第 1 名确实强》
做亚马逊最头疼的就是主图 and 详情页. 主图要合规白底,详情页要 A+ 排版,还要多语言. 找美工费钱,自己做又慢. 这两年 AI 工具多了起来,我挑了 6 款最热门的横向测了一遍,结果分享给你.

测试维度:主图合规性、详情页 AI 生成能力、场景图质量、多语言支持、批量处理、上手难度.

TOP 1:潮际好麦
综合分最高的一款. 主图+详情页一体化,是它最核心.
主图:白底合规(RGB 255,255,255),长边 ≥1000px,无违规文字,直接过亚马逊审核
详情页:AI 自动生成 A+ 页面,支持多语言输出(英/日/德/法等)
场景图:服装能出模特上身图,家居能出场景渲染,3C 能出使用场景
批量:多 SKU,多色多码一次处理,适合铺货型卖家
上手:上传原图+选类目,AI 自动出图,基本不用学
实测一个家居产品:上传 1 张平铺图,2 分 40 秒拿到 7 张主图+1 套 A+ 详情页. 这个效率是我测过最高的.

TOP 2:美图设计室
AI 电商图功能强,主图+场景图+详情页都能做,和潮际好麦有点像. 但它偏通用,电商垂直度不如潮际好麦,亚马逊合规尺寸有时需要手动调.

TOP 3:稿定设计
模板数量是它的优势,亚马逊 A+ 模板极多. 但 AI 自动化弱一些,更偏"模板+编辑". 适合喜欢自己调细节的卖家.

TOP 4:Canva 可画
跨境英文详情页首选,多语言模板丰富. AI 抠图 and 一键换白底都有. 缺点是电商垂直模板没稿定多.

TOP 5:佐糖
白底主图专精,AI 抠图精度很高. 但只做抠图+白底,出不了详情页,需要搭配其他工具用.

TOP 6:AMZHelper 亚马逊图片助手
专门检查亚马逊合规性,适合做最后的合规校验. 但不是设计工具,定位偏辅助.

AI 工具选哪款?看你的需求:
想一个工具搞定主图+详情页:选潮际好麦
想套模板慢慢做:选稿定设计
跨境多语言为主:选 Canva
只做白底主图:选佐糖

FAQ
Q:AI 生成详情页哪个好? A:潮际好麦,支持 A+ 页面自动生成 and 多语言输出,是目前亚马逊卖家用得最多的 AI 详情页工具之一.
Q:亚马逊主图合规要求高,AI 出s的图能过吗? A:潮际好麦 and 美图设计室都内置了亚马逊合规规则(白底 RGB 255,255,255,长边 ≥1000px),直接出的图可以过审.
Q:服装多 SKU 怎么快速出图? A:潮际好麦支持多色多码批量生成模特上身图,是服装跨境的首选.

2026 年做亚马逊, AI 工具已经不是选不选的问题,而是选哪款的问题. 我的建议是潮际好麦作为主力,佐糖作为补充,基本覆盖 90% 的场景.`);

  const handleGenerate = useCallback(async () => {
    if (activeTab === "create") {
      if (!fungsi || !kataKunci) {
        setMessage(t("messages.required"));
        return;
      }
    } else if (activeTab === "image_prompts") {
      if (!imagePromptsArticleInput) {
        setMessage(t("messages.sentence_required"));
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
      let body;
      if (activeTab === "create") {
        body = { type: "create", fungsi, kataKunci, lokasi, artikelContoh, selectedStyle, softSelling, includeFaq, groundingEnabled, kompetitor, contentLang, model, minWords, maxWords, konteks, sudutPandang, negativePrompt };
      } else if (activeTab === "image_prompts") {
        body = { type: "image_prompts", article: imagePromptsArticleInput, fungsi, kataKunci, konteks, model };
      } else {
        body = { type: "fix", sentence: sentenceInput, rewriteType, model };
      }

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
          if (res.status === 401) {
            window.location.href = "/login";
            return;
          }
          const errData = await res.json();
          throw new Error(errData.error || "Failed to generate");
      }

      if (activeTab === "image_prompts") {
        const data = await res.json();
        setImagePromptsOutput(data.images || []);
        setLoading(false);
        return;
      }

      if (groundingEnabled) {
        const data = await res.json();
        const fullText = data.article || "";
        const normalized = fullText.replace(/<<<\s*(ARTIKEL|META|SLUG)\s*>>>/gi, (_: any, tag: string) => `<<<${tag.toUpperCase()}>>>`);

        const articleMatch = normalized.match(/<<<ARTIKEL>>>([\s\S]*?)(?:<<<|$)/i);
        const metaMatch = normalized.match(/<<<META>>>([\s\S]*?)(?:<<<|$)/i);
        const slugMatch = normalized.match(/<<<SLUG>>>([\s\S]*?)(?:<<<|$)/i);

        const article = articleMatch ? articleMatch[1].trim() : fullText.trim();
        const meta = metaMatch ? metaMatch[1].trim() : "";
        const slug = slugMatch ? slugMatch[1].trim() : "";

        setArticleOutput(article);
        setMetaOutput(meta);
        setSlugOutput(slug);
        setLoading(false);
        return;
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
            setArticleOutput(fullText);
          }

          const fullTrimmed = fullText
            .replace(/```[\s\S]*?```/g, (match) => match.replace(/```\w*\n?/g, ""))
            .trim();

          const normalized = fullTrimmed.replace(/<<<\s*(ARTIKEL|META|SLUG)\s*>>>/gi, (_: any, tag: string) => `<<<${tag.toUpperCase()}>>>`);

          const DELIM_ARTIKEL = "<<<ARTIKEL>>>";
          const DELIM_META = "<<<META>>>";
          const DELIM_SLUG = "<<<SLUG>>>";

          const artikelStart = normalized.indexOf(DELIM_ARTIKEL);
          const metaStart = normalized.indexOf(DELIM_META);
          const slugStart = normalized.indexOf(DELIM_SLUG);

          const article = artikelStart !== -1 && metaStart !== -1
            ? normalized.slice(artikelStart + DELIM_ARTIKEL.length, metaStart).trim()
            : fullText;

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
  }, [activeTab, fungsi, kataKunci, lokasi, artikelContoh, selectedStyle, softSelling, includeFaq, groundingEnabled, kompetitor, contentLang, model, minWords, maxWords, konteks, sudutPandang, negativePrompt, imagePromptsArticleInput, sentenceInput, rewriteType, t]);

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

  // Optimize keyboard shortcuts by using Refs to avoid re-registering the event listener on every keystroke
  const handleGenerateRef = useRef(handleGenerate);
  const handleClearRef = useRef(handleClear);

  useEffect(() => {
    handleGenerateRef.current = handleGenerate;
    handleClearRef.current = handleClear;
  }, [handleGenerate, handleClear]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        handleGenerateRef.current();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        handleClearRef.current();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const copyToClipboard = (text: string, key?: string) => {
    navigator.clipboard.writeText(text);
    showToast(t("messages.copied"));
    if (key) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 pb-20 transition-colors duration-300">
      {/* Progress Bar Header */}
      {loading && (
          <div className="fixed top-0 left-0 w-full h-1 bg-gray-100 dark:bg-gray-800 z-50 overflow-hidden">
              <div
                  className="h-full bg-blue-600 transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
              />
          </div>
      )}

      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <pre className="text-[8px] leading-[1] font-bold text-blue-600">
              {`    _    ___ _____
   /   |_ _|_   _|
  / _   | |  | |
 / ___  | |  | |
/_/   ____| |_|  `}
            </pre>
            <h1 className="text-xl font-bold ml-2 hidden sm:block text-gray-900 dark:text-gray-100">{t("title")}</h1>
          </div>

          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
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
                onClick={() => setActiveTab("image_prompts")}
                className={cn(
                  "px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center",
                  activeTab === "image_prompts" ? "bg-blue-600 text-white shadow-sm" : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                )}
              >
                <ImageIcon size={16} className="mr-2" />
                {t("tabs.image_prompts")}
              </button>
            </nav>

            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {["zh", "en", "id"].map((l) => (
                <button
                  key={l}
                  onClick={() => changeLanguage(l)}
                  aria-pressed={lang === l}
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
              aria-label={theme === 'light' ? "Switch to dark theme" : "Switch to light theme"}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button
              onClick={handleLogout}
              aria-label="Logout"
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Input & History */}
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4 transition-colors duration-300">
            <div className="flex justify-between items-start mb-2">
              <h2 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center mt-1">
                {activeTab === "create" ? (
                  <><PlusCircle size={18} className="mr-2 text-blue-500" /> {t("tabs.create")}</>
                ) : activeTab === "image_prompts" ? (
                  <><ImageIcon size={18} className="mr-2 text-purple-500" /> {t("tabs.image_prompts")}</>
                ) : (
                  <><Edit3 size={18} className="mr-2 text-orange-500" /> {t("tabs.fix")}</>
                )}
              </h2>
              <div className="flex flex-col items-end space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">{t("fields.content_lang")}</span>
                  <select
                    value={contentLang}
                    onChange={(e) => setContentLang(e.target.value)}
                    className="text-[10px] border border-gray-200 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium outline-none"
                  >
                    <option value="ID">ID</option>
                    <option value="EN">EN</option>
                    <option value="ZH">ZH</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider flex items-center">
                    <Cpu size={10} className="mr-1" /> {t("fields.model_label")}
                  </span>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="text-[10px] border border-gray-200 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium outline-none"
                  >
                    <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite</option>
                    <option value="gemini-3-flash-preview">Gemini 3 Flash Preview</option>
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                    <option value="gemini-2.5-flash-lite">Gemini 2.5 Flash Lite</option>
                    <option value="gemini-flash-latest">Gemini Flash Latest</option>
                    <option value="gemini-flash-lite-latest">Gemini Flash Lite Latest</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {activeTab === "create" ? (
                <>
                  <textarea
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm h-20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none focus-visible:ring-2 focus-visible:ring-blue-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:opacity-100"
                    placeholder={t("fields.functions_placeholder")}
                    value={fungsi}
                    onChange={(e) => { setFungsi(e.target.value); setMessage(""); }}
                  />
                  <textarea
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm h-20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none focus-visible:ring-2 focus-visible:ring-blue-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:opacity-100"
                    placeholder={t("fields.keywords_placeholder")}
                    value={kataKunci}
                    onChange={(e) => { setKataKunci(e.target.value); setMessage(""); }}
                  />
                  <textarea
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm h-20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none focus-visible:ring-2 focus-visible:ring-blue-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:opacity-100"
                    placeholder={t("fields.konteks_placeholder")}
                    value={konteks}
                    onChange={(e) => setKonteks(e.target.value)}
                  />

                  {/* Point of View Dropdown */}
                  <div>
                    <label htmlFor="pov-select" className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-1 flex items-center">
                      <Cpu size={10} className="mr-1" /> {t("fields.pov_label")}
                    </label>
                    <select
                      id="pov-select"
                      value={sudutPandang}
                      onChange={(e) => setSudutPandang(e.target.value)}
                      className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    >
                      <option value="tester">{t("fields.pov_tester")}</option>
                      <option value="analyst">{t("fields.pov_analyst")}</option>
                      <option value="journalist">{t("fields.pov_journalist")}</option>
                    </select>
                  </div>
                  {/* Style Dropdown */}
                  <div>
                    <label htmlFor="style-select" className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-1 flex items-center">
                      <Layout size={10} className="mr-1" /> {t("fields.style_label")}
                    </label>
                    <select
                      id="style-select"
                      value={selectedStyle}
                      onChange={(e) => setSelectedStyle(e.target.value)}
                      className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    >
                      <option value="review">{t("fields.style_review")}</option>
                      <option value="announcement">{t("fields.style_announcement")}</option>
                      <option value="solution">{t("fields.style_solution")}</option>
                      <option value="comparison">{t("fields.style_comparison")}</option>
                      <option value="other">{t("fields.style_other")}</option>
                    </select>
                  </div>

                  <input
                    type="text"
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none focus-visible:ring-2 focus-visible:ring-blue-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:opacity-100"
                    placeholder={t("fields.location_placeholder")}
                    value={lokasi}
                    onChange={(e) => setLokasi(e.target.value)}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="min-words" className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">{t("fields.min_words")}</label>
                      <input
                        id="min-words"
                        type="number"
                        className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                        value={minWords}
                        onChange={(e) => setMinWords(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <label htmlFor="max-words" className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">{t("fields.max_words")}</label>
                      <input
                        id="max-words"
                        type="number"
                        className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                        value={maxWords}
                        onChange={(e) => setMaxWords(parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label id="label-soft-selling" className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Soft Selling
                    </label>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={softSelling}
                      aria-labelledby="label-soft-selling"
                      onClick={() => setSoftSelling(prev => !prev)}
                      className={cn(
                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
                        softSelling ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200",
                          softSelling ? "translate-x-6" : "translate-x-1"
                        )}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label id="label-include-faq" className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Include FAQ
                    </label>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={includeFaq}
                      aria-labelledby="label-include-faq"
                      onClick={() => setIncludeFaq(prev => !prev)}
                      className={cn(
                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
                        includeFaq ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200",
                          includeFaq ? "translate-x-6" : "translate-x-1"
                        )}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label id="label-google-grounding" className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Google Search (Grounding)
                    </label>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={groundingEnabled}
                      aria-labelledby="label-google-grounding"
                      onClick={() => setGroundingEnabled(prev => !prev)}
                      className={cn(
                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
                        groundingEnabled ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200",
                          groundingEnabled ? "translate-x-6" : "translate-x-1"
                        )}
                      />
                    </button>
                  </div>

                  <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setAdvancedOpen(!advancedOpen)}
                      aria-expanded={advancedOpen}
                      aria-controls="advanced-options-panel"
                      className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase flex items-center">
                        <div className={cn("transition-transform duration-200", advancedOpen ? "rotate-180" : "rotate-0")}>
                          <ChevronDown size={14} className="mr-2" />
                        </div>
                        {t("buttons.advanced_options")}
                      </span>
                    </button>
                    {advancedOpen && (
                      <div id="advanced-options-panel" className="p-4 space-y-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{t("fields.competitor_label")}</label>
                            <button
                                onClick={() => {
                                  const researchPrompt = `Saya sedang menulis artikel tentang: ${fungsi}
Kata kunci target: ${kataKunci}

Tolong carikan 3-5 tools/platform kompetitor yang relevan dengan topik ini.
Untuk setiap kompetitor, berikan:
- Nama tool
- Keunggulan utama (1-2 poin)
- Kelemahan utama (1 poin)
- Kisaran harga jika ada

Format output: plain text, langsung bisa saya paste ke form.`;
                                  navigator.clipboard.writeText(researchPrompt);
                                  showToast(t("messages.copied"));
                                }}
                                className="text-xs text-blue-500 hover:text-blue-600 disabled:text-gray-300 dark:disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
                              >
                                📋 Copy Research Prompt
                            </button>
                          </div>
                          <textarea
                            className="w-full border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm h-20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:opacity-100"
                            placeholder={t("fields.competitor_placeholder")}
                            value={kompetitor}
                            onChange={(e) => setKompetitor(e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                           <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{t("fields.negative_label")}</label>
                           <textarea
                            className="w-full border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm h-20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:opacity-100"
                            placeholder={t("fields.negative_placeholder")}
                            value={negativePrompt}
                            onChange={(e) => setNegativePrompt(e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{t("fields.sample")}</label>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <button onClick={useReviewExample} className="text-[10px] px-2 py-1 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">{t("buttons.sample_review")}</button>
                              <button onClick={useFeatureExample} className="text-[10px] px-2 py-1 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">{t("buttons.sample_feature")}</button>
                              <button onClick={useSolutionExample} className="text-[10px] px-2 py-1 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">{t("buttons.sample_solution")}</button>
                              <button onClick={useComparisonExample} className="text-[10px] px-2 py-1 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">{t("buttons.sample_comparison")}</button>
                            </div>
                          </div>
                          <textarea
                            className="w-full border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm h-24 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none focus-visible:ring-2 focus-visible:ring-blue-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:opacity-100"
                            placeholder={t("fields.sample_placeholder")}
                            value={artikelContoh}
                            onChange={(e) => setArtikelContoh(e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : activeTab === "image_prompts" ? (
                <div className="space-y-4">
                  <textarea
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm h-64 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none focus-visible:ring-2 focus-visible:ring-blue-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:opacity-100"
                    placeholder={t("image_prompts.article_placeholder")}
                    value={imagePromptsArticleInput}
                    onChange={(e) => setImagePromptsArticleInput(e.target.value)}
                  />
                  <div className="grid grid-cols-1 gap-4">
                    <textarea
                      className="w-full border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm h-20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none focus-visible:ring-2 focus-visible:ring-blue-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:opacity-100"
                      placeholder={t("fields.functions_placeholder")}
                      value={fungsi}
                      onChange={(e) => { setFungsi(e.target.value); setMessage(""); }}
                    />
                    <textarea
                      className="w-full border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm h-20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none focus-visible:ring-2 focus-visible:ring-blue-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:opacity-100"
                      placeholder={t("fields.keywords_placeholder")}
                      value={kataKunci}
                      onChange={(e) => { setKataKunci(e.target.value); setMessage(""); }}
                    />
                    <textarea
                      className="w-full border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm h-20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none focus-visible:ring-2 focus-visible:ring-blue-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:opacity-100"
                      placeholder={t("fields.konteks_placeholder")}
                      value={konteks}
                      onChange={(e) => setKonteks(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("fields.original_sentence")}</label>
                    <button onClick={handlePaste} className="text-xs text-blue-600 dark:text-blue-400 font-bold flex items-center hover:underline"><Clipboard size={12} className="mr-1" /> {t("buttons.paste")}</button>
                  </div>
                  <textarea
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm h-48 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none focus-visible:ring-2 focus-visible:ring-blue-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:opacity-100"
                    placeholder={t("fields.sentence_placeholder")}
                    value={sentenceInput}
                    onChange={(e) => { setSentenceInput(e.target.value); setMessage(""); }}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setRewriteType("yellow")}
                      aria-pressed={rewriteType === "yellow"}
                      className={cn("p-3 rounded-xl border-2 text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-600", rewriteType === "yellow" ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20" : "border-gray-100 dark:border-gray-800")}
                    >
                      <span className="font-bold text-sm block text-gray-900 dark:text-gray-100">🟡 {t("fields.yellow_label")}</span>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400">{t("fields.yellow_desc")}</span>
                    </button>
                    <button
                      onClick={() => setRewriteType("red")}
                      aria-pressed={rewriteType === "red"}
                      className={cn("p-3 rounded-xl border-2 text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-600", rewriteType === "red" ? "border-red-400 bg-red-50 dark:bg-red-900/20" : "border-gray-100 dark:border-gray-800")}
                    >
                      <span className="font-bold text-sm block text-gray-900 dark:text-gray-100">🔴 {t("fields.red_label")}</span>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400">{t("fields.red_desc")}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {message && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 p-3 rounded-lg flex items-center text-red-600 dark:text-red-400 text-sm animate-in fade-in slide-in-from-top-1">
                  <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                  {message}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleClear}
                  className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-semibold py-3 rounded-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                >
                  <Trash2 size={18} className="mr-2" />
                  {t("buttons.clear_input")}
                  <kbd className="ml-2 text-[10px] bg-black/10 dark:bg-white/10 border border-black/20 dark:border-white/20 rounded px-1 font-sans">{navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}K</kbd>
                </button>
                <button id="btn-generate" disabled={loading} onClick={handleGenerate} className={cn("flex-[2] text-white font-semibold py-3 rounded-lg flex items-center justify-center transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2", activeTab === "fix" ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-600 hover:bg-blue-700")}>
                  {loading ? <span className="flex items-center"><RotateCcw size={16} className="animate-spin mr-2" /> {statusText}</span> : <><Sparkles size={18} className="mr-2" /> {activeTab === "create" ? t("buttons.generate") : activeTab === "image_prompts" ? t("buttons.generate_image_prompts") : t("buttons.fix_now")} <kbd className="ml-2 text-[10px] bg-white/20 border border-white/30 rounded px-1 font-sans">{navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}↵</kbd></>}
                </button>
              </div>
          </section>

          {history.length > 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
              <button
                onClick={() => setHistoryOpen(!historyOpen)}
                  aria-expanded={historyOpen}
                  aria-controls="history-panel"
                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center font-semibold text-gray-800 dark:text-gray-200">
                  <History size={18} className="mr-2 text-blue-500" />
                  {t("buttons.history")}
                </div>
                {historyOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {historyOpen && (
                  <div id="history-panel" className="divide-y divide-gray-100 dark:divide-gray-800 max-h-[400px] overflow-y-auto">
                  {history.map((item) => (
                    <div key={item.id} className="p-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] text-gray-400 font-mono">{item.timestamp}</span>
                          <span className={cn(
                            "text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase",
                            item.type === "create" ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" : "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                          )}>
                            {item.type}
                          </span>
                        </div>
                        <button
                          onClick={() => restoreHistory(item)}
                          className="min-h-[44px] text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center"
                        >
                          <RotateCcw size={10} className="mr-1" /> {t("buttons.restore")}
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                        {item.type === "create"
                          ? (item.params.kataKunci || item.params.fungsi || "").toString().substring(0, 40) + ((item.params.kataKunci || item.params.fungsi || "").toString().length > 40 ? "..." : "")
                          : item.params.sentence?.toString().substring(0, 40) + (item.params.sentence?.toString().length > 40 ? "..." : "")
                        }
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Output Section (Right Column) */}
        <div className="lg:col-span-7 space-y-6">
          <section className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-6 min-h-[600px] flex flex-col transition-colors duration-300">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                <FileText size={18} className="mr-2 text-green-500" />
                {activeTab === "create" ? t("output.generation_output") : activeTab === "image_prompts" ? t("image_prompts.title") : t("output.fix_result")}
              </h2>

              {activeTab === "create" && articleOutput && (
                <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setImagePromptsArticleInput(articleOutput);
                        setActiveTab("image_prompts");
                        setImagePromptsOutput([]);
                      }}
                      className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold flex items-center hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                    >
                      <ImageIcon size={14} className="mr-1" />
                      {t("buttons.generate_image_prompts")}
                    </button>
                    <button onClick={() => downloadFile(articleOutput, "txt")} aria-label="Download as .txt" className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-500 dark:text-gray-400 transition-colors" title="Download .txt"><Download size={16} /></button>
                    <button onClick={() => downloadFile(articleOutput, "md")} aria-label="Download as .md" className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-500 dark:text-gray-400 font-bold text-xs transition-colors" title="Download .md">MD</button>
                </div>
              )}
            </div>

            {activeTab === "create" && articleOutput && (
              <div className="flex flex-wrap gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                {/* Word Count Badge */}
                {(() => {
                  let color = "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
                  if (wordCount < 0.9 * minWords || wordCount > 1.1 * maxWords) {
                    color = "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
                  } else if (wordCount < minWords || wordCount > maxWords) {
                    color = "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20";
                  }
                  return (
                    <div title={`Target: ${minWords} - ${maxWords} words`} className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center transition-colors", color)}>
                      <FileText size={10} className="mr-1.5" />
                      {t("seo.word_count")}: {wordCount}
                    </div>
                  );
                })()}

                {/* Keyword Density Badge */}
                {kataKunci && (() => {
                  let color = "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
                  if (keywordDensity < 0.5 || keywordDensity > 5) {
                    color = "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
                  } else if (keywordDensity < 1 || keywordDensity > 3) {
                    color = "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20";
                  }
                  return (
                    <div title="Target: 1% - 3%" className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center transition-colors", color)}>
                      <Sparkles size={10} className="mr-1.5" />
                      {t("seo.keyword_density")}: {keywordDensity.toFixed(1)}%
                    </div>
                  );
                })()}

                {/* Meta Length Badge */}
                {metaOutput && (() => {
                  let color = "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
                  if (metaLength < 100 || metaLength > 180) {
                    color = "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
                  } else if (metaLength < 120 || metaLength > 160) {
                    color = "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20";
                  }
                  return (
                    <div title="Target: 120 - 160 characters" className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center transition-colors", color)}>
                      <Layout size={10} className="mr-1.5" />
                      {t("seo.meta_length")}: {metaLength}
                    </div>
                  );
                })()}
              </div>
            )}

            <div className="space-y-6 flex-1">
              {activeTab === "create" ? (
                <>
                  <div className="relative group">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t("output.article")}</h3>
                      <button onClick={() => copyToClipboard(articleOutput, "article")} aria-label="Copy article" className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{copiedKey === "article" ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}</button>
                    </div>
                    <div className="w-full border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-sm bg-gray-50 dark:bg-gray-800 min-h-[400px] whitespace-pre-wrap text-gray-800 dark:text-gray-200 transition-colors">
                      {articleOutput || <span className="text-gray-300 dark:text-gray-600 italic">{t("output.rewritten_placeholder")}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400">{t("output.meta")}</h3>
                        <button onClick={() => copyToClipboard(metaOutput, "meta")} aria-label="Copy meta description" className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{copiedKey === "meta" ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}</button>
                      </div>
                      <div className="w-full border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-xs bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[60px] transition-colors">{metaOutput}</div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400">{t("output.slug")}</h3>
                        <button onClick={() => copyToClipboard(slugOutput, "slug")} aria-label="Copy slug" className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{copiedKey === "slug" ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}</button>
                      </div>
                      <div className="w-full border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-xs bg-gray-50 dark:bg-gray-800 font-mono text-blue-600 dark:text-blue-400 min-h-[60px] flex items-center transition-colors">{slugOutput}</div>
                    </div>
                  </div>
                </>
              ) : activeTab === "image_prompts" ? (
                <div className="space-y-6 flex-1">
                  {imagePromptsOutput.length > 0 ? (
                    imagePromptsOutput.map((item, idx) => (
                      <div key={idx} className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center">
                            <ImageIcon size={12} className="mr-1 text-blue-500" /> {item.reference}
                          </span>
                          <button
                            onClick={() => {
                              copyToClipboard(item.prompt, `prompt-${idx}`);
                            }}
                            aria-label={`Copy image prompt ${idx + 1}`}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            {copiedKey === `prompt-${idx}` ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                          </button>
                        </div>
                        <textarea
                          readOnly
                          className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm h-32 text-gray-700 dark:text-gray-300 outline-none resize-none"
                          value={item.prompt}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-600">
                      <ImageIcon size={48} className="mb-4 opacity-20" />
                      <p className="text-sm italic">{t("output.rewritten_placeholder")}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative group flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t("output.rewritten_label")}</h3>
                    <button onClick={() => copyToClipboard(sentenceOutput, "fix")} aria-label="Copy fix result" className="text-gray-400 dark:text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">{copiedKey === "fix" ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}</button>
                  </div>
                  <div className="w-full border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-lg font-medium bg-gray-50 dark:bg-gray-800 flex-1 min-h-[400px] leading-relaxed text-gray-800 dark:text-gray-200 transition-colors">
                    {sentenceOutput || <span className="text-gray-300 dark:text-gray-600 italic">{t("output.rewritten_placeholder")}</span>}
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

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-24 md:bottom-6 right-6 z-[60] flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-lg px-4 py-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {toast.type === "success" ? (
            <Check size={18} className="text-green-500 mr-2" />
          ) : (
            <AlertCircle size={18} className="text-red-500 mr-2" />
          )}
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{toast.message}</span>
        </div>
      )}

      {/* Mobile Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-around items-center p-2">
        <button
          onClick={() => setActiveTab("create")}
          className={cn(
            "flex flex-col items-center p-2 rounded-lg transition-colors",
            activeTab === "create" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
          )}
        >
          <PlusCircle size={20} />
          <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">Create</span>
        </button>
        <button
          onClick={() => setActiveTab("fix")}
          className={cn(
            "flex flex-col items-center p-2 rounded-lg transition-colors",
            activeTab === "fix" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
          )}
        >
          <Edit3 size={20} />
          <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">Fix</span>
        </button>
        <button
          onClick={() => setActiveTab("image_prompts")}
          className={cn(
            "flex flex-col items-center p-2 rounded-lg transition-colors",
            activeTab === "image_prompts" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
          )}
        >
          <ImageIcon size={20} />
          <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">Images</span>
        </button>
      </nav>
    </main>
  );
}