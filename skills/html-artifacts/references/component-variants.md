# Pattern: Component variant sheet

Render one component in every intent × state × size on a single contact sheet, so inconsistencies
that are invisible one story at a time show up as a broken row or column. Number each gap and turn
it into a fix.

- **Example:** [`examples/component-variants.html`](../examples/component-variants.html)
- **Source inspiration:** `06-component-variants.html` in
  [ThariqS/html-effectiveness](https://github.com/ThariqS/html-effectiveness)
- **Interactive:** no (static by default). Optional: density/border controls and hover-to-show-props,
  as in the source.

## Use when

- "Show me every variant of X", "all the button states", "audit our Card / Input / Badge", "before I
  refactor this component".
- A component API is about to change (moving to `cva`, adding a size) and you need a baseline.
- Design QA: hover/active/focus/disabled consistency, focus rings, loading states, RTL, dark
  surfaces.
- For the whole token set, use [`design-system.md`](design-system.md). To compare a few new looks for
  something unbuilt, use [`visual-directions.md`](visual-directions.md).

## Reader's job

Scan rows and columns for the cell that breaks the pattern. A row should change consistently across
states, and a column should mean the same thing for every intent. Flagged cells must be findable in
one glance and must link to an explanation.

## Anatomy

1. **Header**: eyebrow (`Contact sheet · <repo>/<package>`), title, prompt box, and a mono line with
   the source file, commit, and "states forced with static classes".
2. **Stat cards**: intents, states, cells rendered, and findings (the findings card in rust).
3. **Matrix 01 — intent × state** at the default size: a header row of states (`default`, `hover`,
   `focus-visible`, `active`, `loading`, `disabled`, `with icon`) and a header column of intents.
   Every cell holds one real rendered instance.
4. **Matrix 02 — intent × size**, plus the tightest combination (e.g. `sm · loading`). Next to it, an
   **anatomy SVG** at 2× with dimension lines (height, padding, icon, gap, radius, focus ring) and a
   small size spec table.
5. **Edge cases**: 4–6 figure cards for things a matrix cannot show (long label, icon-only, dark
   surface, RTL, width lock while loading, mobile footer). Each gets an `ok` / `watch` chip.
6. **Findings**: a numbered list matching the cell markers. Each item has a title, one sentence of
   impact, the fix, and a `file:line`. Optionally add a code panel with the proposed API that fixes
   them all.

## Build steps

1. Read the component and list its real axes and values. Do not invent intents it lacks.
2. Force each state with static classes (hover → the hover background, focus → `ring-2 ring-offset-2`,
   disabled → the actual opacity). Use the component's real class strings so bugs reproduce.
3. Build the matrix as a CSS grid with `gap-px` on a gray background, so the gaps draw the cell
   borders. Use **solid** cell backgrounds, because a translucent tint shows the gray through.
4. Render identical content in every cell (same label per intent) so only the variable under test
   changes.
5. Walk each row, then each column, and write down every inconsistency. Mark the cell with a numbered
   rust dot that links to `#fN`.
6. Add the edge cases from real screens, then write findings with locations and the smallest fix.

## Key snippets

```html
<div class="overflow-x-auto border border-[#d1cfc5] rounded-xl">
  <div class="sheet grid grid-cols-[132px_repeat(7,minmax(128px,1fr))] gap-px bg-[#d1cfc5] min-w-[1040px]">
    <div class="bg-[#f0eee6] px-3 py-2.5 font-mono text-[11px] uppercase tracking-[0.05em] text-[#87867f]">focus-visible</div>
    <!-- …header cells, then per intent: label cell + one cell per state… -->
    <div class="relative flex items-center justify-center min-h-[84px] px-2 bg-[#F7EDEC]">
      <button type="button" tabindex="-1" class="… bg-[#B3261E] text-white ring-2 ring-offset-2 ring-offset-white ring-[#1F6F5C]">Void invoice</button>
      <a href="#f2" class="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-rust text-white font-mono text-[10.5px] leading-5 text-center" aria-label="Finding 2">2</a>
    </div>
  </div>
</div>
```

```css
.sheet button { pointer-events: none; }            /* specimens, not controls */
.finding:target { outline: 2px solid #d97757; outline-offset: 4px; }
```

For a large matrix, generate the cells from a small table of `intent → state → classes` (a script
or Alpine `x-for`) so a typo cannot fake a finding. Ship the output as static HTML.

## Pitfalls

- Mocking states with approximate colors instead of the component's classes. The sheet then audits
  your mock, not the code.
- Translucent finding tints on a `gap-px` grid look muddy. Use a solid tint such as `#F7EDEC`.
- Different labels per cell: width changes look like bugs.
- Leaving specimens focusable or clickable. Use `tabindex="-1"` and `pointer-events: none`.
- Findings without a location or a fix. That makes the sheet a gallery, not an audit.

## Combines well with

- [`design-system.md`](design-system.md): the token page this sheet's colors and sizes should come
  from.
- [`implementation-plan.md`](implementation-plan.md): turn the numbered findings into the refactor
  plan.

## Checklist

- [ ] Rows are intents, columns are states, and a second grid covers sizes, all using the
      component's real classes.
- [ ] One label per intent across all cells. Specimens are inert.
- [ ] Each finding has a numbered marker that links to an item with impact, fix, and `file:line`.
- [ ] Edge cases cover long text, no text, dark surface, and RTL.
- [ ] The matrix scrolls horizontally inside its frame on narrow screens.
