## 2025-05-22 - [Accessibility Enhancement for Interactive Elements]
**Learning:** Adding ARIA attributes to custom interactive elements (like disclosure panels and state-toggle buttons) significantly improves the experience for screen reader users by providing semantic meaning that standard HTML tags might lack.
**Action:** Always include `aria-expanded` and `aria-controls` for disclosure components, and `aria-pressed` for toggle buttons. Ensure icon-only buttons have descriptive `aria-label` attributes.

## 2025-05-24 - [Optimized Navigation and Icon Button Accessibility]
**Learning:** For floating UI elements triggered by scroll position (like a "Scroll to Top" button), use a throttled listener with `window.requestAnimationFrame` to maintain 60fps performance. Additionally, ensuring all icon-only buttons have localized `aria-label` and `title` attributes provides both screen reader accessibility and visual tooltips for a more inclusive experience.
**Action:** Use `requestAnimationFrame` for scroll-based state updates. Always provide trilingual `aria-label` and `title` attributes for buttons that lack descriptive text.
