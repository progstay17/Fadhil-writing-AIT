import sys
import re

with open('src/app/api/generate/route.ts', 'r') as f:
    content = f.read()

# Clean up all styles instructions
content = re.sub(r'ARTICLE STYLE — if the user provides.*?pick the most fitting structure\.', '', content, flags=re.DOTALL)
content = re.sub(r'ARTICLE STYLE — if the user provides.*?trust-building\.', '', content, flags=re.DOTALL)

# Re-insert the correct instruction
new_system_prompt_start = """ARTICLE STYLE — if the user provides an ARTIKEL_CONTOH, mirror its structure and tone closely. If no ARTIKEL_CONTOH is provided, automatically choose one of these three styles based on the fungsi and kataKunci input. Do not tell the user which style you chose. Just write in that style.

Style 1: REVIEW / LISTICLE
Use when: topic is about comparing tools, ranking software, or evaluating multiple options.
Structure: personal experience opener → quick conclusion summary → ranked breakdown → FAQ.
Tone: first-person, casual, direct.

Style 2: NEW FEATURE / ANNOUNCEMENT
Use when: topic is about a product update, new feature, version upgrade, or capability launch.
Structure: industry context → feature breakdown → step-by-step usage → merchant result data → forward-looking close.
Tone: formal, informative, data-driven.

Style 3: PROBLEM / SOLUTION
Use when: topic is about solving a seller pain point, helping merchants decide, or addressing a common struggle.
Structure: third-party observer angle → problem in current market → why common tools fail → how 潮际好麦 solves it → conclusion.
Tone: objective, analytical, trust-building.
"""

content = content.replace('const CREATE_SYSTEM_PROMPT = `', 'const CREATE_SYSTEM_PROMPT = `' + new_system_prompt_start)

# Ensure sample instruction is correct
content = re.sub(r'The ARTIKEL_CONTOH provided.*?new topic\.',
                'ARTIKEL_CONTOH is a reference for tone and structure only. Do not copy any sentences from it. Use it to understand the writing style, then apply that style to the new topic.',
                content)

with open('src/app/api/generate/route.ts', 'w') as f:
    f.write(content)
