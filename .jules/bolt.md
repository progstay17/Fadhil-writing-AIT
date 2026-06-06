## 2025-05-22 - [Optimized Re-renders and SEO Calculations]
**Learning:** In complex React components with many state variables, top-level effects (like global keyboard shortcuts) that depend on all state variables will cause unnecessary cleanup and re-registration of listeners on every keystroke. Additionally, inline calculations in the render body that depend on large text outputs (like SEO word counts or keyword density) can add up and affect responsiveness during typing.
**Action:** Use `useRef` to capture latest state/callbacks for global listeners to keep effect dependency arrays stable (e.g., empty `[]`). Wrap non-trivial calculations that depend on a subset of state in `useMemo` to prevent redundant execution on unrelated state changes.

## 2026-05-23 - [Optimized Streaming and Component Memoization]
**Learning:** High-frequency state updates during LLM streaming (e.g., setArticleOutput on every chunk) can saturate the main thread with React render cycles, making the UI feel sluggish or frozen. Throttling these updates to a reasonable frequency (~10Hz) dramatically improves responsiveness without degrading the user experience. Additionally, in monolithic components, memoizing heavy UI sections (like History or SEO stats) is critical to isolate them from unrelated state changes (like progress bars or input fields).
**Action:** Always throttle streaming state updates in the reader loop. Use `React.memo` for complex UI blocks in large components and ensure all passed callbacks have stable identities via `useCallback`.

## 2026-05-24 - [Decoupling Heavy SEO Calculations from Streaming]
**Learning:** While `useMemo` prevents redundant calculations when unrelated state changes, it still blocks the main thread if the dependency (like streaming text) updates at a high frequency. `useDeferredValue` allows the UI to render the latest text immediately while deferring the expensive string analysis (word counts, keyword density) to a lower-priority render pass.
**Action:** Use `useDeferredValue` for any heavy data processing that depends on rapidly changing inputs, ensuring the primary user interaction (like seeing text stream in) remains fluid.
