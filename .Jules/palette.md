## 2025-05-22 - [Accessibility Enhancement for Interactive Elements]
**Learning:** Adding ARIA attributes to custom interactive elements (like disclosure panels and state-toggle buttons) significantly improves the experience for screen reader users by providing semantic meaning that standard HTML tags might lack.
**Action:** Always include `aria-expanded` and `aria-controls` for disclosure components, and `aria-pressed` for toggle buttons. Ensure icon-only buttons have descriptive `aria-label` attributes.

## 2025-05-16 - [Smooth Scroll-to-Top Pattern]
**Learning:** For long-form content generation interfaces, a "Scroll to Top" button with entry/exit animations (via `AnimatePresence`) and throttled scroll listeners (via `requestAnimationFrame`) provides a non-intrusive way to navigate back to global controls without sacrificing performance.
**Action:** Use `requestAnimationFrame` for any global scroll listeners to avoid UI jank. Position floating buttons to clear both desktop and mobile navigation bars.
