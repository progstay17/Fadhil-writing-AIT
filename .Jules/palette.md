## 2025-05-22 - [Accessibility Enhancement for Interactive Elements]
**Learning:** Adding ARIA attributes to custom interactive elements (like disclosure panels and state-toggle buttons) significantly improves the experience for screen reader users by providing semantic meaning that standard HTML tags might lack.
**Action:** Always include `aria-expanded` and `aria-controls` for disclosure components, and `aria-pressed` for toggle buttons. Ensure icon-only buttons have descriptive `aria-label` attributes.

## 2025-05-23 - [Reusable Scroll-to-Top Pattern]
**Learning:** For long-form content generation tools, a floating "Scroll to Top" button provides immediate utility. Using Framer Motion's `AnimatePresence` with `initial`, `animate`, and `exit` props ensures a smooth, non-jarring entry and exit as the user scrolls.
**Action:** Implement the scroll-to-top button using a 300px threshold, `var(--color-accent)` for branding consistency, and ensure full i18n support for the button's title and aria-label.
