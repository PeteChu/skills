# Pattern: Triage board

A throwaway kanban for sorting 15–40 items into a few buckets (Now / Next / Later / Cut).
The user drags or keys items into place, watches counts and capacity, and copies the final
ordering back as Markdown.

- **Example:** [`examples/triage-board.html`](../examples/triage-board.html)
- **Source inspiration:** `18-editor-triage-board.html` in
  [ThariqS/html-effectiveness](https://github.com/ThariqS/html-effectiveness)
- **Interactive:** yes (Alpine state + HTML5 drag-and-drop, with button and keyboard moves)

## Use when

- "Help me prioritize these", "triage this backlog", "sort these into now/next/later", "what do we cut".
- A list already exists (tickets, outdated deps, findings, feedback) and the user's judgment decides
  the order. You make a best-guess pre-sort and the user corrects it.
- Not for a single ranked list of fewer than 10 items (a static table is enough), and not for config
  values (use [`flag-editor.md`](flag-editor.md)).

## Reader's job

Move cards until the board feels right, then export. Each card must be judgeable without opening
anything, so it carries an id, a one-line title or note, kind, size, and owner.

## Anatomy

1. **Header**: eyebrow (`Editor · <repo> · <cycle>`), a title naming the decision, a prompt box, and
   a mono line with the rules (point scale, capacities, hard constraints).
2. **Sticky toolbar**: per-column counts, `N moved`, warning count, active-filter chip, Reset, and
   the primary **Copy as Markdown** button.
3. **Warnings callout** (`border-rust`): one line per broken constraint, shown only when non-empty.
4. **Hint line**: `› drag cards, or focus a card and use ← → / ↑ ↓ · click a tag to filter`.
5. **Board**: `sm:grid-cols-2 xl:grid-cols-4`. Each column has a colored top border (clay Now,
   olive Next, gray Later, light gray Cut), a serif label, a count pill, a one-line rationale, and a
   capacity bar (`olive` → `rust` when over).
6. **Cards**: mono id + kind tag (button, filters) + size box; title/note; owner chip; ← ↑ ↓ → buttons.
7. **Export preview**: a `<details>` with the generated Markdown in a dark `<pre x-text>`.

## Build steps

1. Gather the real items with real ids. Pre-sort them into a defensible first guess, because a blank
   board is a chore.
2. Write the column rationales and constraints first (capacity in points, "security never in Cut").
   These drive the warnings, and they also appear in the export.
3. Put the items in a `const INITIAL = [...]` array and render everything from it (see Interaction).
4. Implement one `moveTo(item, col, beforeId)` and route drag, buttons, and keys through it.
5. Generate the Markdown from state: column heading with count and points, the rationale in
   italics, a numbered list in card order, then any open warnings.

## Key snippet

```html
<template x-for="c in columns" :key="c.key">
  <div class="bg-white border border-[#d1cfc5] border-t-4 rounded-xl flex flex-col min-h-[220px]"
    :class="[c.accent, overCol === c.key ? 'outline-2 outline-dashed outline-clay -outline-offset-4' : '']"
    @dragover.prevent="overCol = c.key" @drop.prevent="drop(c.key, null)" role="region" :aria-label="c.label">
    <!-- head: label, count pill, rationale, capacity bar -->
    <template x-for="it in inCol(c.key)" :key="it.k">
      <article :id="'card-' + it.k" tabindex="0" draggable="true"
        @dragstart="dragK = it.k; $event.dataTransfer.setData('text/plain', it.k)"
        @drop.stop.prevent="drop(c.key, it.k)" @keydown="onKey($event, it)"
        class="card border border-[#d1cfc5] rounded-lg px-3 py-2.5 focus-visible:outline-2 focus-visible:outline-clay"
        :class="filter && it.kind !== filter ? 'opacity-30' : ''">…</article>
    </template>
  </div>
</template>
```

```js
moveTo(it, col, beforeK = null) {            // the one mutation every input path uses
  this.items.splice(this.items.indexOf(it), 1); it.col = col;
  const at = beforeK ? this.items.findIndex(i => i.k === beforeK) : -1;
  at === -1 ? this.items.push(it) : this.items.splice(at, 0, it);
},
```

Order lives in the single `items` array. `inCol(key)` filters it, so card order and export order
always agree.

## Interaction

These are the shared rules for the **custom editing UI** family: `triage-board`, `flag-editor`, and
`prompt-tuner`. The other two patterns link here.

1. **Embed the data.** Put the source data in a `<script>` as `const INITIAL = [...]`, along with
   the vocabularies (columns, kinds, slots, groups). State is `INITIAL.map(x => ({ ...x }))` inside an
   `x-data="editor()"` function, so Reset is a fresh copy and nothing aliases the original.
2. **Render from data.** Never hand-write repeated cards, rows, or chips. Use `x-for` with stable
   `:key`s and `x-text` only. No `innerHTML`, even for highlighting (split into segments instead).
3. **One mutation path.** Drag, buttons, and keyboard call the same method, and derived values
   (counts, points, diff, warnings, export) are getters, so they cannot drift.
4. **Sticky toolbar.** `sticky top-0 bg-ivory/90 backdrop-blur` with live counts, a `changed/moved`
   count, a warning count (`text-rust` / `✓` in olive), Reset, and the primary export as the
   right-most dark button.
5. **Validate constraints inline and in aggregate.** Mark the offending card or row (rust border or
   tint), list all problems in one callout or panel, and offer a one-click fix when the fix is
   obvious. Warn, don't block. The user may export anyway, and open warnings go into the export.
6. **Show what changed.** Compare against `INITIAL` with a clay marker, a "was …" chip, a per-item
   revert, and a "changed only" filter when the list is long.
7. **Accessible moves.** Every drag has a button equivalent (`← ↑ ↓ →` with `aria-label`s). Focused
   items respond to arrow keys, and focus is restored with `$nextTick(() => el.focus())` after
   re-render. HTML5 DnD does not fire on touch, so the buttons are the mobile path.
8. **Always end with an export.** Copy Markdown, Copy diff, or Copy prompt, generated from state,
   plus a visible preview of exactly what will be copied. The copy flashes "Copied ✓" for 1.4 s and
   falls back to a hidden `<textarea>` + `execCommand('copy')` when `navigator.clipboard` is missing
   (`file://`).

## Pitfalls

- An empty board ("here are 28 items, you sort them"). Always pre-sort with a rationale.
- Drag-only moves exclude keyboard and touch users.
- Counts or points computed in the template in several places drift from the export.
- Exporting by column only and losing the within-column order the user carefully set.
- Dimming filtered cards instead of hiding them is right. Hiding them makes drops land in surprising
  positions.

## Combines well with

- [`implementation-plan.md`](implementation-plan.md): turn the Now column into a sequenced plan.
- [`status-report.md`](status-report.md): report progress against the triaged Now/Next later.
- [`blindspot-pass.md`](blindspot-pass.md): triage the findings of a blindspot pass.

## Checklist

- [ ] Items embedded as data, pre-sorted, with real ids; Reset restores the pre-sort.
- [ ] Counts, capacity, and warnings update on every move; constraints are visible in the header.
- [ ] Drag, buttons, and arrow keys all work; focus survives a move.
- [ ] Copy as Markdown preserves column and card order and includes open warnings.
