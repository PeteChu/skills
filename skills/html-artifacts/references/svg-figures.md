# Pattern: SVG figure sheet

Draw the diagrams a post, doc, or README needs as a single sheet of inline SVG figures. Every
figure uses the same style and has a caption, a placement note, and alt text, plus a button that
copies the standalone SVG.

- **Example:** [`examples/svg-figures.html`](../examples/svg-figures.html)
- **Source inspiration:** `10-svg-illustrations.html` in
  [ThariqS/html-effectiveness](https://github.com/ThariqS/html-effectiveness)
- **Interactive:** yes (Copy SVG / Copy alt per figure; Alpine)

## Use when

- "Draw the diagrams for this post", "make illustrations for the docs page", "I need figures
  for the README / RFC / slide".
- The output gets pasted somewhere else (CMS, Notion, Figma, slides), so each figure has to work
  without the page around it.
- There are several related figures that should share one visual language. For a single
  clickable process diagram, use [`flowchart.md`](flowchart.md). For a whole explainer page, use
  [`concept-explainer.md`](concept-explainer.md).

## Reader's job

Scan the sheet, check that each figure says one thing correctly, then copy the ones they want.
The caption says what the figure is for and where it goes, and the button exports it.

## Anatomy

1. **Header**: eyebrow (`Figure sheet · <publication>`), title naming the post, a prompt box,
   and a mono spec line (count, viewBox width, "palette-locked", "self-styled").
2. **Figure index**: 2–4 column grid of anchor cards (`Fig. N · §section` + title).
3. **One `<figure>` per diagram**, each with:
   1. A canvas `div` (ivory, gray border, `rounded-xl`) holding one `<svg>`.
   2. A `<figcaption>` containing a mono placement line ("goes after §3 …"), a serif title, a
      one-line purpose in muted text, and the alt text in a gray mono box.
   3. Buttons: **Copy SVG** (dark, primary) and **Copy alt** (outline).
4. **Palette and drawing rules**: swatch grid (name, hex, role) plus 4–6 rules (stroke widths,
   corner radii, label sizes, what clay/olive/rust mean). This keeps figure 5, added later,
   consistent with the first four.

## Build steps

1. Read the draft. List the claims that need a picture, aiming for one figure per claim
   (3–6 total). Write each caption before drawing anything.
2. Fix a shared viewBox width (720 works well). Height can vary per figure.
3. Draw with **presentation attributes only** (`fill`, `stroke`, `font-family`): no Tailwind
   classes and no page CSS inside the `<svg>`. Put `xmlns`, `width`, `height`, `role="img"`, and
   `aria-label` on the root, and start with a full-size background `<rect>`.
4. Prefix marker and gradient ids per figure (`f1-arrow`, `f3-clay`). Pasted SVGs share one
   document, and duplicate ids silently retarget arrows.
5. Use clay for the single focal element in each figure, and olive/rust for good/bad. Keep these
   meanings the same across every figure.
6. Write the alt text as one or two sentences that state what the figure shows, not "diagram of".

## Key snippet

```html
<figure id="fig-1" class="m-0 mb-16 scroll-mt-6" x-data="{ copied: '' }">
  <div x-ref="canvas" class="border border-[#d1cfc5] rounded-xl overflow-hidden bg-ivory [&>svg]:block [&>svg]:w-full [&>svg]:h-auto">
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="340" viewBox="0 0 720 340" role="img" aria-label="…">
  <defs><marker id="f1-gray" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#87867f"/></marker></defs>
  <rect width="720" height="340" fill="#faf9f5"/>
  <g font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="11">…</g>
</svg>
  </div>
  <figcaption class="flex flex-col sm:flex-row sm:items-start gap-4 pt-4 px-1">
    <div class="flex-1 min-w-0">
      <p class="font-mono text-[11px] uppercase tracking-[0.06em] text-[#87867f] m-0 mb-1">Fig. 1 · goes after §2</p>
      <p class="font-serif text-[19px] text-[#141413] m-0 mb-1">Token bucket</p>
      <p class="font-mono text-[11.5px] bg-[#f0eee6] border border-[#d1cfc5] rounded-lg px-3 py-2 mt-3 mb-0">alt · <span x-ref="alt">…</span></p>
    </div>
    <button type="button" class="font-mono text-xs bg-[#141413] text-ivory rounded-lg px-3 py-1.5"
      @click="navigator.clipboard.writeText($refs.canvas.innerHTML.trim()).then(() => { copied = 'svg'; setTimeout(() => copied = '', 1400) })">
      <span x-show="copied !== 'svg'">Copy SVG</span><span x-show="copied === 'svg'" x-cloak>Copied ✓</span>
    </button>
  </figcaption>
</figure>
```

Copy the **wrapper's** `innerHTML` rather than the SVG's `outerHTML`. That keeps Alpine
attributes such as `x-ref` out of the exported markup.

## Interaction

- One `x-data="{ copied: '' }"` per figure. The flag names which button just fired, so each one
  shows its own "Copied ✓" state.
- Index cards are plain anchors (`href="#fig-2"`) and figures use `scroll-mt-6`.
- If the user wants files rather than clipboard text, a download button can build a `Blob` from
  the same string. Do not fetch anything.

## Pitfalls

- Tailwind classes or page CSS inside the SVG: it looks right on the sheet and renders unstyled
  once pasted.
- Shared marker ids across figures (`#arrow` × 4), which breaks arrows in the CMS.
- Labels colliding with lines or shapes. Check the screenshot, nudge `y` values, and keep a
  12px gap.
- Text that overruns the viewBox. 11px mono is about 6.6px per character, so measure long
  annotations.
- Decorative figures that make no claim. If you cannot write the caption, drop the figure.
- Gradients, shadows, or a fifth accent color that breaks the shared visual language.

## Combines well with

- [`concept-explainer.md`](concept-explainer.md): draft the figures here, then place them in
  the explainer.
- [`slide-deck.md`](slide-deck.md): the same SVGs become slide visuals.

## Checklist

- [ ] Every SVG has `xmlns`, a viewBox, `role="img"`, `aria-label`, and a background rect.
- [ ] There are no classes inside the SVGs, and every id carries its figure prefix.
- [ ] Each figure has a placement line, a title, a one-line purpose, and alt text.
- [ ] Copy SVG and Copy alt both work and show feedback.
- [ ] Clay/olive/rust mean the same thing in every figure, and the rules section says so.
