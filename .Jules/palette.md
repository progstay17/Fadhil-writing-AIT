## 2025-05-22 - [Accessibility Enhancement for Interactive Elements]
**Learning:** Adding ARIA attributes to custom interactive elements (like disclosure panels and state-toggle buttons) significantly improves the experience for screen reader users by providing semantic meaning that standard HTML tags might lack.
**Action:** Always include `aria-expanded` and `aria-controls` for disclosure components, and `aria-pressed` for toggle buttons. Ensure icon-only buttons have descriptive `aria-label` attributes.

## 2025-06-12 - [Scroll-to-Top Interaction Pattern]
**Learning:** A polished scroll-to-top implementation requires more than just a listener; it needs throttling to maintain performance and an initial check on mount to handle page refreshes where the user might already be scrolled down.
**Action:** Always throttle scroll listeners and execute an initial visibility check in `useEffect` when implementing scroll-dependent UI elements.
