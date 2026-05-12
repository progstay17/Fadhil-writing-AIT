import sys

# Fix route.ts
with open('src/app/api/generate/route.ts', 'r') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if 'const message = error?.message || "";' in line:
        continue # Remove this duplicate
    new_lines.append(line)

with open('src/app/api/generate/route.ts', 'w') as f:
    f.writelines(new_lines)

# Fix page.tsx
with open('src/app/page.tsx', 'r') as f:
    content = f.read()

# I likely have definitions repeated because of multiple script runs.
# Let's clean up the area between handleClear and handlePaste
import re
pattern = r'const handleClear = .*?const handlePaste = async \(\) => \{'
# Actually let's just find duplicates of the functions.

def remove_duplicate_functions(text, func_name):
    matches = list(re.finditer(f'const {func_name} = .*?setArtikelContoh\(.*?\);', text, flags=re.DOTALL))
    if len(matches) > 1:
        # Keep only the last one
        last_match = matches[-1]
        for match in reversed(matches[:-1]):
            text = text[:match.start()] + text[match.end():]
    return text

content = remove_duplicate_functions(content, 'useReviewExample')
content = remove_duplicate_functions(content, 'useFeatureExample')
content = remove_duplicate_functions(content, 'useSolutionExample')

with open('src/app/page.tsx', 'w') as f:
    f.write(content)
