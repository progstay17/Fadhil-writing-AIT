import re

with open('src/app/page.tsx', 'r') as f:
    content = f.read()

# Fix broken class strings
content = content.replace('"border-yellow-400 bg-yellow-50 : "border-[#2a2a2a]")}', '"border-yellow-400 bg-[#1a1500]" : "border-[#2a2a2a]")}')
content = content.replace('"border-red-400 bg-red-50 : "border-[#2a2a2a]")}', '"border-red-400 bg-[#1a0000]" : "border-[#2a2a2a]")}')
content = content.replace('text-[#f0f0f0] \n </div>', 'text-[#f0f0f0]</span></div>')
content = content.replace('text-[#555555] \n )}', 'text-[#555555]")}')
content = content.replace('item.type === "create" ? "bg- text-[#cc2200] font-[\'JetBrains_Mono\'] : "bg-orange-100 text-orange-600', 'item.type === "create" ? "bg-[#001a00] text-[#44cc44]" : "bg-[#1a0800] text-[#cc6600]"')

# Fix the broken quote lines
content = re.sub(r'bg-\[#111111\] text-\[#888888\] hover:text-\[#888888\]\s*\n\s+\)', 'bg-[#111111] text-[#888888] hover:text-[#f0f0f0]")', content)
content = re.sub(r'bg-\[#1a1a1a\] text-\[#888888\]\s*\n\s+\)', 'bg-[#1a1a1a] text-[#888888]")', content)
content = re.sub(r'hover:text-\[#cc4444\]\s*\ntitle="Logout"', 'hover:text-[#cc4444]" title="Logout"', content)

# Normalize all className attributes to be on one line if possible
def clean_cn(m):
    return m.group(0).replace("\n", " ")
content = re.sub(r"className=\{cn\((.*?)\)\}", clean_cn, content, flags=re.DOTALL)
content = re.sub(r"className=\"(.*?)\"", clean_cn, content, flags=re.DOTALL)

# Fix double div and missing closing tags
content = content.replace("<div <div", "<div")
content = content.replace("text-[#555555]           </button>", "text-[#555555]\">{t(\"fields.red_desc\")}</span></button>")
content = content.replace("text-[#555555] </button>", "text-[#555555]\">{t(\"fields.red_desc\")}</span></button>")
content = content.replace("text-[#f0f0f0] </div> )}", "text-[#f0f0f0]\"></span></div> )}")
content = content.replace('className="flex gap-3">', '<div className="flex gap-3">')
content = content.replace('text-[#f0f0f0]</span>', 'text-[#f0f0f0]">{toast.message}</span>')

# Final specific fix for the history section title that I saw broken earlier
content = content.replace('text-[#f0f0f0] \n <History', 'text-[#f0f0f0]">\n <History')

# Fix yellow/red labels
content = re.sub(r'text-\[#555555\]\s*"\s*>', 'text-[#555555]">', content)

with open('src/app/page.tsx', 'w') as f:
    f.write(content)
