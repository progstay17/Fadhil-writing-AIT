## 2025-05-22 - [Accessibility Enhancement for Interactive Elements]
**Learning:** Adding ARIA attributes to custom interactive elements (like disclosure panels and state-toggle buttons) significantly improves the experience for screen reader users by providing semantic meaning that standard HTML tags might lack.
**Action:** Always include `aria-expanded` and `aria-controls` for disclosure components, and `aria-pressed` for toggle buttons. Ensure icon-only buttons have descriptive `aria-label` attributes.

## 2025-05-23 - [Micro-UX: Scroll to Top Button]
**Learning:** Implementing a 'Scroll to Top' button on long, content-heavy pages significantly improves navigation efficiency and reduces user friction. Using performance optimizations like `requestAnimationFrame` for scroll listeners ensures the UI remains responsive and the main thread isn't bogged down by scroll events.
**Action:** For long pages, provide a clear, accessible way (with proper ARIA labels and translations) to return to the top. Use Framer Motion for smooth visual transitions and always throttle or debounce scroll listeners to maintain performance.
