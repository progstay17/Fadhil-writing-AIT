## 2025-05-22 - [Accessibility Enhancement for Interactive Elements]
**Learning:** Adding ARIA attributes to custom interactive elements (like disclosure panels and state-toggle buttons) significantly improves the experience for screen reader users by providing semantic meaning that standard HTML tags might lack.
**Action:** Always include `aria-expanded` and `aria-controls` for disclosure components, and `aria-pressed` for toggle buttons. Ensure icon-only buttons have descriptive `aria-label` attributes.
## 2025-05-23 - [Scroll to Top Micro-UX]
**Learning:** Implementing a "Scroll to Top" button with a clear visibility threshold and smooth scrolling significantly improves navigation on content-heavy pages. Using Framer Motion for enter/exit animations adds a layer of polish that makes the interaction feel deliberate and responsive.
**Action:** Use a 300px scroll threshold and 100ms throttle for scroll listeners to balance responsiveness and performance. Always provide localized ARIA labels for such floating interactive elements.
