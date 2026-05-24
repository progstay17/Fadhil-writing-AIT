import re

with open('src/app/page.tsx', 'r') as f:
    content = f.read()

# Mapping of replacements
replacements = [
    (r'bg-white dark:bg-gray-900', 'bg-[#111111]'),
    (r'bg-gray-50 dark:bg-gray-800', 'bg-[#1a1a1a]'),
    (r'bg-gray-100 dark:bg-gray-800', 'bg-[#1a1a1a]'),
    (r'bg-gray-950', 'bg-[#0a0a0a]'),
    (r'border-gray-200 dark:border-gray-700', 'border-[#2a2a2a]'),
    (r'border-gray-100 dark:border-gray-800', 'border-[#2a2a2a]'),
    (r'text-gray-900 dark:text-gray-100', 'text-[#f0f0f0]'),
    (r'text-gray-600 dark:text-gray-400', 'text-[#888888]'),
    (r'text-gray-400 dark:text-gray-500', 'text-[#555555]'),
    (r'bg-blue-600', 'bg-[#cc2200]'),
    (r'hover:bg-blue-700', 'hover:bg-[#991a00]'),
    (r'text-blue-600 dark:text-blue-400', 'text-[#cc2200]'),
    (r'text-blue-500', 'text-[#cc2200]'),
    (r'bg-blue-50 dark:bg-blue-900/20', 'bg-[#1a0000]'),
    (r'bg-blue-100 dark:bg-blue-900/30', 'bg-[#1a0000]'),
    (r'ring-blue-500', 'ring-[#cc2200]'),
    (r'focus:ring-blue-500', 'focus:ring-[#cc2200]'),
    (r'shadow-blue-500/25', 'shadow-[0_4px_20px_#cc220033]'),
    (r'bg-gray-300 dark:bg-gray-600', 'bg-[#2a2a2a]'), # Toggle inactive
    (r'rounded-xl', 'rounded-sm'),
    (r'rounded-lg', 'rounded-sm'),
    (r'rounded-2xl', 'rounded-sm'),
    (r'text-orange-600 dark:text-orange-400', 'text-[#cc2200]'),
]

for old, new in replacements:
    content = re.sub(old, new, content)

content = re.sub(r'shadow-sm|shadow-md|shadow-xl|shadow-lg|shadow(?!-\[)', '', content)
content = content.replace('text-xl font-bold ml-2 hidden sm:block text-gray-900 dark:text-gray-100', 'text-xl font-bold ml-2 hidden sm:block text-[#f0f0f0]')
content = content.replace('{t("title")}', '<span className="font-[\'Noto_Serif_SC\']">{t("title")}</span> <span className="font-[\'JetBrains_Mono\'] text-[#cc2200]">AIT 写作</span>')
content = content.replace('text-blue-600', 'text-[#cc2200] font-[\'JetBrains_Mono\']')
content = re.sub(r'className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2"', 'className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-2 font-[\'JetBrains_Mono\']"', content)
content = re.sub(r'className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2"', 'className="text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-2 font-[\'JetBrains_Mono\']"', content)
content = content.replace('bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400', 'bg-[#001a00] text-[#44cc44]')
content = content.replace('bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400', 'bg-[#1a1500] text-[#ccaa00]')
content = content.replace('bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400', 'bg-[#1a0000] text-[#cc4444]')
content = content.replace('bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400', 'bg-[#001a00] text-[#44cc44]')
content = content.replace('bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400', 'bg-[#1a0800] text-[#cc6600]')
content = content.replace('font-mono text-blue-600 dark:text-blue-400', 'font-[\'JetBrains_Mono\'] text-[#cc2200]')
content = content.replace('hover:bg-gray-50 dark:hover:bg-gray-800', 'hover:bg-[#1a1a1a]')

with open('src/app/page.tsx', 'w') as f:
    f.write(content)
