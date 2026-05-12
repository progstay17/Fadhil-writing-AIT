import sys

with open('src/app/page.tsx', 'r') as f:
    content = f.read()

# Add handleAutoGenerateImagePrompt
auto_gen_prompt_logic = """
  const handleAutoGenerateImagePrompt = async (title: string, keywords: string, article: string) => {
    setIsPromptLoading(true);
    try {
      const excerpt = article.substring(0, 300);
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "image_prompt",
          title,
          kataKunci: keywords,
          articleExcerpt: excerpt,
          model
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.prompt) {
          setImagePrompt(data.prompt);
        }
      }
    } catch (err) {
      console.error("Failed to generate image prompt", err);
    } finally {
      setIsPromptLoading(false);
    }
  };
"""

# Insert before handleGenerateImage
content = content.replace('const handleGenerateImage = () => {', auto_gen_prompt_logic + '\n  const handleGenerateImage = () => {')

# Find handleGenerate and inject the call
# It's in the while(true) loop or after it.
# Looking at previous cat output, handleGenerate has a while loop for streaming.

# The goal is to call it after article generation is complete.

with open('src/app/page.tsx', 'w') as f:
    f.write(content)
