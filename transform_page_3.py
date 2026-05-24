import re

with open('src/app/page.tsx', 'r') as f:
    content = f.read()

# Colors and backgrounds
content = content.replace('bg-white', 'bg-[#1a1a1a]')
content = content.replace('hover:bg-gray-100', 'hover:bg-[#1a1a1a]')
content = content.replace('hover:bg-gray-50/50', 'hover:bg-[#1a1a1a]')
content = content.replace('bg-gray-50/50', 'bg-[#1a1a1a]')
content = content.replace('text-gray-800', 'text-[#f0f0f0]')
content = content.replace('text-gray-700', 'text-[#888888]')
content = content.replace('text-gray-600', 'text-[#888888]')
content = content.replace('text-gray-500', 'text-[#555555]')
content = content.replace('text-gray-400', 'text-[#555555]')
content = content.replace('text-gray-300', 'text-[#555555]')
content = content.replace('border-gray-200', 'border-[#2a2a2a]')
content = content.replace('border-gray-100', 'border-[#2a2a2a]')
content = content.replace('divide-gray-100', 'divide-[#2a2a2a]')
content = content.replace('bg-blue-50', 'bg-[#1a0000]') # For mobile tabs

# Labels font-mono should be JetBrains Mono and 10px uppercase tracking-wider text-[#888888]
content = re.sub(r'className="text-xs font-semibold uppercase tracking-wide text-gray-500\s+cursor-pointer"', 'className="text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-2 font-[\'JetBrains_Mono\'] cursor-pointer"', content)
content = re.sub(r'className="text-xs font-medium text-gray-500\s+cursor-pointer"', 'className="text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-2 font-[\'JetBrains_Mono\'] cursor-pointer"', content)
content = re.sub(r'className="text-xs font-semibold text-gray-500\s+uppercase tracking-wider cursor-pointer"', 'className="text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-2 font-[\'JetBrains_Mono\'] cursor-pointer"', content)

# Buttons sample review
content = content.replace('text-gray-600  hover:bg-[#1a1a1a]', 'text-[#888888] hover:text-[#f0f0f0] hover:border-[#3a3a3a]')

# Text area text color
content = content.replace('text-gray-700  outline-none resize-none', 'text-[#f0f0f0] outline-none resize-none')

# Clean up trailing spaces and empty dark variants
content = re.sub(r'\s+dark:\S*', '', content)
content = re.sub(r'  +', ' ', content)

# Ensure article output text is light
content = content.replace('text-gray-800  transition-colors', 'text-[#f0f0f0] transition-colors')

with open('src/app/page.tsx', 'w') as f:
    f.write(content)
