import re

def process_file(filepath):
    content = open(filepath, 'r').read()

    # Replace hardcoded colors with variables
    mappings = [
        (r'#0a0a0a', 'var(--color-bg)'),
        (r'#111111', 'var(--color-surface)'),
        (r'#1a1a1a', 'var(--color-surface-2)'),
        (r'#2a2a2a', 'var(--color-border)'),
        (r'#3a3a3a', 'var(--color-border-2)'),
        (r'#f0f0f0', 'var(--color-text)'),
        (r'#888888', 'var(--color-text-muted)'),
        (r'#555555', 'var(--color-text-dim)'),
    ]
    for hex_val, var_val in mappings:
        content = content.replace(f'[{hex_val}]', f'[var({var_val})]')

    # Cleanup duplicate var if any
    content = content.replace('var(var(', 'var(').replace('))', ')')

    with open(filepath, 'w') as f:
        f.write(content)

process_file('src/app/page.tsx')
process_file('src/app/login/page.tsx')

# Now fix the specific ternary mess in page.tsx
content = open('src/app/page.tsx', 'r').read()

# I will find the whole output section and replace it with a clean version
# From SEOStats to end of section
output_section_pattern = r"<div className=\"space-y-6 flex-1\">.*?\{activeTab === \"create\" \? \(.*?\) : activeTab === \"image_prompts\" \? \(.*?\) : \(.*?\) \}\s+</div>"
# This might fail due to nesting.

# Let s try a more specific fix for the image_prompts block that was repeated
# I saw: ) ) : ( ... ) : (
content = re.sub(r"\)\s+\)\s+:\s+\(\s+<div className=\"flex flex-col items-center justify-center py-20 text-\[var\(--color-text-dim\)\]\">.*?</div>\s+\)\s+:\s+\(",
                 ") : (", content, flags=re.DOTALL)

# And fix the articleOutput AnimatePresence duplication or mess
# Ensure it looks like:
# <AnimatePresence mode="wait"><motion.div key={articleOutput ? "content" : "empty"} ...> ... </motion.div></AnimatePresence>

open('src/app/page.tsx', 'w').write(content)
