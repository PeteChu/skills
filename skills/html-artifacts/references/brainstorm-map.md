# Pattern: Brainstorm map

Lay out 8–12 codebase-grounded ideas on an effort × impact plot (or a cheapest-to-boldest
spectrum), each with evidence from the repo. "Resonates" checkboxes assemble a reply the user
pastes back.

- **Example:** [`examples/brainstorm-map.html`](../examples/brainstorm-map.html)
- **Source inspiration:** `unknowns/05-churn-brainstorm.html` in
  [ThariqS/html-effectiveness](https://github.com/ThariqS/html-effectiveness)
- **Interactive:** yes (clickable plot, sort, resonate checkboxes, ★ lead pick, reply bar)

## Use when

- "Brainstorm N ways to…", "give me ideas from cheapest to most ambitious", "where could we
  intervene", "what are all our options for…", "I'll tell you which ones resonate".
- The problem is open-ended, and the user expects to react to a spread of options rather than
  choose between 2–4 fully worked designs.
- For 2–4 options compared in depth with code, use [`code-approaches.md`](code-approaches.md).
  For visual options, use [`visual-directions.md`](visual-directions.md).

## Reader's job

Scan the plot, read the cards that look interesting, tick the ones that resonate, and copy the
reply. The user should never have to type out "I like #3 and #6, start with #6."

## Anatomy

1. **Header**: eyebrow (`Brainstorm · <repo> · <area>`), a title that states the range
   ("Ten places to…, from a one-line fix to a quarter-long bet"), the prompt box with Copy, and one
   paragraph naming what was read plus the **pattern you noticed** across the ideas.
2. **Baseline stats** (optional): 3–4 stat cards for the metric being moved.
3. **Where the problem lives** (optional): a small SVG (Gantt, funnel, or flow) that marks which
   stage each idea targets and highlights the critical path in clay.
4. **The map**: an inline SVG scatter. X is effort in bands (S hours, M days, L weeks,
   XL quarter). Y is estimated impact in the metric's unit. Show soft quadrant tints and italic
   labels (Quick wins, Big bets, Fill-ins, Money pits). Dots are numbered circles. A side panel
   shows the hovered idea and a legend.
   - Simpler alternative: a one-axis "ship this afternoon → quarter-long bet" track with numbered
     dots, for ideas whose impact you can't estimate.
5. **Idea cards**: a 2-column grid with the same shape for every card:
   1. `#n` badge, serif title, and effort chip (S olive, M default, L clay, XL rust).
   2. A mono path line (file:line or config key).
   3. **"Found in the repo:"** what exists today (half-built code, a TODO, a disabled flag, a
      missing config line).
   4. An **Impact** band with an estimated number and the caveat.
   5. A "This resonates" checkbox, plus a "★ start here" radio that appears once ticked.
6. **Opinion callout**: "If you only pick two…" with clay border.
7. **Sticky reply bar** (fixed bottom): a count, a live reply sentence, an optional note input,
   Reset, and Copy reply (disabled until something is ticked).

## Build steps

1. Search the code first. The best ideas are **already half-built**: flags left off, TODOs,
   utilities that exist but aren't wired up, configs one key short. Say so explicitly.
2. Generate more ideas than you need, then keep 8–12 that span the effort range. Include at least
   two S ideas and one XL.
3. Estimate effort and impact on one shared scale, and say whether impacts overlap ("these don't
   add up").
4. Put the idea data in one JS array (`n`, `short`, `effort`, `e`, `mins`). The plot, sort,
   and reply all read from it.
5. Place dots by hand from the numbers (`cy = baseline - value * scale`). Nudge any dots that
   collide, and keep quadrant labels clear of dots.

## Key snippets

```html
<g class="dot cursor-pointer" tabindex="0" role="button" aria-label="Idea 6, per-worker schemas, M, 12 min"
   @click="toggle(6)" @keydown.enter.prevent="toggle(6)" @mouseenter="hover=6" @mouseleave="hover=0" @focus="hover=6" @blur="hover=0">
  <circle cx="415" cy="168" r="15" :fill="picked[6] ? '#d97757' : '#ffffff'" stroke="#87867f" stroke-width="2" />
  <text x="415" y="172" text-anchor="middle" font-size="11" :fill="picked[6] ? '#fff' : '#141413'">6</text>
</g>
```

```html
<article :style="{ order: rank(6) }" :class="picked[6] ? 'border-clay ring-1 ring-clay' : 'border-[#d1cfc5]'"
  class="bg-white border rounded-xl p-5 flex flex-col gap-3">
  …
  <div class="flex flex-wrap gap-4 mt-auto font-mono text-xs">
    <label><input type="checkbox" x-model="picked[6]" class="accent-clay"> This resonates</label>
    <label x-show="picked[6]" x-cloak class="text-clay-dark"><input type="radio" name="lead" value="6" x-model="lead"> ★ start here</label>
  </div>
</article>
```

```js
get reply() {
  if (!this.picks.length) return '';
  const lead = this.lead && this.picked[this.lead] ? this.lead : String(this.picks[0].n);
  return 'These resonate: ' + this.picks.map(i => `#${i.n} (${i.short})`).join(', ') +
    `. Start with #${lead} and write a short plan for it first.` + (this.note.trim() ? ' ' + this.note.trim() : '');
}
```

## Interaction

- Plot dots and card checkboxes share `picked[n]`. Clicking a dot ticks the card and vice versa.
  Dots are focusable and toggle on Enter/Space.
- Sort reorders the cards with CSS `order` from `rank(n)`, with no DOM moves. Offer "cheapest
  first", "most impact", and "least effort".
- Use boolean `picked` keys rather than an `x-model` array, which avoids string/number mismatch.
- Give the body bottom padding (`pb-48`) so the fixed reply bar never covers the footer. Hide the
  note input below `md`.

## Pitfalls

- Ideas with no "found in the repo" evidence. Without it, this is a generic listicle.
- All ideas in one effort band. The spread is the point.
- Labeling every dot with its full title. Labels collide, so use numbers and a hover panel.
- Impact numbers presented as additive when they overlap. Say so on the plot.
- No opinion. One "if you only pick two" callout saves the user a round trip.

## Combines well with

- [`code-approaches.md`](code-approaches.md): once 2–3 ideas resonate, compare them in real code.
- [`implementation-plan.md`](implementation-plan.md): turn the ★ pick into a plan.
- [`blindspot-pass.md`](blindspot-pass.md): run a pass on the chosen idea's territory before building.

## Checklist

- [ ] 8–12 ideas spanning S→XL, each with a path and "found in the repo" evidence.
- [ ] Plot dots don't overlap each other or the quadrant labels, and they toggle the same state as the cards.
- [ ] Every card has the same structure and the effort chip colors are consistent.
- [ ] The reply bar builds a sentence with picks, a lead, and a note, and Copy is disabled when empty.
