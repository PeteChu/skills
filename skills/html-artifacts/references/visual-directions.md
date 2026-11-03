# Pattern: Visual directions

Render 3–4 genuinely different visual directions for the same UI, live, with the same data, side
by side. The reader reacts with steal/skip chips, and those chips assemble a reply to paste back.

- **Example:** [`examples/visual-directions.html`](../examples/visual-directions.html)
- **Source inspiration:** `02-exploration-visual-designs.html` and
  `unknowns/03-design-directions.html` in
  [ThariqS/html-effectiveness](https://github.com/ThariqS/html-effectiveness)
- **Interactive:** yes (surface toggle, steal/skip chips, direction pick, copy reply)

## Use when

- "Show me a few looks for…", "I can't picture it", "give me design options", "I have no taste,
  show me what's possible", "explore visual directions for this component/page".
- The user can't describe the design they want but will know it when they see it. Reacting is
  easier than specifying.
- The options differ **visually**. If they differ in code shape, use
  [`code-approaches.md`](code-approaches.md). For states of one settled component, use
  [`component-variants.md`](component-variants.md).

## Reader's job

React, then reply. Point at one direction and name 2–3 details worth carrying over from the others.
The page must turn that gut reaction into a paste-ready instruction without making the reader
write a design brief.

## Anatomy

1. **Sticky toolbar**: project label + a Light/Dark **surface toggle** that flips every stage.
2. **Header**: eyebrow (`Exploration · <surface>`), title naming the component, prompt box, one
   line explaining how to react.
3. **Shared-data strip**: a dashed box that lists the dataset every frame renders (ids, counts,
   names, the one exception). This makes clear that design is the only variable.
4. **Direction grid**: 4 cards in `lg:grid-cols-2` (or 3 in `lg:grid-cols-3`). Each card has these, in order:
   1. `Direction n / 4` eyebrow + serif name + one-line **attitude** in italic quotes (what the
      direction believes, not what it looks like).
   2. **Frame**: fake browser bar (three dots + realistic URL) and a **stage** that renders the
      component live in HTML/SVG. It is not a screenshot or a description.
   3. One or two sentences of rationale that include its weakest point.
   4. **Chips**: 2–3 per card, each either `steal · <detail>` or `skip · <detail>`.
5. **At-a-glance table**: the same 4–5 criteria across all directions (answers first, density,
   phone width, dark surface).
6. **Reply assembler** (sticky bottom): direction radio buttons, chip count, Clear, Copy reply,
   and a live `<pre>` showing the reply.
7. Footer.

## Build steps

1. Fix the dataset first: realistic, specific, and containing one awkward case (a long name, an
   exception, a stale item) so each direction has to handle it.
2. Pick directions that disagree on **philosophy**: dense vs. calm, list vs. pipeline, typographic
   vs. illustrated. Four tints of the same layout tell the reader nothing.
3. Build each stage with the same outer frame and min height (`min-h-[300px]`) so the frames line
   up. Style the inside freely, because each direction needs its own personality.
4. Add `dark:` variants inside each stage, and test the toggle on all four.
5. Write chips as specific, transplantable details ("the big serif weekday", "exception row tinted
   clay"). Avoid verdicts like "nice colors".
6. Preselect one direction and 2–3 chips so the reply never opens empty. The reply's last line
   says what happens next (file path, endpoint).

## Key snippets

Dark surface toggle: register a class-based dark variant next to `@theme`, then toggle `.dark` on
each stage:

```html
<style type="text/tailwindcss">
  @theme { /* foundations tokens */ }
  @custom-variant dark (&:where(.dark, .dark *));
</style>

<div class="p-6 min-h-[300px] flex items-center justify-center transition-colors"
  :class="dark ? 'dark bg-[#1f1e1c]' : 'bg-[#f7f6f2]'">
  <div class="bg-white dark:bg-[#2b2a27] text-[#141413] dark:text-[#f0eee6] rounded-2xl p-5">…</div>
</div>
```

Chips rendered from one data model, so the reply can be computed from it:

```html
<template x-for="c in chipsFor('d1')" :key="c.id">
  <button type="button" @click="toggle(c.id)" :aria-pressed="isOn(c.id)" :class="chipClass(c)"
    class="font-mono text-[11.5px] border rounded-full px-3 py-1 focus-visible:outline-2 focus-visible:outline-clay"
    x-text="(isOn(c.id) ? '✓ ' : '') + c.kind + ' · ' + c.text"></button>
</template>
```

```js
get reply() {
  const on = this.chips.filter(c => this.isOn(c.id));
  const tag = c => c.text + ' (' + c.dir.toUpperCase() + ')';
  const steals = on.filter(c => c.kind === 'steal').map(tag);
  const skips  = on.filter(c => c.kind === 'skip').map(tag);
  return ['Go with ' + this.dirLabel() + '.',
    steals.length && 'Steal: ' + steals.join('; ') + '.',
    skips.length && 'Skip: ' + skips.join('; ') + '.',
    'Then build it as src/portal/ShipmentCard.tsx.'].filter(Boolean).join('\n');
}
```

## Interaction

- State lives in one `x-data="directions()"` on `<body>`: `dark`, `pick`, `chips[]`, `on[]`, `copied`.
- Chips are `<button aria-pressed>`. Steal turns olive and skip turns rust when on. Off chips are neutral.
- Direction picker is `role="radiogroup"` with `role="radio"` buttons. Ring the picked card in clay.
- Copy uses `navigator.clipboard` with a hidden-textarea `execCommand` fallback, because `file://`
  pages can lack clipboard permission.

## Pitfalls

- Directions described in prose or as gray boxes. They must be rendered, or the reader has nothing
  to react to.
- Different data per frame: the reader ends up comparing content instead of design.
- Every direction is "clean and modern". Push at least one direction somewhere uncomfortable.
- Chip text that doesn't survive leaving the page ("this one"). Each chip must make sense in the reply.
- Dark mode that only darkens the stage background while the text inside stays dark.

## Combines well with

- [`component-variants.md`](component-variants.md): once a direction wins, sheet out its states.
- [`clickable-prototype.md`](clickable-prototype.md): turn the winning direction into a click-through flow.

## Checklist

- [ ] Same dataset in every frame, stated in a shared-data strip.
- [ ] 3–4 directions that differ in philosophy, each rendered live and readable on dark.
- [ ] Every card has an attitude line, an honest weakness, and steal/skip chips.
- [ ] Reply opens prefilled, updates live, and copies with a fallback.
