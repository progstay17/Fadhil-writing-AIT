import re

content = open("src/app/page.tsx", "r").read()

start_marker = "return ("
home_start_idx = content.find("export default function Home")
return_start_idx = content.find(start_marker, home_start_idx)

if return_start_idx == -1:
    print("Could not find return ( in Home component")
    exit(1)

header_and_logic = content[:return_start_idx + len(start_marker)]

new_return = """
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
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <motion.pre
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-[8px] leading-[1] font-bold text-[#cc2200] font-['JetBrains_Mono']"
            >
              {`    _    ___ _____
   /   |_ _|_   _|
  / _   | |  | |
 / ___  | |  | |
/_/   ____| |_|  `}
            </motion.pre>
            <h1 className="text-xl font-bold hidden sm:block text-[var(--color-text)]">
              <span className="font-['Noto_Serif_SC']">{t("title")}</span>{" "}
              <span className="font-['JetBrains_Mono'] text-[#cc2200]">AIT 写作</span>
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <nav className="relative hidden md:flex space-x-1 bg-[var(--color-surface-2)] p-1 rounded-sm">
              {["create", "fix", "image_prompts"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "relative px-4 py-1.5 rounded-sm text-sm font-medium transition-colors flex items-center z-10",
                    activeTab === tab ? "text-white" : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                  )}
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute inset-0 bg-[#cc2200] rounded-sm"
                      style={{ zIndex: -1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}
                  {tab === "create" && <PlusCircle size={16} className="mr-2" />}
                  {tab === "fix" && <Edit3 size={16} className="mr-2" />}
                  {tab === "image_prompts" && <ImageIcon size={16} className="mr-2" />}
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
                    "relative px-3 py-1 rounded-md text-xs font-medium uppercase transition-colors z-10",
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
              className="p-2 rounded-sm border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] transition-colors text-[var(--color-text-muted)]"
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-sm border border-[var(--color-border)] hover:bg-[#1a0000] transition-colors text-[var(--color-text-muted)] hover:text-[#cc2200]"
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
                whileHover={{ borderColor: "var(--color-border-2)" }}
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
                            <button type="button" role="switch" aria-checked={tgl.state} onClick={() => tgl.setter(!tgl.state)} className={cn("relative inline-flex h-6 w-11 items-center rounded-full transition-colors", tgl.state ? "bg-[#cc2200]" : "bg-[var(--color-border)]")}>
                              <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white transition-transform", tgl.state ? "translate-x-6" : "translate-x-1")} />
                            </button>
                            <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">{tgl.label}</label>
                          </div>
                        ))}
                      </motion.div>
                      <motion.div variants={FADE_UP} className="border-t border-[var(--color-border)] pt-4">
                        <button onClick={() => setAdvancedOpen(!advancedOpen)} className="w-full flex items-center justify-between p-3 bg-[var(--color-surface-2)]/50 hover:bg-[var(--color-surface-2)] rounded-sm transition-colors">
                          <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase flex items-center"><Cpu size={14} className="mr-2" /> Advanced Options</span>
                          {advancedOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                        <AnimatePresence>
                          {advancedOpen && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-4 pt-4 overflow-hidden">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">{t("fields.competitor_label")}</label>
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
                          <button key={type} onClick={() => setRewriteType(type as any)} className={cn("p-3 rounded-sm border-2 text-left transition-colors", rewriteType === type ? (type === "yellow" ? "border-yellow-400 bg-[#1a1500]" : "border-red-400 bg-[#1a0000]") : "border-[var(--color-border)]")}>
                            <span className="font-bold text-sm block text-[var(--color-text)]">{type === "yellow" ? "🟡" : "🔴"} {t(`fields.${type}_label`)}</span>
                            <span className="text-[10px] text-[var(--color-text-dim)]">{t(`fields.${type}_desc`)}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                <AnimatePresence>
                  {message && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-[#1a0000] border border-[#cc2200] p-3 rounded-sm flex items-center text-[#cc4444] text-sm overflow-hidden">
                      <AlertCircle size={16} className="mr-2 flex-shrink-0" /> {message}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-3">
                  <button onClick={handleClear} className="flex-1 border border-[var(--color-border)] text-[var(--color-text-muted)] font-semibold py-3 rounded-sm flex items-center justify-center hover:bg-[var(--color-surface-2)] transition-all">
                    <Trash2 size={18} className="mr-2" /> {t("buttons.clear_input")}
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 6px 30px #cc220055" }}
                    whileTap={{ scale: 0.96 }}
                    animate={loading ? { boxShadow: ["0 4px 20px #cc220033", "0 4px 30px #cc220077", "0 4px 20px #cc220033"] } : {}}
                    transition={loading ? { duration: 1.2, repeat: Infinity } : { duration: 0.15 }}
                    disabled={loading}
                    onClick={handleGenerate}
                    className={cn("flex-[2] text-white font-semibold py-3 rounded-sm flex items-center justify-center transition-all", activeTab === "fix" ? "bg-orange-500 hover:bg-orange-600" : "bg-[#cc2200] hover:bg-[#991a00]")}
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
            whileHover={{ borderColor: "var(--color-border-2)" }}
            transition={{ duration: 0.2 }}
            className="bg-[var(--color-surface)] rounded-sm border border-[var(--color-border)] p-6 space-y-6 min-h-[600px] flex flex-col transition-colors duration-300"
          >
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-[var(--color-text)] flex items-center">
                <FileText size={18} className="mr-2 text-green-500" />
                {activeTab === "create" ? t("output.generation_output") : activeTab === "image_prompts" ? t("image_prompts.title") : t("output.fix_result")}
              </h2>
              {activeTab === "create" && articleOutput && (
                <div className="flex space-x-2">
                  <button onClick={() => { setImagePromptsArticleInput(articleOutput); setActiveTab("image_prompts"); setImagePromptsOutput([]); }} className="px-3 py-1.5 bg-[#1a0000] text-[#cc2200] rounded-sm text-xs font-bold flex items-center hover:bg-[#1a0000] transition-colors">
                    <ImageIcon size={14} className="mr-1" /> {t("buttons.generate_image_prompts")}
                  </button>
                  <button onClick={() => downloadFile(articleOutput, "txt")} className="p-1.5 hover:bg-[var(--color-surface-2)] rounded text-[var(--color-text-dim)]"><Download size={16} /></button>
                  <button onClick={() => downloadFile(articleOutput, "md")} className="p-1.5 hover:bg-[var(--color-surface-2)] rounded text-[var(--color-text-dim)] font-bold text-xs">MD</button>
                </div>
              )}
            </div>

            <SEOStats activeTab={activeTab} articleOutput={articleOutput} wordCount={wordCount} keywordDensity={keywordDensity} metaLength={metaLength} minWords={minWords} maxWords={maxWords} kataKunci={kataKunci} metaOutput={metaOutput} t={t} />

            <div className="space-y-6 flex-1">
              <AnimatePresence mode="wait">
                {activeTab === "create" ? (
                  <motion.div key="create-output" {...FADE_IN} className="space-y-6">
                    <div className="relative group">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-semibold text-[var(--color-text-muted)]">{t("output.article")}</h3>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => copyToClipboard(articleOutput, "article")} className="text-[var(--color-text-dim)] hover:text-[#cc2200] font-['JetBrains_Mono']">{copiedKey === "article" ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}</motion.button>
                      </div>
                      <div className="w-full border border-[var(--color-border)] rounded-sm p-4 text-sm bg-[var(--color-bg)] min-h-[400px] whitespace-pre-wrap text-[var(--color-text)]">
                        {articleOutput || <span className="text-[var(--color-text-dim)] italic">{t("output.rewritten_placeholder")}</span>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-xs font-semibold text-[var(--color-text-muted)]">{t("output.meta")}</h3>
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => copyToClipboard(metaOutput, "meta")} className="text-[var(--color-text-dim)] hover:text-[#cc2200] font-['JetBrains_Mono']">{copiedKey === "meta" ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}</motion.button>
                        </div>
                        <div className="w-full border border-[var(--color-border)] rounded-sm p-3 text-xs bg-[var(--color-bg)] text-[var(--color-text)] min-h-[60px]">{metaOutput}</div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-xs font-semibold text-[var(--color-text-muted)]">{t("output.slug")}</h3>
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => copyToClipboard(slugOutput, "slug")} className="text-[var(--color-text-dim)] hover:text-[#cc2200] font-['JetBrains_Mono']">{copiedKey === "slug" ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}</motion.button>
                        </div>
                        <div className="w-full border border-[var(--color-border)] rounded-sm p-3 text-xs bg-[var(--color-bg)] font-['JetBrains_Mono'] text-[#cc2200] min-h-[60px] flex items-center">{slugOutput}</div>
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
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => copyToClipboard(item.prompt, `prompt-${idx}`)} className="text-[var(--color-text-dim)] hover:text-[#cc2200] font-['JetBrains_Mono']">{copiedKey === `prompt-${idx}` ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}</motion.button>
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
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => copyToClipboard(sentenceOutput, "fix")} className="text-[var(--color-text-dim)] hover:text-orange-600 transition-colors">{copiedKey === "fix" ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}</motion.button>
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

      <footer className="max-w-5xl mx-auto px-4 mt-12 text-center pb-8">
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
            {toast.type === "success" ? <Check size={18} className="text-[#44cc44] mr-2" /> : <AlertCircle size={18} className="text-[#cc4444] mr-2" />}
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
              activeTab === tab ? "bg-[#1a0000] text-[#cc2200]" : "text-[var(--color-text-dim)]"
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
"""

final_page = header_and_logic + new_return
open("src/app/page.tsx", "w").write(final_page)
