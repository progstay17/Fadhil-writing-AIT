with open('src/app/api/generate/route.ts', 'r') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if 'fullText += chunkText;' in line:
        continue # Remove this line as fullText is not defined and not used elsewhere in this scope
    new_lines.append(line)

with open('src/app/api/generate/route.ts', 'w') as f:
    f.writelines(new_lines)
