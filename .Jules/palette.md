## 2025-05-22 - [Accessibility Enhancement for Interactive Elements]
**Learning:** Adding ARIA attributes to custom interactive elements (like disclosure panels and state-toggle buttons) significantly improves the experience for screen reader users by providing semantic meaning that standard HTML tags might lack.
**Action:** Always include `aria-expanded` and `aria-controls` for disclosure components, and `aria-pressed` for toggle buttons. Ensure icon-only buttons have descriptive `aria-label` attributes.

## 2025-05-23 - [WAI-ARIA Tab Pattern Implementation]
**Learning:** For tabbed interfaces that swap a single content area, using a static ID for the 'role="tabpanel"' and linking all tab buttons to it via 'aria-controls' ensures a stable relationship for assistive technologies. Dynamic 'aria-labelledby' on the panel can then point back to the active tab's unique IDs (e.g., desktop/mobile versions) to provide context.
**Action:** Use static panel IDs with 'aria-controls' on triggers and dynamic 'aria-labelledby' on the panel to maintain accessibility across multiple navigation sources (desktop/mobile).
