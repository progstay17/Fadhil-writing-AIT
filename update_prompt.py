import sys

with open('src/app/api/generate/route.ts', 'r') as f:
    content = f.read()

style_selection = """ARTICLE STYLE SELECTION — choose one style based on the product function described:

1. REVIEW / LISTICLE style — use when the topic is about comparing tools, ranking software, or evaluating options. Structure: personal experience opener, quick conclusion summary, ranked list with explanations, FAQ section at the end. Tone: first-person, casual, direct.

2. NEW FEATURE / ANNOUNCEMENT style — use when the topic is about a product update, new feature launch, or capability upgrade. Structure: industry context opener, feature breakdown, step-by-step usage flow, merchant testimonial or result data, forward-looking close. Tone: formal, informative, data-driven.

3. PROBLEM / SOLUTION style — use when the topic is about solving a seller pain point, comparing AI tools in general, or helping merchants decide. Structure: third-party or observer angle, problem with current market, why common tools fail, how 潮际好麦 solves it, conclusion. Tone: objective, analytical, trust-building.

Do not always default to the same style. Read the fungsi field carefully and pick the most fitting structure.

"""

content = content.replace('const CREATE_SYSTEM_PROMPT = `Language: {LANG_INSTRUCTION}',
                        'const CREATE_SYSTEM_PROMPT = `' + style_selection + 'Language: {LANG_INSTRUCTION}')

content = content.replace('Use the provided ARTIKEL_CONTOH only as a reference for tone and structure. DO NOT copy any sentences or phrases directly from it.',
                        'The ARTIKEL_CONTOH provided is a reference for tone and structure only. Do not copy sentences from it. Use it to understand the writing style, then apply that style to the new topic.')

with open('src/app/api/generate/route.ts', 'w') as f:
    f.write(content)
