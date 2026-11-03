# Pattern: Design system reference

Pull the tokens a repo actually defines (color, type, spacing, radius, elevation) and render them as
one live reference page. Show swatches, a type scale, a spacing ruler, and the core components built
from those tokens. Every value can be copied.

- **Example:** [`examples/design-system.html`](../examples/design-system.html)
- **Source inspiration:** `05-design-system.html` in
  [ThariqS/html-effectiveness](https://github.com/ThariqS/html-effectiveness)
- **Interactive:** yes (Alpine). Click-to-copy on every token, a copy-format switch, and an export
  panel.

## Use when

- "Show me our design tokens", "what colors / type sizes do we have", "make a style reference for
  this repo", "extract the design system".
- Someone is about to build UI and needs the real values next to them, or needs to paste them into a
  prompt.
- To audit a theme: contrast, near-duplicate colors, and raw values that bypass the tokens.
- To compare every state and size of **one** component, use
  [`component-variants.md`](component-variants.md). To see three looks for a design that does not
  exist yet, use [`visual-directions.md`](visual-directions.md).

## Reader's job

Find a value and take it with them. Every swatch, type row, and spacing step should answer "what is
this called, what is its value, and where do I use it" without hovering. One click should put the
value on the clipboard.

## Anatomy

1. **Header**: eyebrow (`<Org> · design system reference`), title, prompt box, and a mono source line
   listing the files the tokens came from, plus a commit and token count.
2. **Sticky toolbar**: section anchors, a segmented control for what a swatch copies (`CSS var` /
   `hex` / `class`), and "Export all".
3. **Color**: swatches grouped by role (Brand, Neutral, Semantic). Each card shows a color block with
   an "Aa" sample in the better text color, the token name, the hex, a usage line, and a computed
   contrast chip (`4.6:1 · AA`). Mark aliases (`info → harbor-500`).
4. **Type scale**: one row per style, with a specimen written in the product's own copy, then mono
   meta (`text-h1 · 30 / 38 · 600`), then "Copy CSS".
5. **Spacing**: bars drawn at their true size on a ruler, labelled with the px value and the token.
6. **Radius & elevation**: sample tiles at each radius, and white cards on a tinted panel showing
   each shadow.
7. **Core components**: 3–5 components (button set, text field, status pill, one composite row)
   rendered **only** from the tokens, each captioned with its source file.
8. **Drift table** (high value): raw literals found in the app that bypass the tokens, with hit
   counts, the closest token, and one example location.
9. **Export**: tabs for `tokens.css`, `tokens.json`, and Tailwind `@theme`, all generated from the
   same data, with a single Copy button.

## Build steps

1. Read the real sources: CSS custom properties, Tailwind config or `@theme`, a `tokens.ts`/JSON,
   and component files. Record each token's name, value, and file.
2. Put the tokens in **one data object** (`colors[]`, `type[]`, `space[]`, `radius[]`, `shadow[]`)
   and render every section and every export from it with `x-for`. Never type a value twice.
3. Compute contrast in JS (WCAG relative luminance) rather than asserting it. Grade it AAA / AA /
   AA large / decor only.
4. Write type specimens with real product nouns, such as a container ID, an invoice line, or a
   screen title. Lorem ipsum hides line-height problems.
5. Grep the app for hex, `px`, and `box-shadow` literals to fill the drift table. Report only real
   hits, with locations.
6. Write callouts last: the one contrast trap and the one alias or duplicate worth knowing.

## Key snippets

```html
<template x-for="c in g.items" :key="c.token">
  <button type="button" @click="copy(colorValue(c), 'Copied ' + colorValue(c))"
    class="group text-left bg-white border border-[#d1cfc5] rounded-xl overflow-hidden hover:border-[#141413] focus-visible:outline-2 focus-visible:outline-clay">
    <span class="block h-20 relative border-b border-[#d1cfc5]" :style="{ background: c.hex }">
      <span class="absolute left-3 bottom-2 font-mono text-[11px] font-semibold" :style="{ color: bestText(c.hex) }">Aa</span>
    </span>
    <span class="block px-3 py-2.5">
      <span class="block font-mono text-[12.5px] text-[#141413]" x-text="c.token"></span>
      <span class="block font-mono text-[11.5px] text-[#87867f]" x-text="c.hex"></span>
      <span class="inline-flex mt-2 border rounded-full px-2 py-0.5 font-mono text-[10.5px]"
        :class="gradeClass(ratio(c.hex, '#FFFFFF'))" x-text="ratio(c.hex, '#FFFFFF').toFixed(1) + ':1 · ' + grade(ratio(c.hex, '#FFFFFF'))"></span>
    </span>
  </button>
</template>
```

```js
lum(hex) {
  const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
},
ratio(a, b) { const x = this.lum(a), y = this.lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); },
get cssExport() { /* build ':root { --x: v; }' from the same arrays the swatches use */ },
```

Draw spacing bars at true size with `:style="{ width: s[1] + 'px', height: s[1] + 'px' }"` so the
ruler doubles as a visual check of the scale.

## Interaction

- **Copy is the whole interaction.** Swatches, spacing steps, radius tiles, and shadows are real
  `<button>`s. Type rows get an explicit "Copy CSS" button.
- A toolbar **format switch** (`var(--x)` / `#hex` / `bg-x`) changes what every swatch copies, so the
  page serves CSS authors, Tailwind authors, and prompt-writers.
- Confirm each copy with a single `role="status"` toast ("Copied var(--hb-signal-500)") instead of
  per-button state.
- Use `navigator.clipboard` with a `textarea` + `execCommand('copy')` fallback, because `file://` is
  not always a secure context.
- Exports are getters over the token data, rendered with `x-text` into a `<pre>`.

## Pitfalls

- Hand-typing values in the markup and again in the export: they will drift. Use one data source.
- Asserting "accessible" without computing contrast. Light tints (`100`, `50`) should read "decor
  only".
- White and near-white swatches with no border disappear on a white card. Always draw the block's
  border.
- Components styled with values that are not tokens. That undercuts the page's purpose.
- Listing tokens without usage notes. "harbor-700: primary hover" is what stops misuse.

## Combines well with

- [`component-variants.md`](component-variants.md): drill from the core components into one
  component's full matrix.
- [`visual-directions.md`](visual-directions.md): explore new looks constrained to these tokens.

## Checklist

- [ ] Every value is rendered from one data object, and every export is generated from it.
- [ ] Source files and commit are named in the header, and drift rows cite locations.
- [ ] Contrast is computed, not claimed. Light swatches have visible borders.
- [ ] Every token is a focusable button that copies, with a visible confirmation.
- [ ] Export offers CSS variables, JSON, and Tailwind `@theme`.
