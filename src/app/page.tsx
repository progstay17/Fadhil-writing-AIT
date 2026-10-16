"use client";

import { useState, useEffect, useRef, useCallback, useMemo, memo, useDeferredValue } from "react";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import { useTranslation } from "react-i18next";
import { type TFunction } from "i18next";
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


const FADE_UP = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.35, ease: easeOut }
};

const FADE_IN = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.25 }
};

const STAGGER_CONTAINER = {
  animate: { transition: { staggerChildren: 0.07 } }
};


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

const HistorySection = memo(({
 history,
 historyOpen,
 setHistoryOpen,
 restoreHistory,
 t
}: {
 history: GenerationResult[];
 historyOpen: boolean;
 setHistoryOpen: (open: boolean) => void;
 restoreHistory: (item: GenerationResult) => void;
 t: TFunction;
}) => {
 if (history.length === 0) return null;
 return (
 <motion.div whileHover={{ borderColor: "var(--color-border-[var(--color-accent)])" }} transition={{ duration: 0.2 }} className="bg-[var(--color-surface)] rounded-sm border border-[var(--color-border)] overflow-hidden transition-colors duration-300">
 <button
 onClick={() => setHistoryOpen(!historyOpen)}
 aria-expanded={historyOpen}
 aria-controls="history-panel"
 className="w-full flex items-center justify-between p-4 bg-[var(--color-surface-2)]/50 hover:bg-[var(--color-surface-2)] transition-colors"
 >
 <div className="flex items-center font-semibold text-[var(--color-text)]"> <History size={18} className="mr-2 text-[#cc2200]" />
 {t("buttons.history")}
 </div>
 {historyOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
 </button>

 {historyOpen && (
 <div id="history-panel" className="divide-y divide-[var(--color-border)] max-h-[400px] overflow-y-auto">
 {history.map((item) => (
 <div key={item.id} className="p-4 hover:bg-[var(--color-surface-2)] transition-colors">
 <div className="flex justify-between items-start mb-1">
 <div className="flex items-center space-x-2">
 <span className="text-[10px] text-[var(--color-text-dim)] font-mono">{item.timestamp}</span>
 <span className={cn( "text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase", item.type === "create" ? "bg-[#ecfdf5] dark:bg-[#001a00] text-[#059669] dark:text-[#44cc44]" : "bg-[#fff7ed] dark:bg-[#1a0800] text-[#d97706] dark:text-[#cc6600]"  )}>
 {item.type}
 </span>
 </div>
 <button
 onClick={() => restoreHistory(item)}
 className="min-h-[44px] text-[10px] text-[#cc2200] font-bold hover:underline flex items-center"
 >
 <RotateCcw size={10} className="mr-1" /> {t("buttons.restore")}
 </button>
 </div>
 <p className="text-xs text-[var(--color-text-muted)] line-clamp-1">
 {item.type === "create"
 ? (item.params.kataKunci || item.params.fungsi || "").toString().substring(0, 40) + ((item.params.kataKunci || item.params.fungsi || "").toString().length > 40 ? "..." : "")
 : item.params.sentence?.toString().substring(0, 40) + (item.params.sentence?.toString().length > 40 ? "..." : "")
 }
 </p>
 </div>
       ))}
        </div>
      )}
    </motion.div>
 );
});
HistorySection.displayName = "HistorySection";

const SEOStats = memo(({
 activeTab,
 hasArticleOutput,
 wordCount,
 keywordDensity,
 metaLength,
 minWords,
 maxWords,
 hasKataKunci,
 hasMetaOutput,
 t
}: {
 activeTab: string;
 hasArticleOutput: boolean;
 wordCount: number;
 keywordDensity: number;
 metaLength: number;
 minWords: number;
 maxWords: number;
 hasKataKunci: boolean;
 hasMetaOutput: boolean;
 t: TFunction;
}) => {
 if (activeTab !== "create" || !hasArticleOutput) return null;

 return (
 <div className="flex flex-wrap gap-2 pb-2 border-b border-[var(--color-border)]">
 {/* Word Count Badge */}
 {(() => {
 let color = "text-[#059669] dark:text-[#44cc44] bg-[#ecfdf5] dark:bg-[#001a00]";
 if (wordCount < 0.9 * minWords || wordCount > 1.1 * maxWords) {
 color = "text-[#dc2626] dark:text-[#cc4444] bg-[#fef2f2] dark:bg-[#1a0000]";
 } else if (wordCount < minWords || wordCount > maxWords) {
 color = "text-[#d97706] dark:text-[#ccaa00] bg-[#fff7ed] dark:bg-[#1a1500]";
 }
 return (
 <div title={`Target: ${minWords} - ${maxWords} words`} className={cn("px-2.5 py-1 rounded-sm text-[10px] font-bold flex items-center transition-colors", color)}>
 <FileText size={10} className="mr-1.5" />
 {t("seo.word_count")}: {wordCount}
 </div>
 );
 })()}

 {/* Keyword Density Badge */}
 {hasKataKunci && (() => {
 let color = "text-[#059669] dark:text-[#44cc44] bg-[#ecfdf5] dark:bg-[#001a00]";
 if (keywordDensity < 0.5 || keywordDensity > 5) {
 color = "text-[#dc2626] dark:text-[#cc4444] bg-[#fef2f2] dark:bg-[#1a0000]";
 } else if (keywordDensity < 1 || keywordDensity > 3) {
 color = "text-[#d97706] dark:text-[#ccaa00] bg-[#fff7ed] dark:bg-[#1a1500]";
 }
 return (
 <div title="Target: 1% - 3%" className={cn("px-2.5 py-1 rounded-sm text-[10px] font-bold flex items-center transition-colors", color)}>
 <Sparkles size={10} className="mr-1.5" />
 {t("seo.keyword_density")}: {keywordDensity.toFixed(1)}%
 </div>
 );
 })()}

 {/* Meta Length Badge */}
 {hasMetaOutput && (() => {
 let color = "text-[#059669] dark:text-[#44cc44] bg-[#ecfdf5] dark:bg-[#001a00]";
 if (metaLength < 100 || metaLength > 180) {
 color = "text-[#dc2626] dark:text-[#cc4444] bg-[#fef2f2] dark:bg-[#1a0000]";
 } else if (metaLength < 120 || metaLength > 160) {
 color = "text-[#d97706] dark:text-[#ccaa00] bg-[#fff7ed] dark:bg-[#1a1500]";
 }
 return (
 <div title="Target: 120 - 160 characters" className={cn("px-2.5 py-1 rounded-sm text-[10px] font-bold flex items-center transition-colors", color)}>
 <Layout size={10} className="mr-1.5" />
 {t("seo.meta_length")}: {metaLength}
 </div>
 );
 })()}
 </div>
 );
});
SEOStats.displayName = "SEOStats";

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

 // Use deferred values for heavy SEO calculations to avoid blocking the UI during streaming
 const deferredArticleOutput = useDeferredValue(articleOutput);
 const deferredMetaOutput = useDeferredValue(metaOutput);
 const deferredKataKunci = useDeferredValue(kataKunci);

 // Memoized SEO Calculations using deferred values
 // ⚡ Bolt Optimization: useDeferredValue prevents heavy regex/calculations from blocking the main thread during high-frequency streaming updates
 const wordCount = useMemo(() => {
 if (!deferredArticleOutput) return 0;
 return deferredArticleOutput.trim().split(/\s+/).length;
 }, [deferredArticleOutput]);

 const keywordDensity = useMemo(() => {
 if (!deferredArticleOutput || !deferredKataKunci) return 0;
 const words = wordCount || 1;
 try {
 // ⚡ Bolt Optimization: Use a global case-insensitive regex for faster keyword counting
 const escapedKw = deferredKataKunci.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
 const regex = new RegExp(escapedKw, "gi");
 const matches = deferredArticleOutput.match(regex);
 const count = matches ? matches.length : 0;
 return (count / words) * 100;
 } catch {
 return 0;
 }
 }, [deferredKataKunci, wordCount, deferredArticleOutput]);

 const metaLength = useMemo(() => {
 if (!deferredMetaOutput) return 0;
 return deferredMetaOutput.length;
 }, [deferredMetaOutput]);

 const loadingInterval = useRef<NodeJS.Timeout | null>(null);
 const statusInterval = useRef<NodeJS.Timeout | null>(null);

 useEffect(() => {
 const stored = localStorage.getItem('theme');
 const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
 const resolved = stored === 'dark' || (!stored && prefersDark) ? 'dark' : 'light';

 fetch("/api/auth/me")
 .then(res => { if (!res.ok) window.location.href = "/login"; })
 .catch(() => { window.location.href = "/login"; });

 // Use setTimeout to move the setTheme call out of the synchronous render path
 // and resolve the "cascading render" lint error.
 setTimeout(() => {
 setTheme(resolved);
 document.documentElement.classList.toggle('dark', resolved === 'dark');
        document.documentElement.classList.toggle('light', resolved === 'light');
 }, 0);
 }, []);





 const handleLogout = async () => {
 await fetch("/api/auth/logout", { method: "POST" });
 window.location.href = "/login";
 };

 const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
    document.documentElement.classList.toggle("light", next === "light");
  };

 const changeLanguage = (l: string) => {
 i18n.changeLanguage(l);
 setLang(l);
 };

 const startLoadingAnimation = useCallback(() => {
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
 }, [t]);

 const stopLoadingAnimation = useCallback(() => {
 if (loadingInterval.current) clearInterval(loadingInterval.current);
 if (statusInterval.current) clearInterval(statusInterval.current);
 setProgress(100);
 setTimeout(() => { setProgress(0); setLoading(false); }, 500);
 }, []);

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
 const normalized = fullText.replace(/<<<\s*(ARTIKEL|META|SLUG)\s*>>>/gi, (_: unknown, tag: string) => `<<<${tag.toUpperCase()}>>>`);

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
 let lastUpdate = Date.now();

 while (true) {
 const { done, value } = await reader.read();
 if (done) break;
 const chunk = decoder.decode(value);
 fullText += chunk;

 // Throttle UI updates to once every 100ms to reduce CPU load and re-renders
 const now = Date.now();
 if (now - lastUpdate > 100) {
 setArticleOutput(fullText);
 lastUpdate = now;
 }
 }
 setArticleOutput(fullText); // Final update

 const fullTrimmed = fullText
  .replace(/```[\s\S]*?```/g, (match) => match.replace(/```\w*\n?/g, ""))
           .trim();

 const normalized = fullTrimmed.replace(/<<<\s*(ARTIKEL|META|SLUG)\s*>>>/gi, (_: unknown, tag: string) => `<<<${tag.toUpperCase()}>>>`);

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
 }, [activeTab, fungsi, kataKunci, lokasi, artikelContoh, selectedStyle, softSelling, includeFaq, groundingEnabled, kompetitor, contentLang, model, minWords, maxWords, konteks, sudutPandang, negativePrompt, imagePromptsArticleInput, sentenceInput, rewriteType, t, startLoadingAnimation, stopLoadingAnimation]);

 const restoreHistory = useCallback((item: GenerationResult) => {
 setActiveTab(item.type);
 if (item.type === "create") {
 setArticleOutput(item.article || "");
 setMetaOutput(item.meta || "");
 setSlugOutput(item.slug || "");
 } else {
 setSentenceOutput(item.rewritten || "");
 }
 }, []);

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
    <main className="min-h-screen bg-[var(--color-bg)] pb-20 transition-colors duration-300">
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 w-full h-[2px] bg-[var(--color-surface-2)] z-50 overflow-hidden"
          >
            <motion.div
              className="h-full bg-[#cc2200]"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: easeOut }}
            />
            <motion.div
              className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ["-80px", "100vw"] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: easeOut }}
        className="bg-[var(--color-surface)] border-b border-[var(--color-border)] sticky top-0 z-10 transition-colors duration-300"
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="seal w-10 h-10 mr-4 text-[10px] leading-tight select-none">潮际<br/>好麦</div>
            <div className="flex flex-col">
              <h1 className="text-[var(--color-accent)]xl font-black tracking-tighter text-[var(--color-text)] leading-none">
                <span className="font-['Noto_Serif_SC'] uppercase">{t("title")}</span>
              </h1>
              <span className="font-['JetBrains_Mono'] text-[var(--color-accent)] text-[10px] font-bold tracking-widest mt-1">AIT_ENGINE v2.0</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">


          </div>

          <div className="flex items-center space-x-4">
            <nav className="relative hidden md:flex space-x-8 px-4 border-b border-[var(--color-border)]">
              {["create", "fix", "image_prompts"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "relative px-0 py-4 text-xs font-bold transition-colors flex items-center uppercase tracking-widest font-['JetBrains_Mono'] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] outline-none",
                    activeTab === tab ? "text-[var(--color-accent)] tab-active-bar" : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                  )}
                >
                  {tab === "create" && <PlusCircle size={14} className="mr-2" />}
                  {tab === "fix" && <Edit3 size={14} className="mr-2" />}
                  {tab === "image_prompts" && <ImageIcon size={14} className="mr-2" />}
                  {t(`tabs.${tab}`)}
                </button>
              ))}
            </nav>

            <div className="flex bg-[var(--color-surface-2)] rounded-sm p-1 relative">
              {["zh", "en", "id"].map((l) => (
                <button
                  key={l}
                  onClick={() => changeLanguage(l)}
                  className={cn(
                    "relative px-3 py-1 rounded-md text-xs font-medium uppercase transition-colors z-10 focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] outline-none",
                    lang === l ? "text-white" : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                  )}
                >
                  {lang === l && (
                    <motion.div
                      layoutId="lang-indicator"
                      className="absolute inset-0 bg-[#cc2200] rounded-md"
                      style={{ zIndex: -1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}
                  {l}
                </button>
              ))}
            </div>

            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-sm border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] transition-colors text-[var(--color-text-muted)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] outline-none"
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button
              onClick={handleLogout}
              aria-label="Logout"
              className="p-2 rounded-sm border border-[var(--color-border)] hover:bg-[#fff1f0] dark:hover:bg-[#1a0000] transition-colors text-[var(--color-text-muted)] hover:text-[#cc2200] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] outline-none"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </motion.header>

      <div className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} {...FADE_UP} className="space-y-6">
              <motion.section
                whileHover={{ borderColor: "var(--color-border-[var(--color-accent)])" }}
                transition={{ duration: 0.2 }}
                className="bg-[var(--color-surface)] rounded-sm border border-[var(--color-border)] p-6 space-y-4 transition-colors duration-300"
              >
                <div className="flex justify-between items-start mb-2">
                  <h2 className="font-semibold text-[var(--color-text)] flex items-center mt-1">
                    {activeTab === "create" ? (
                      <><PlusCircle size={18} className="mr-2 text-[#cc2200]" /> {t("tabs.create")}</>
                    ) : activeTab === "image_prompts" ? (
                      <><ImageIcon size={18} className="mr-2 text-purple-500" /> {t("tabs.image_prompts")}</>
                    ) : (
                      <><Edit3 size={18} className="mr-2 text-orange-500" /> {t("tabs.fix")}</>
                    )}
                  </h2>
                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex items-center space-x-2">
                      <label htmlFor="contentLang" className="text-[10px] text-[var(--color-text-dim)] font-bold uppercase tracking-wider cursor-pointer">{t("fields.content_lang")}</label>
                      <select id="contentLang" value={contentLang} onChange={(e) => setContentLang(e.target.value)} className="text-[10px] border border-[var(--color-border)] rounded px-2 py-1 bg-[var(--color-surface-2)] text-[var(--color-text)] font-medium outline-none">
                        <option value="ID">ID</option>
                        <option value="EN">EN</option>
                        <option value="ZH">ZH</option>
                      </select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <label htmlFor="model" className="text-[10px] text-[var(--color-text-dim)] font-bold uppercase tracking-wider cursor-pointer">Model</label>
                      <select id="model" value={model} onChange={(e) => setModel(e.target.value)} className="text-[10px] border border-[var(--color-border)] rounded px-2 py-1 bg-[var(--color-surface-2)] text-[var(--color-text)] font-medium outline-none">
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

                <motion.div variants={STAGGER_CONTAINER} initial="initial" animate="animate" className="space-y-4">
                  {activeTab === "create" ? (
                    <>
                      <motion.div variants={FADE_UP}>
                        <label htmlFor="fungsi" className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2 font-['JetBrains_Mono'] block cursor-pointer">{t("fields.functions")}</label>
                        <textarea id="fungsi" className="w-full border border-[var(--color-border)] rounded-sm p-3 text-sm h-20 bg-[var(--color-surface-2)] text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-dim)]" placeholder={t("fields.functions_placeholder")} value={fungsi} onChange={(e) => { setFungsi(e.target.value); setMessage(""); }} />
                      </motion.div>
                      <motion.div variants={FADE_UP}>
                        <label htmlFor="kataKunci" className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2 font-['JetBrains_Mono'] block cursor-pointer">{t("fields.keywords")}</label>
                        <textarea id="kataKunci" className="w-full border border-[var(--color-border)] rounded-sm p-3 text-sm h-20 bg-[var(--color-surface-2)] text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-dim)]" placeholder={t("fields.keywords_placeholder")} value={kataKunci} onChange={(e) => { setKataKunci(e.target.value); setMessage(""); }} />
                      </motion.div>
                      <motion.div variants={FADE_UP}>
                        <label htmlFor="konteks" className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2 font-['JetBrains_Mono'] block cursor-pointer">{t("fields.konteks")}</label>
                        <textarea id="konteks" className="w-full border border-[var(--color-border)] rounded-sm p-3 text-sm h-20 bg-[var(--color-surface-2)] text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-dim)]" placeholder={t("fields.konteks_placeholder")} value={konteks} onChange={(e) => { setKonteks(e.target.value); setMessage(""); }} />
                      </motion.div>
                      <motion.div variants={FADE_UP} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="sudutPandang" className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider font-['JetBrains_Mono']">{t("fields.pov")}</label>
                          <select id="sudutPandang" value={sudutPandang} onChange={(e) => setSudutPandang(e.target.value)} className="w-full border border-[var(--color-border)] rounded-sm px-3 py-2 text-sm bg-[var(--color-surface-2)] text-[var(--color-text)] outline-none">
                            <option value="analyst">{t("pov.analyst")}</option>
                            <option value="tester">{t("pov.tester")}</option>
                            <option value="journalist">{t("pov.journalist")}</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="selectedStyle" className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider font-['JetBrains_Mono']">{t("fields.style")}</label>
                          <select id="selectedStyle" value={selectedStyle} onChange={(e) => setSelectedStyle(e.target.value)} className="w-full border border-[var(--color-border)] rounded-sm px-3 py-2 text-sm bg-[var(--color-surface-2)] text-[var(--color-text)] outline-none">
                            <option value="review">{t("styles.review")}</option>
                            <option value="feature">{t("styles.feature")}</option>
                            <option value="solution">{t("styles.solution")}</option>
                            <option value="comparison">{t("styles.comparison")}</option>
                            <option value="freestyle">{t("fields.style_freestyle")}</option>
                          </select>
                        </div>
                      </motion.div>
                      <motion.div variants={FADE_UP} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="lokasi" className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider font-['JetBrains_Mono']">{t("fields.location")}</label>
                          <input id="lokasi" type="text" className="w-full border border-[var(--color-border)] rounded-sm p-3 text-sm bg-[var(--color-surface-2)] text-[var(--color-text)] outline-none" placeholder={t("fields.location_placeholder")} value={lokasi} onChange={(e) => setLokasi(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="minWords" className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider font-['JetBrains_Mono']">{t("fields.min_words")}</label>
                          <input id="minWords" type="number" className="w-full border border-[var(--color-border)] rounded-sm px-3 py-2 text-sm bg-[var(--color-surface-2)] text-[var(--color-text)] outline-none" value={minWords} onChange={(e) => setMinWords(Number(e.target.value))} />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="maxWords" className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider font-['JetBrains_Mono']">{t("fields.max_words")}</label>
                          <input id="maxWords" type="number" className="w-full border border-[var(--color-border)] rounded-sm px-3 py-2 text-sm bg-[var(--color-surface-2)] text-[var(--color-text)] outline-none" value={maxWords} onChange={(e) => setMaxWords(Number(e.target.value))} />
                        </div>
                      </motion.div>
                      <motion.div variants={FADE_UP} className="flex flex-wrap gap-6 pt-2">
                        {[
                          { id: "toggle-soft-selling", state: softSelling, setter: setSoftSelling, label: "Soft Selling" },
                          { id: "toggle-include-faq", state: includeFaq, setter: setIncludeFaq, label: "FAQ" },
                          { id: "toggle-grounding", state: groundingEnabled, setter: setGroundingEnabled, label: "Grounding" }
                        ].map(tgl => (
                          <div key={tgl.id} className="flex items-center space-x-3">
                            <button
                              type="button"
                              role="switch"
                              aria-checked={tgl.state}
                              onClick={() => tgl.setter(!tgl.state)}
                              className={cn("relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] outline-none", tgl.state ? "bg-[#cc2200]" : "bg-[var(--color-border)]")}
                            >
                              <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white transition-transform", tgl.state ? "translate-x-6" : "translate-x-1")} />
                            </button>
                            <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">{tgl.label}</label>
                          </div>
                        ))}
                      </motion.div>
                      <motion.div variants={FADE_UP} className="border-t border-[var(--color-border)] pt-4">
                        <button
                          onClick={() => setAdvancedOpen(!advancedOpen)}
                          aria-expanded={advancedOpen}
                          aria-controls="advanced-options-panel"
                          className="w-full flex items-center justify-between p-3 bg-[var(--color-surface-2)]/50 hover:bg-[var(--color-surface-2)] rounded-sm transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] outline-none"
                        >
                          <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase flex items-center"><Cpu size={14} className="mr-2" /> Advanced Options</span>
                          {advancedOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                        <AnimatePresence>
                          {advancedOpen && (
                            <motion.div
                              id="advanced-options-panel"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="space-y-4 pt-4 overflow-hidden"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">{t("fields.competitor_label")}</label>
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      type="button"
                                      onClick={() => {
                                        const prompt = `Lakukan riset kompetitor untuk produk dengan fungsi: "${fungsi}". Kata kunci utama: "${kataKunci}". Cari minimal 3-5 kompetitor utama, analisis keunggulan dan kelemahan masing-masing, lalu sajikan dalam format singkat yang bisa langsung digunakan sebagai referensi penulisan artikel.`;
                                        copyToClipboard(prompt, "research_prompt");
                                      }}
                                      className="flex items-center gap-1 text-[10px] font-bold text-[var(--color-accent)] hover:opacity-70 transition-opacity font-['JetBrains_Mono'] uppercase tracking-wider"
                                    >
                                      {copiedKey === "research_prompt" ? <Check size={11} className="text-green-500" /> : <Copy size={11} />}
                                      <span>{copiedKey === "research_prompt" ? t("buttons.copied") : t("buttons.copy_research_prompt")}</span>
                                    </motion.button>
                                  </div>
                                  <textarea className="w-full border border-[var(--color-border)] rounded-sm p-3 text-sm h-20 bg-[var(--color-surface-2)] text-[var(--color-text)]" placeholder={t("fields.competitor_placeholder")} value={kompetitor} onChange={(e) => setKompetitor(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">{t("fields.negative_label")}</label>
                                  <textarea className="w-full border border-[var(--color-border)] rounded-sm p-3 text-sm h-20 bg-[var(--color-surface-2)] text-[var(--color-text)]" placeholder={t("fields.negative_placeholder")} value={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)} />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center mb-1">
                                  <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">{t("fields.sample")}</label>
                                  <div className="flex flex-wrap gap-2">
                                    <button onClick={useReviewExample} className="text-[10px] px-2 py-1 rounded-full border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] transition-colors">{t("buttons.sample_review")}</button>
                                    <button onClick={useFeatureExample} className="text-[10px] px-2 py-1 rounded-full border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] transition-colors">{t("buttons.sample_feature")}</button>
                                    <button onClick={useSolutionExample} className="text-[10px] px-2 py-1 rounded-full border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] transition-colors">{t("buttons.sample_solution")}</button>
                                    <button onClick={useComparisonExample} className="text-[10px] px-2 py-1 rounded-full border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] transition-colors">{t("buttons.sample_comparison")}</button>
                                  </div>
                                </div>
                                <textarea className="w-full border border-[var(--color-border)] rounded-sm p-3 text-sm h-24 bg-[var(--color-surface-2)] text-[var(--color-text)]" placeholder={t("fields.sample_placeholder")} value={artikelContoh} onChange={(e) => setArtikelContoh(e.target.value)} />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </>
                  ) : activeTab === "image_prompts" ? (
                    <motion.div variants={FADE_UP} className="space-y-4">
                      <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2 block">Article Content</label>
                      <textarea className="w-full border border-[var(--color-border)] rounded-sm p-3 text-sm h-64 bg-[var(--color-surface-2)] text-[var(--color-text)]" placeholder={t("image_prompts.article_placeholder")} value={imagePromptsArticleInput} onChange={(e) => setImagePromptsArticleInput(e.target.value)} />
                    </motion.div>
                  ) : (
                    <motion.div variants={FADE_UP} className="space-y-4">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">{t("fields.original_sentence")}</label>
                        <button onClick={handlePaste} className="text-xs text-[#cc2200] font-bold flex items-center hover:underline"><Clipboard size={12} className="mr-1" /> {t("buttons.paste")}</button>
                      </div>
                      <textarea className="w-full border border-[var(--color-border)] rounded-sm p-4 text-sm h-48 bg-[var(--color-surface-2)] text-[var(--color-text)]" placeholder={t("fields.sentence_placeholder")} value={sentenceInput} onChange={(e) => { setSentenceInput(e.target.value); setMessage(""); }} />
                      <div className="grid grid-cols-2 gap-3">
                        {["yellow", "red"].map(type => (
                          <button
                            key={type}
                            onClick={() => setRewriteType(type as "yellow" | "red")}
                            className={cn(
                              "p-3 rounded-sm border-[var(--color-accent)] text-left transition-colors",
                              rewriteType === type
                                ? (type === "yellow"
                                  ? "border-[#f59e0b] bg-[#fffbeb] dark:bg-[#1a1500]"
                                  : "border-[#cc2200] bg-[#fff1f0] dark:bg-[#1a0000]")
                                : "bg-[var(--color-surface)] border-[var(--color-border-2)]"
                            )}
                          >
                            <span className="font-bold text-sm block text-[var(--color-text)]">
                              {type === "yellow" ? "🟡" : "🔴"} {t(`fields.${type}_label`)}
                            </span>
                            <span className="text-[10px] text-[var(--color-text)] opacity-70">
                              {t(`fields.${type}_desc`)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                <AnimatePresence>
                  {message && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-[#fef2f2] dark:bg-[#1a0000] border border-[#cc2200] p-3 rounded-sm flex items-center text-[#dc2626] dark:text-[#cc4444] text-sm overflow-hidden">
                      <AlertCircle size={16} className="mr-2 flex-shrink-0" /> {message}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-3">
                  <button
                    onClick={handleClear}
                    className="flex-1 border border-[var(--color-border)] text-[var(--color-text-muted)] font-semibold py-3 rounded-sm flex items-center justify-center hover:bg-[var(--color-surface-2)] transition-all focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] outline-none"
                  >
                    <Trash2 size={18} className="mr-2" /> {t("buttons.clear_input")}
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 6px 30px #cc220055" }}
                    whileTap={{ scale: 0.96 }}
                    animate={loading ? { boxShadow: ["0 4px 20px #cc220033", "0 4px 30px #cc220077", "0 4px 20px #cc220033"] } : {}}
                    transition={loading ? { duration: 1.2, repeat: Infinity } : { duration: 0.15 }}
                    disabled={loading}
                    onClick={handleGenerate}
                    className={cn("flex-[2] text-white font-semibold py-3 rounded-sm flex items-center justify-center transition-all focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] outline-none", activeTab === "fix" ? "bg-orange-500 hover:bg-orange-600" : "bg-[#cc2200] hover:bg-[#991a00]")}
                  >
                    {loading ? <span className="flex items-center"><RotateCcw size={16} className="animate-spin mr-2" /> {statusText}</span> : <><Sparkles size={18} className="mr-2" /> {activeTab === "create" ? t("buttons.generate") : activeTab === "image_prompts" ? t("buttons.generate_image_prompts") : t("buttons.fix_now")}</>}
                  </motion.button>
                </div>
              </motion.section>

              <HistorySection history={history} historyOpen={historyOpen} setHistoryOpen={setHistoryOpen} restoreHistory={restoreHistory} t={t} />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <motion.section
            whileHover={{ borderColor: "var(--color-border-[var(--color-accent)])" }}
            transition={{ duration: 0.2 }}
            className="bg-[var(--color-surface)] rounded-sm border border-[var(--color-border)] p-6 space-y-6 min-h-[600px] flex flex-col transition-colors duration-300"
          >
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-[var(--color-text)] flex items-center ink-bookmark uppercase tracking-wider text-xs">
                <FileText size={18} className="mr-2 text-green-500" />
                {activeTab === "create" ? t("output.generation_output") : activeTab === "image_prompts" ? t("image_prompts.title") : t("output.fix_result")}
              </h2>
              {activeTab === "create" && articleOutput && (
                <div className="flex space-x-2">
                  <button onClick={() => { setImagePromptsArticleInput(articleOutput); setActiveTab("image_prompts"); setImagePromptsOutput([]); }} className="px-3 py-1.5 bg-[#fff1f0] dark:bg-[#1a0000] text-[#cc2200] rounded-sm text-xs font-bold flex items-center hover:bg-[#fff1f0] dark:hover:bg-[#1a0000] transition-colors">
                    <ImageIcon size={14} className="mr-1" /> {t("buttons.generate_image_prompts")}
                  </button>
                  <button onClick={() => downloadFile(articleOutput, "txt")} className="p-1.5 hover:bg-[var(--color-surface-2)] rounded text-[var(--color-text-dim)]"><Download size={16} /></button>
                  <button onClick={() => downloadFile(articleOutput, "md")} className="p-1.5 hover:bg-[var(--color-surface-2)] rounded text-[var(--color-text-dim)] font-bold text-xs">MD</button>
                </div>
              )}
            </div>

            <SEOStats
              activeTab={activeTab}
              hasArticleOutput={!!articleOutput}
              wordCount={wordCount}
              keywordDensity={keywordDensity}
              metaLength={metaLength}
              minWords={minWords}
              maxWords={maxWords}
              hasKataKunci={!!kataKunci}
              hasMetaOutput={!!metaOutput}
              t={t}
            />

            <div className="space-y-6 flex-1">
              <AnimatePresence mode="wait">
                {activeTab === "create" ? (
                  <motion.div key="create-output" {...FADE_IN} className="space-y-6">
                    <div className="relative group">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-semibold text-[var(--color-text-muted)]">{t("output.article")}</h3>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => copyToClipboard(articleOutput, "article")}
                          aria-label={t("buttons.copy")}
                          className="text-[var(--color-text-dim)] hover:text-[#cc2200] font-['JetBrains_Mono'] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] outline-none"
                        >
                          {copiedKey === "article" ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                        </motion.button>
                      </div>
                      <div className="w-full border border-[var(--color-border)] rounded-none p-6 text-sm bg-[var(--color-bg)] manuscript-grid min-h-[400px] whitespace-pre-wrap text-[var(--color-text)] leading-relaxed">
                        {articleOutput || <span className="text-[var(--color-text-dim)] italic">{t("output.rewritten_placeholder")}</span>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-xs font-semibold text-[var(--color-text-muted)]">{t("output.meta")}</h3>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => copyToClipboard(metaOutput, "meta")}
                            aria-label={t("buttons.copy")}
                            className="text-[var(--color-text-dim)] hover:text-[#cc2200] font-['JetBrains_Mono'] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] outline-none"
                          >
                            {copiedKey === "meta" ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                          </motion.button>
                        </div>
                        <div className="w-full border border-[var(--color-border)] rounded-none p-4 text-xs bg-[var(--color-bg)] text-[var(--color-text)] min-h-[60px]">{metaOutput}</div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-xs font-semibold text-[var(--color-text-muted)]">{t("output.slug")}</h3>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => copyToClipboard(slugOutput, "slug")}
                            aria-label={t("buttons.copy")}
                            className="text-[var(--color-text-dim)] hover:text-[#cc2200] font-['JetBrains_Mono'] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] outline-none"
                          >
                            {copiedKey === "slug" ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                          </motion.button>
                        </div>
                        <div className="w-full border border-[var(--color-border)] rounded-none p-4 text-xs bg-[var(--color-bg)] font-['JetBrains_Mono'] text-[var(--color-accent)] min-h-[60px] flex items-center">{slugOutput}</div>
                      </div>
                    </div>
                  </motion.div>
                ) : activeTab === "image_prompts" ? (
                  <motion.div key="image-output" {...FADE_IN} className="space-y-6">
                    {imagePromptsOutput.length > 0 ? (
                      imagePromptsOutput.map((item, idx) => (
                        <div key={idx} className="bg-[var(--color-surface-2)] rounded-sm border border-[var(--color-border)] p-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-[var(--color-text-dim)] uppercase tracking-wider flex items-center"><ImageIcon size={12} className="mr-1 text-[#cc2200]" /> {item.reference}</span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => copyToClipboard(item.prompt, `prompt-${idx}`)}
                              aria-label={t("buttons.copy")}
                              className="text-[var(--color-text-dim)] hover:text-[#cc2200] font-['JetBrains_Mono'] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] outline-none"
                            >
                              {copiedKey === `prompt-${idx}` ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                            </motion.button>
                          </div>
                          <textarea readOnly className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-sm p-3 text-sm h-32 text-[var(--color-text-muted)] outline-none resize-none" value={item.prompt} />
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 text-[var(--color-text-dim)]">
                        <ImageIcon size={48} className="mb-4 opacity-20" />
                        <p className="text-sm italic">{t("output.rewritten_placeholder")}</p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div key="fix-output" {...FADE_IN} className="relative group flex-1 flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-semibold text-[var(--color-text-muted)]">{t("output.rewritten_label")}</h3>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => copyToClipboard(sentenceOutput, "fix")}
                        aria-label={t("buttons.copy")}
                        className="text-[var(--color-text-dim)] hover:text-orange-600 transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] outline-none"
                      >
                        {copiedKey === "fix" ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                      </motion.button>
                    </div>
                    <div className="w-full border border-[var(--color-border)] rounded-sm p-6 text-lg font-medium bg-[var(--color-surface-2)] flex-1 min-h-[400px] leading-relaxed text-[var(--color-text)]">
                      {sentenceOutput || <span className="text-[var(--color-text-dim)] italic">{t("output.rewritten_placeholder")}</span>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        </div>
      </div>

      <footer className="max-w-5xl mx-auto px-4 mt-12 text-[var(--color-accent)]enter pb-8">
        <p className="text-[10px] text-[var(--color-text-dim)] uppercase tracking-widest font-['JetBrains_Mono']">{t("footer")}</p>
      </footer>

      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: easeOut }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center bg-[var(--color-surface-2)] border border-[var(--color-border)] shadow-xl rounded-sm px-4 py-3"
          >
            {toast.type === "success" ? <Check size={18} className="text-[#059669] dark:text-[#44cc44] mr-2" /> : <AlertCircle size={18} className="text-[#dc2626] dark:text-[#cc4444] mr-2" />}
            <span className="text-sm font-medium text-[var(--color-text)]">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-surface)] border-t border-[var(--color-border)] flex justify-around items-center p-2">
        {["create", "fix", "image_prompts"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex flex-col items-center p-2 rounded-sm transition-colors",
              activeTab === tab ? "bg-[#fff1f0] dark:bg-[#1a0000] text-[#cc2200]" : "text-[var(--color-text-dim)]"
            )}
          >
            {tab === "create" && <PlusCircle size={20} />}
            {tab === "fix" && <Edit3 size={20} />}
            {tab === "image_prompts" && <ImageIcon size={20} />}
            <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">{tab}</span>
          </button>
        ))}
      </nav>
    </main>
  );
}
