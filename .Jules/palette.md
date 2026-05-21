## 2025-05-22 - [Accessibility Enhancement for Interactive Elements]
**Learning:** Adding ARIA attributes to custom interactive elements (like disclosure panels and state-toggle buttons) significantly improves the experience for screen reader users by providing semantic meaning that standard HTML tags might lack.
**Action:** Always include `aria-expanded` and `aria-controls` for disclosure components, and `aria-pressed` for toggle buttons. Ensure icon-only buttons have descriptive `aria-label` attributes.
