import sys

with open('src/app/page.tsx', 'r') as f:
    content = f.read()

# Replace the button toggle logic to remove the manual prompt generation if it was there
content = content.replace('''                      onClick={() => {
                        const nextState = !isImageSectionExpanded;
                        setIsImageSectionExpanded(nextState);
                        if (nextState && !imagePrompt && kataKunci) {
                          setImagePrompt(`Professional product photo of ${kataKunci}, clean background, e-commerce style, high quality`);
                        }
                      }}''', '''                      onClick={() => setIsImageSectionExpanded(!isImageSectionExpanded)}''')

# Replace the input with a textarea and handle isPromptLoading
old_input = """                            <input
                              type="text"
                              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                              value={imagePrompt}
                              onChange={(e) => setImagePrompt(e.target.value)}
                            />"""

new_textarea = """                            <div className="flex-1 relative">
                              <textarea
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none"
                                value={imagePrompt}
                                onChange={(e) => setImagePrompt(e.target.value)}
                                placeholder={isPromptLoading ? "Generating prompt..." : ""}
                              />
                              {isPromptLoading && (
                                <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg">
                                  <RotateCcw size={16} className="animate-spin text-blue-600" />
                                </div>
                              )}
                            </div>"""

content = content.replace(old_input, new_textarea)

with open('src/app/page.tsx', 'w') as f:
    f.write(content)
