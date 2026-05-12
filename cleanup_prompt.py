import sys
import re

with open('src/app/api/generate/route.ts', 'r') as f:
    content = f.read()

# Remove the old style instructions (the ones with 1., 2., 3. and "ARTICLE STYLE SELECTION")
# They usually follow the new block.
content = re.sub(r'\n\n1\. REVIEW / LISTICLE style — use when the topic is about comparing tools.*?pick the most fitting structure\.\n', '', content, flags=re.DOTALL)

with open('src/app/api/generate/route.ts', 'w') as f:
    f.write(content)
