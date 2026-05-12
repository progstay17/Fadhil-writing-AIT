import sys

with open('src/app/page.tsx', 'r') as f:
    lines = f.readlines()

# Extract handleAutoGenerateImagePrompt
func_start = -1
func_end = -1
for i, line in enumerate(lines):
    if 'const handleAutoGenerateImagePrompt =' in line:
        func_start = i
    if func_start != -1 and '  };' in line and i > func_start:
        func_end = i + 1
        break

if func_start == -1 or func_end == -1:
    print("Could not find function")
    sys.exit(1)

func_lines = lines[func_start:func_end]
del lines[func_start:func_end]

# Find handleGenerate insertion point
insert_idx = -1
for i, line in enumerate(lines):
    if 'const handleGenerate =' in line:
        insert_idx = i
        break

if insert_idx == -1:
    print("Could not find handleGenerate")
    sys.exit(1)

lines[insert_idx:insert_idx] = func_lines + ['\n']

with open('src/app/page.tsx', 'w') as f:
    f.writelines(lines)
