import sys

with open('src/app/api/generate/route.ts', 'r') as f:
    content = f.read()

image_prompt_block = """
    if (body.type === "image_prompt") {
      const title = sanitize(body.title || "");
      const keywords = sanitize(body.kataKunci || "");
      const excerpt = sanitize(body.articleExcerpt || "");

      const imagePromptInstruction = `You are an expert at writing image generation prompts for AI image tools.

Based on the article content below, write a single image generation prompt in English that visually represents the topic. The image should look like a professional e-commerce or tech marketing photo — realistic, modern, clean. Think scenes like: a seller at a desk with product photos on screen, AI workflow on a laptop, product displayed with multiple generated angles around it, professional studio setup. Match the scene specifically to what the article is actually about.

Output only the prompt text. No explanation, no quotes, no labels, no extra text.

Article title: ${title}
Keywords: ${keywords}
Article excerpt: ${excerpt}`;

      const result = await model.generateContent(imagePromptInstruction);
      const prompt = result.response.text().trim();
      return NextResponse.json({ prompt });
    }
"""

# Insert before CREATE CONTENT section
insert_point = '// CREATE CONTENT with streaming support'
content = content.replace(insert_point, image_prompt_block + '\n    ' + insert_point)

with open('src/app/api/generate/route.ts', 'w') as f:
    f.write(content)
