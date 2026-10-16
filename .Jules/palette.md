## 2025-05-22 - [Accessibility Enhancement for Interactive Elements]
**Learning:** Adding ARIA attributes to custom interactive elements (like disclosure panels and state-toggle buttons) significantly improves the experience for screen reader users by providing semantic meaning that standard HTML tags might lack.
**Action:** Always include `aria-expanded` and `aria-controls` for disclosure components, and `aria-pressed` for toggle buttons. Ensure icon-only buttons have descriptive `aria-label` attributes.

## 2025-05-23 - [Translation Key Consistency for UI Labels]
**Learning:** React components that use i18next expect keys to be present in the translation JSON files. If a component calls `t("fields.pov")` but only `fields.pov_label` exists, the UI will display the literal key string (e.g., "FIELDS.POV"), which degrades the user experience.
**Action:** Always verify that translation keys used in the JSX (`t("key")`) have exact matches in all localized JSON files. Support both legacy and new key formats if necessary for backward compatibility.
