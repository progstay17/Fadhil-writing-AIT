import re

with open('src/app/page.tsx', 'r') as f:
    content = f.read()

# SEOStats Colors
content = content.replace('let color = "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";', 'let color = "text-[#44cc44] bg-[#001a00]";')
content = content.replace('color = "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";', 'color = "text-[#cc4444] bg-[#1a0000]";')
content = content.replace('color = "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20";', 'color = "text-[#ccaa00] bg-[#1a1500]";')

# General color/bg mapping that might have been missed
content = content.replace('bg-blue-50 dark:bg-blue-900/30', 'bg-[#1a0000]')
content = content.replace('hover:bg-blue-100 dark:hover:bg-blue-900/40', 'hover:bg-[#1a0000]')

# Output sections background (ensure it's #0a0a0a as requested for output areas)
content = content.replace('bg-[#1a1a1a] min-h-[400px]', 'bg-[#0a0a0a] min-h-[400px]')
content = content.replace('bg-[#1a1a1a] text-[#f0f0f0] min-h-[60px]', 'bg-[#0a0a0a] text-[#f0f0f0] min-h-[60px]')
content = content.replace('bg-[#1a1a1a] font-mono text-[#cc2200] min-h-[60px]', 'bg-[#0a0a0a] font-[\'JetBrains_Mono\'] text-[#cc2200] min-h-[60px]')

# Footer
content = content.replace('text-[10px] text-[#555555] uppercase tracking-widest font-medium', 'text-[10px] text-[#555555] uppercase tracking-widest font-[\'JetBrains_Mono\']')

# Clean up remaining dark: and blue:
content = re.sub(r'dark:\S+', '', content)
content = re.sub(r'blue-\d+', '', content)

# Check for rounded-full in SEOStats
content = content.replace('rounded-full text-[10px]', 'rounded-sm text-[10px]')

with open('src/app/page.tsx', 'w') as f:
    f.write(content)
