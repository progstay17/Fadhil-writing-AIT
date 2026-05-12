import sys

# Update backend
with open('src/app/api/generate/route.ts', 'r') as f:
    route_content = f.read()

route_content = route_content.replace('const FALLBACK_MODEL = "gemini-flash-latest";', 'const FALLBACK_MODEL = "gemini-2.0-flash";')
route_content = route_content.replace('const ALLOWED_MODELS = ["gemini-2.5-flash", "gemini-3-flash-preview", "gemini-flash-latest"];',
                                     'const ALLOWED_MODELS = ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-2.0-flash"];')

with open('src/app/api/generate/route.ts', 'w') as f:
    f.write(route_content)

# Update frontend
with open('src/app/page.tsx', 'r') as f:
    page_content = f.read()

# Update initial state
page_content = page_content.replace('const [model, setModel] = useState("gemini-2.5-flash");', 'const [model, setModel] = useState("gemini-2.5-flash");') # No change needed here if it's already gemini-2.5-flash

old_options = """                    <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                    <option value="gemini-3-flash-preview">Gemini 3 Flash Preview</option>
                    <option value="gemini-flash-latest">Gemini Flash Latest</option>"""

new_options = """                    <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                    <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                    <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>"""

page_content = page_content.replace(old_options, new_options)

with open('src/app/page.tsx', 'w') as f:
    f.write(page_content)
