## 2025-05-24 - [Optimized SEO Calculations with useDeferredValue]
**Learning:** Heavy calculations like word count and keyword density in large React components can cause UI lag during high-frequency updates (e.g., streaming). Moving these to `useDeferredValue` allows React to prioritize user interactions and streaming updates while deferring the non-critical SEO stats.
**Action:** Use `useDeferredValue` for inputs to expensive `useMemo` hooks when the results aren't immediately critical for the UI's primary interaction.
