# Design System Strategy: Soft Maximalism for Digital Learning

## 1. Overview & Creative North Star
This design system is built upon the North Star of **"The Guided Journal."** Unlike rigid, enterprise learning platforms that feel sterile and industrial, this system adopts a "Soft Maximalist" philosophy. It prioritizes warmth, human touch, and visual joy while maintaining the high-end editorial clarity of a boutique magazine.

To move beyond "template" looks, we break the grid with intentional asymmetry. Organic shapes, hand-drawn doodle accents, and overlapping elements (like an image spilling out of a card) create a sense of movement. We reject the "flat" web; instead, we treat the screen as a tactile workspace where information is curated, not just displayed.

---

## 2. Color & Surface Philosophy
The palette is a sophisticated blend of grounded neutrals and vibrant, optimistic accents.

*   **Foundation:** The primary canvas uses `surface` (#FFF8F1) and `background` (#C8EFE3).
*   **The "No-Line" Rule:** We strictly prohibit the use of 1px solid borders for sectioning. Structural boundaries must be defined through background color shifts. For example, a `surface-container-low` section should sit on a `surface` background to define its territory without the "boxiness" of traditional lines.
*   **Surface Hierarchy & Nesting:** Treat the UI as physical layers of fine paper. 
    *   **Lowest Layer:** `background` (Mint) for the global canvas.
    *   **Mid Layer:** `surface` (Cream) for main content blocks.
    *   **Top Layer:** `surface-container-highest` for interactive elements or emphasized cards.
*   **The "Glass & Gradient" Rule:** Use Glassmorphism (semi-transparent surface colors with 12px–20px backdrop-blur) for floating navigation bars or overlays. This prevents elements from feeling "pasted on" and integrates them into the soft environment.
*   **Signature Textures:** Apply a subtle linear gradient to main CTAs (Primary to Primary-Container) to give a "radiant" effect that flat coral cannot achieve alone.

---

## 3. Typography: Editorial Authority
Typography is the voice of the system. We use a high-contrast scale to create an editorial rhythm.

*   **Display & Headlines (Noto Serif/Playfair Display):** These should be bold and expressive. Use a mix of *Italic* and Normal weights within the same sentence to emphasize key concepts. This mimics high-end editorial layouts.
*   **Body & UI (Plus Jakarta Sans/Nunito):** Chosen for its high legibility and friendly, open counters. It provides a stable anchor for the more expressive headlines.
*   **Handwritten Labels (Caveat):** Used sparingly for annotations, "Doodle" notes, or side-comments. This adds the "human-in-the-loop" feel essential for a learning environment.

---

## 4. Elevation & Depth
Hierarchy is achieved through **Tonal Layering** and ambient light, not structural rigidity.

*   **The Layering Principle:** Depth is "stacked." Place a `surface-container-lowest` card on a `surface-container-low` section to create a soft, natural lift.
*   **Ambient Shadows:** Floating elements (like "xl" cards) use extra-diffused shadows. 
    *   *Spec:* `0px 20px 40px rgba(93, 63, 56, 0.06)`. Note the tint: we use a low-opacity version of `on-surface-variant` rather than pure black to keep the "warmth" of the cream surfaces.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline-variant` token at 15% opacity. Never use 100% opaque borders.
*   **Wavy Dividers:** In place of horizontal rules, use SVG wavy dividers to transition between large background color sections. This reinforces the organic, soft aesthetic.

---

## 5. Components & Interaction Patterns

### Buttons
*   **Primary:** Pill-shaped (`rounded-full`), using the `primary` (#A53B22) fill. Use a slight scale-up transform on hover (1.02x).
*   **Secondary:** Pill-shaped, `secondary-container` fill with `on-secondary-container` text.
*   **Tertiary:** Text-only with a `Caveat` handwritten underline or a "doodle" arrow (`curvy SVG`).

### Cards & Containers
*   **The "XL" Card:** Use `rounded-xl` (3rem/48px) for major content sections. Cards should never have borders; use `surface-container-low` and ambient shadows to define them.
*   **Dashed Zones:** For "Upload" or "Drop" zones, use a thick, rounded dashed stroke in `outline-variant`. This communicates an "informal/work-in-progress" space.

### Learning-Specific Components
*   **Confidence Bars:** Instead of a thin loading bar, use a thick, `rounded-full` track. Use a gradient of `secondary` to `tertiary` to show progress.
*   **Doodle Accents:** Scatter `star` or `flower` SVGs near successful completion states or "lightbulb" moments. These are decorative but provide emotional feedback.
*   **Annotation Labels:** Use `Caveat` text paired with a hand-drawn SVG arrow to point out key features in the UI for new users.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** overlap elements. Allow an image to break the boundary of a card to create depth.
*   **Do** use ample white space. Refer to the `16` (5.5rem) and `20` (7rem) spacing tokens to separate major editorial sections.
*   **Do** use the `surface-tint` sparingly to highlight active states in navigation.

### Don't:
*   **Don't** use 90-degree corners. Everything must be at least `sm` (0.5rem), with a strong preference for `xl` (3rem) on primary containers.
*   **Don't** use pure black (#000000) for text. Use `on-surface` (#1E1B17) to maintain the warm, organic feel.
*   **Don't** align everything to a rigid center. Use "weighted" asymmetry where an image on the left is balanced by a smaller, denser block of text on the right.

---

## 7. Token Quick Reference

| Token Group | Value/Spec | Purpose |
| :--- | :--- | :--- |
| **Radius: XL** | 3rem (48px) | Main content containers / Cards |
| **Radius: Pill** | 9999px | Buttons, Chips, Search bars |
| **Shadow: Soft** | `0 20px 40px rgba(93, 39, 56, 0.08)` | Floating "curated" elements |
| **Surface: Base** | #FFF8F1 (`surface`) | The primary paper-like reading surface |
| **Accent: CTA** | #A53B22 (`primary`) | All high-priority actions |
| **Typography: High** | Noto Serif / Playfair | Headlines & Branding |
| **Typography: Low** | Plus Jakarta Sans | Utility, Labels, Body |