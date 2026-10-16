## 2025-05-22 - [Optimized Re-renders and SEO Calculations]
**Learning:** In complex React components with many state variables, top-level effects (like global keyboard shortcuts) that depend on all state variables will cause unnecessary cleanup and re-registration of listeners on every keystroke. Additionally, inline calculations in the render body that depend on large text outputs (like SEO word counts or keyword density) can add up and affect responsiveness during typing.
**Action:** Use `useRef` to capture latest state/callbacks for global listeners to keep effect dependency arrays stable (e.g., empty `[]`). Wrap non-trivial calculations that depend on a subset of state in `useMemo` to prevent redundant execution on unrelated state changes.

## 2026-05-23 - [Optimized Streaming and Component Memoization]
**Learning:** High-frequency state updates during LLM streaming (e.g., setArticleOutput on every chunk) can saturate the main thread with React render cycles, making the UI feel sluggish or frozen. Throttling these updates to a reasonable frequency (~10Hz) dramatically improves responsiveness without degrading the user experience. Additionally, in monolithic components, memoizing heavy UI sections (like History or SEO stats) is critical to isolate them from unrelated state changes (like progress bars or input fields).
**Action:** Always throttle streaming state updates in the reader loop. Use `React.memo` for complex UI blocks in large components and ensure all passed callbacks have stable identities via `useCallback`.

## 2025-05-24 - [Optimized SEO Calculations with useDeferredValue]
**Learning:** Performing analytical calculations (word count, keyword density, meta length) directly on frequently updating state during LLM streaming can block the main UI thread and cause sluggishness. Using `useDeferredValue` allows these non-critical updates to be deferred to idle periods, keeping the text streaming fluid.
**Action:** Always use `useDeferredValue` for heavy computations that depend on streaming text. Combine with `React.memo` and boolean flags instead of full strings for child components to minimize re-render overhead.
