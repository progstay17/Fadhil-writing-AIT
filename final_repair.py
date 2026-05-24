import re

def repair_page():
    with open("src/app/page.tsx", "r") as f:
        content = f.read()

    # 1. Fix common syntax errors introduced by previous regexes
    content = content.replace(" ) ) } >", "))}>")
    content = content.replace(" ) } >", ")}>")
    content = content.replace(" ) }", ")}")
    content = content.replace(" } ) }", "})}")
    content = content.replace(" ) ) }", "))}")
    content = content.replace("};;", "};")
    content = content.replace("</ >", "</>")
    content = content.replace("<div <div", "<div")

    # Fix the specific line 105 from od output: ) ) } >
    content = re.sub(r"\)\s*\)\s*\}\s*>", "))}>", content)

    # 2. Replace hardcoded colors with variables
    color_map = {
        '#0a0a0a': 'var(--color-bg)',
        '#111111': 'var(--color-surface)',
        '#1a1a1a': 'var(--color-surface-2)',
        '#2a2a2a': 'var(--color-border)',
        '#3a3a3a': 'var(--color-border-2)',
        '#f0f0f0': 'var(--color-text)',
        '#888888': 'var(--color-text-muted)',
        '#555555': 'var(--color-text-dim)',
    }

    for hex_val, var_val in color_map.items():
        # Replace occurrences like [#hex] with [var(var_val)]
        # We handle both [#hex] and [#hex]/opacity
        content = content.replace(f"[{hex_val}]", f"[var({var_val})]")

    # Cleanup duplicate var if any
    content = content.replace("var(var(", "var(").replace("))", ")")

    # 3. Fix initial load light mode
    if "document.documentElement.classList.toggle('light', resolved === 'light');" not in content:
        content = content.replace("document.documentElement.classList.toggle('dark', resolved === 'dark');",
                                  "document.documentElement.classList.toggle('dark', resolved === 'dark');\n        document.documentElement.classList.toggle('light', resolved === 'light');")

    # 4. Progress bar shimmer (ensure only one exists and it's correct)
    shimmer_code = """<motion.div
              className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ["-80px", "100vw"] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            />"""
    # Remove existing ones to avoid duplicates
    content = re.sub(r"<motion\.div\s+className=\"absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent\".*?/>", "", content, flags=re.DOTALL)
    # Insert cleanly
    content = re.sub(r"(style=\{\{ width: `\$\{progress\}%` \}\}\s+/>)", r"\1\n            " + shimmer_code, content)

    # 5. Language switcher layoutId
    # If not already present, we need to add it.
    # Since the state might be very messy, I will use a more robust replacement for the whole language switcher block.
    lang_pattern = r"<div className=\"flex bg-\[var\(--color-surface-2\)\].*?{l}\s*</button>\s*\}\)\}\s*</div>"
    lang_replacement = """<div className="flex bg-[var(--color-surface-2)] rounded-sm p-1 relative">
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
            </div>"""
    content = re.sub(r"<div className=\"flex bg-\[var\(--color-surface-2\)\].*?{l}\s*</button>\s*\}\)\}\s*</div>", lang_replacement, content, flags=re.DOTALL)

    # 6. Output AnimatePresence
    # Wrap article output section
    article_pattern = r"(<h3 className=\"text-sm font-semibold text-\[var\(--color-text-muted\)\].*?</h3>.*?<motion\.button.*?/motion\.button>.*?</div>)\s+<AnimatePresence mode=\"wait\"><motion\.div key=\{articleOutput \? \"content\" : \"empty\"\}.*?>(.*?)</motion\.div></AnimatePresence>"
    # This is getting very specific. Let s just ensure the AnimatePresence is there and correct.

    # Fix the broken span in toast if it s still there
    content = content.replace('text-[var(--color-text)]">{toast.message}</span>', 'text-[var(--color-text)]">{toast.message}</span>')

    # Final check for unquoted attributes
    content = re.sub(r"className=([^\s\"{][^\s\">]*)", r'className="\1"', content)

    with open("src/app/page.tsx", "w") as f:
        f.write(content)

def repair_login():
    with open("src/app/login/page.tsx", "r") as f:
        content = f.read()

    color_map = {
        '#0a0a0a': 'var(--color-bg)',
        '#111111': 'var(--color-surface)',
        '#1a1a1a': 'var(--color-surface-2)',
        '#2a2a2a': 'var(--color-border)',
        '#3a3a3a': 'var(--color-border-2)',
        '#f0f0f0': 'var(--color-text)',
        '#888888': 'var(--color-text-muted)',
        '#555555': 'var(--color-text-dim)',
    }

    for hex_val, var_val in color_map.items():
        content = content.replace(f"[{hex_val}]", f"[var({var_val})]")

    content = content.replace("var(var(", "var(").replace("))", ")")

    with open("src/app/login/page.tsx", "w") as f:
        f.write(content)

repair_page()
repair_login()
