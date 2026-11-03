# Pattern: Module map

Draw an unfamiliar package as boxes and arrows, highlight the hot path, name the entry points,
and walk the reader hop by hop through the code, with a sticky sidebar saying where to start.

- **Example:** [`examples/module-map.html`](../examples/module-map.html)
- **Source inspiration:** `04-code-understanding.html` in
  [ThariqS/html-effectiveness](https://github.com/ThariqS/html-effectiveness)
- **Interactive:** no (native anchors, `<details>`, sticky sidebar)

## Use when

- "I've never opened this package", "draw me the shape of X", "how does this module fit together",
  "where do I start reading", "onboard me to this codebase".
- The answer is about **structure**: which modules exist, who imports whom, which path is hot.
- If the question is "how does *feature* X behave and how do I configure it", use
  [`feature-explainer.md`](feature-explainer.md). If it is a process with branches and timings,
  use [`flowchart.md`](flowchart.md).

## Reader's job

Build a mental model fast enough to open the right file next. After 60 seconds they should be able
to name the hub module, the entry points, and the order to read files in.

## Anatomy

1. **Header**: eyebrow (`<repo> · <package path> · module map`), title, prompt box, a 2–3 sentence
   summary that names the **hub** (the one file worth reading end to end), and a mono meta line
   (commit, file count, LOC, runtime deps).
2. **Stat cards** (4): modules, entry points, hot-path hops + latency, test coverage (flag the weak
   spot in rust).
3. **Two-column body** `lg:grid-cols-[minmax(0,1fr)_280px]`:
   - **01 The map**: inline SVG in **lanes** (Entry points / Core / Adapters). Hot-path arrows in
     clay with numbered badges; other imports gray; pure helpers dashed. The hub box gets a
     thicker clay stroke. Each box is an SVG `<a href="#m-…">` to its index row. Legend below.
   - **02 Entry points**: one card per way into the package: symbol, `path:line`, what calls it,
     usage count. Mark the hot one with a clay border.
   - **03 Hot path, hop by hop**: numbered rows that **match the SVG badges**: `path :lines`, 2–3
     sentences, optional `<details>` with a 6–10 line excerpt. Open only the hub's excerpt.
   - **04 Module index**: table of module, responsibility, LOC, fan-in, imports. Rows carry the
     `id`s the SVG links to; tint the hub row.
   - **Sidebar** (`lg:sticky lg:top-6 self-start`): on-this-page nav, "Read in this order" list,
     Gotchas (clay panel), Boundaries (✓ holds / ✕ violated).

## Build steps

1. List the package's files and imports (`rg "^import" packages/x/src`). Group into 6–10 modules;
   a module is a folder or a file with a single responsibility, not every file.
2. Find entry points: what the package's `index` re-exports, plus binaries and workers.
3. Trace the single most frequent operation through the code. That is the hot path. Record
   `path:line` ranges for each hop as you go.
4. Lay out the SVG on a grid before drawing: lanes at fixed `y`, boxes `170×56` at fixed `x`
   columns. Route arrows so none cross; reorder boxes until they don't.
5. Write the walkthrough rows in badge order, then the index, then the sidebar. Gotchas must be
   things you saw in the code (fallbacks, ordering, ties), not generic advice.

## Key snippet

```html
<svg class="min-w-[760px] w-full h-auto" viewBox="0 0 960 410" role="img" aria-label="Module map…">
  <defs><marker id="arrow-hot" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#d97757"/></marker></defs>
  <rect x="20" y="150" width="920" height="106" rx="10" fill="#faf9f5" stroke="#f0eee6"/> <!-- lane -->
  <text x="34" y="166" font-family="ui-monospace, monospace" font-size="10" fill="#87867f">CORE</text>
  <line x1="375" y1="106" x2="375" y2="178" stroke="#d97757" stroke-width="2.5" marker-end="url(#arrow-hot)"/>
  <circle cx="375" cy="142" r="10" fill="#d97757"/><text x="375" y="146" text-anchor="middle" fill="#fff" font-size="11">1</text>
  <a href="#m-session">
    <rect x="290" y="180" width="170" height="56" rx="10" fill="rgba(217,119,87,0.18)" stroke="#d97757" stroke-width="2.5"/>
    <text x="375" y="204" text-anchor="middle" font-family="ui-monospace, monospace" font-size="12.5" fill="#141413">Session</text>
    <text x="375" y="222" text-anchor="middle" font-family="ui-monospace, monospace" font-size="10" fill="#87867f">session.ts · hub</text>
  </a>
</svg>
```

```html
<li class="grid grid-cols-[40px_1fr] gap-4 py-5">
  <span class="w-8 h-8 rounded-full bg-oat border border-[#d1cfc5] font-mono text-sm font-semibold flex items-center justify-center">3</span>
  <div class="min-w-0">
    <p class="font-mono text-[13px] text-[#141413] m-0 mb-1.5">oplog/OpLog.ts <span class="text-[#87867f]">:22–40</span></p>
    <p class="m-0">What this hop does and why it matters.</p>
    <details class="fold mt-2">…excerpt…</details>
  </div>
</li>
```

Wrap the SVG in `overflow-x-auto` so it scrolls on phones instead of shrinking to unreadable.

## Pitfalls

- Drawing every file. Past ~12 boxes the map stops being readable; group into modules.
- A hot path that is not numbered, or numbers that don't match the walkthrough rows.
- Everything clay. Only the hot path and the hub are highlighted; the rest stays gray.
- Arrows that cross or labels sitting on lines. Re-order columns rather than add bends.
- Forgetting `min-w-0` on the main column: wide code panels then push the sidebar off-screen.

## Combines well with

- [`feature-explainer.md`](feature-explainer.md): once the shape is clear, explain one feature on top of it.
- [`blindspot-pass.md`](blindspot-pass.md): turn the gotchas into a list of things the reader doesn't know to ask.

## Checklist

- [ ] Hub module named in the summary, tinted in the SVG, and first in "Read in this order".
- [ ] SVG badges 1…n match the walkthrough rows; every box links to an index row.
- [ ] Every hop has a real `path:line` range; excerpts are HTML-escaped and ≤10 lines.
- [ ] Sidebar is sticky on desktop and stacks below on mobile.
