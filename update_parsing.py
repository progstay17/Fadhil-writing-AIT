import sys

with open('src/app/page.tsx', 'r') as f:
    lines = f.readlines()

new_parsing_block = """          // Post-parse tags using indexOf for reliability
          const fullTrimmed = fullText.trim();
          const DELIM_ARTIKEL = "<<<ARTIKEL>>>";
          const DELIM_META = "<<<META>>>";
          const DELIM_SLUG = "<<<SLUG>>>";

          const artikelStart = fullTrimmed.indexOf(DELIM_ARTIKEL);
          const metaStart = fullTrimmed.indexOf(DELIM_META);
          const slugStart = fullTrimmed.indexOf(DELIM_SLUG);

          const article = artikelStart !== -1 && metaStart !== -1
            ? fullTrimmed.slice(artikelStart + DELIM_ARTIKEL.length, metaStart).trim()
            : fullTrimmed;

          const meta = metaStart !== -1 && slugStart !== -1
            ? fullTrimmed.slice(metaStart + DELIM_META.length, slugStart).trim()
            : "";

          const slug = slugStart !== -1
            ? fullTrimmed.slice(slugStart + DELIM_SLUG.length).trim()
            : "";

          setArticleOutput(article);
          setMetaOutput(meta);
          setSlugOutput(slug);

          const historyResult: GenerationResult = {
              id: Date.now(),
              timestamp: new Date().toLocaleTimeString(),
              type: "create",
              article,
              meta,
              slug,
              params: { fungsi, kataKunci }
          };
          setHistory(prev => [historyResult, ...prev].slice(0, 5));

          const firstLine = article.split("\\n")[0].replace(/^#+\\s*/, "").trim();
          handleAutoGenerateImagePrompt(firstLine || kataKunci, kataKunci, article);
"""

start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if '// Post-parse tags' in line:
        start_idx = i
    if start_idx != -1 and 'if (article) {' in line:
        # Need to find the matching closing brace for this if
        brace_count = 0
        for j in range(i, len(lines)):
            if '{' in lines[j]:
                brace_count += lines[j].count('{')
            if '}' in lines[j]:
                brace_count -= lines[j].count('}')
            if brace_count == 0:
                end_idx = j + 1
                break
        break

if start_idx != -1 and end_idx != -1:
    lines[start_idx:end_idx] = [new_parsing_block]

with open('src/app/page.tsx', 'w') as f:
    f.writelines(lines)
