## 2025-05-22 - [Accessibility Enhancement for Interactive Elements]
**Learning:** Adding ARIA attributes to custom interactive elements (like disclosure panels and state-toggle buttons) significantly improves the experience for screen reader users by providing semantic meaning that standard HTML tags might lack.
**Action:** Always include `aria-expanded` and `aria-controls` for disclosure components, and `aria-pressed` for toggle buttons. Ensure icon-only buttons have descriptive `aria-label` attributes.

## 2025-05-23 - [Keyboard Navigation and Focus States]
**Learning:** Many interactive elements default to `outline-none` for visual "cleanliness," which inadvertently breaks keyboard accessibility. Using `focus-visible` allows for clear focus indicators that only appear when navigating via keyboard.
**Action:** Prefer `focus-visible:ring-2 focus-visible:ring-blue-600 outline-none` over `focus:outline-none` to provide accessible feedback for keyboard users while keeping the UI clean for mouse users.
