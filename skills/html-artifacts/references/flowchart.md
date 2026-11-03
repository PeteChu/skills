# Pattern: Annotated flowchart

Draw a real process (a pipeline, request lifecycle, job, or approval flow) as a proper flowchart
with steps, decisions, and failure exits. Clicking any node shows what runs there, how long it
takes, how it fails, and where it goes next.

- **Example:** [`examples/flowchart.html`](../examples/flowchart.html)
- **Source inspiration:** `13-flowchart-diagram.html` in
  [ThariqS/html-effectiveness](https://github.com/ThariqS/html-effectiveness)
- **Interactive:** yes (click/Tab to inspect nodes, highlight paths, Copy as Mermaid; Alpine)

## Use when

- "What happens when…", "walk me through the X flow", "draw the pipeline", "why does X
  sometimes take so long / fail?"
- The process has **branches**: decisions, retries, and failure exits that prose would flatten
  into "and then".
- Each step has details (file, timing, config) the reader wants on demand rather than all at
  once. For a static structural map of modules, use [`module-map.md`](module-map.md). For a set
  of standalone illustrations, use [`svg-figures.md`](svg-figures.md).

## Reader's job

Trace one path from start to end, then click the step they are worried about. The chart answers
"what's the shape?" and the side panel answers "what exactly happens here?"

## Anatomy

1. **Header**: eyebrow (`Flowchart · <repo/path>`), title phrased as the question ("What happens
   after…"), and a prompt box.
2. **Stat cards** (optional, 3–4): end-to-end p50, share of traffic on the slow path, retry
   rate, failure rate. These are the numbers that motivated the question.
3. **Two-column layout** `lg:grid-cols-[minmax(0,1fr)_340px]`:
   - **Left**: a toolbar with path-highlight pills and **Copy as Mermaid**, then the SVG chart in
     a white card, then a legend row.
   - **Right**: a sticky detail panel with a kind chip, title, file path, p50/p95 tiles, "What
     runs", "Fails when", a dark code panel with the real snippet, and "Goes to" buttons.
4. **Lanes** inside the SVG: light rounded rects that group steps by where they run (`SYNC ·
   inside POST /x`, `ASYNC · worker`), labelled in 10px mono caps.
5. **Answer section**: a clay callout that answers the original question in 2–3 sentences, plus
   a small "where time goes" table with its data source.

## Build steps

1. Read the real code and config: entry point, each handler, retry policy, queue settings.
   Write the node list first (id, title, kind, file, p50/p95, runs, fails, code, next). That
   object becomes the Alpine data model.
2. Lay out the main path as one vertical spine (`x=320`, boxes 220×48, 36–48px gaps). Put
   failure exits in a left column and slow/human branches in a right column. Do not let edges
   cross the spine.
3. Shapes: rounded-pill terminals (`rx=22`), `rx=8` steps, diamonds for decisions (diamond
   text is a short question ending in "?"), rust-tinted failure exits, an oat human/slow step,
   and an olive-tinted success terminal.
4. Edge colors: olive for "yes/ok", dashed rust for error edges, clay for the slow path, gray
   for plain sequence. Label every edge leaving a decision.
5. Tag every node and edge with the paths it belongs to (`happy`, `slow`, `fail`) so the
   highlight pills can dim everything else.
6. Generate the Mermaid export from the same node list, so the chart and the export agree.

## Key snippet

```html
<g role="button" tabindex="0" aria-label="Call Stripe refund API" class="cursor-pointer"
   @click="pick('proc')" @focus="pick('proc')" :opacity="op('proc')">
  <rect x="210" y="560" width="220" height="48" rx="8" fill="#ffffff"
        :stroke="st('proc', '#d1cfc5')" :stroke-width="sw('proc')"/>
  <text x="320" y="580" text-anchor="middle" fill="#141413">Call Stripe refund API</text>
  <text x="320" y="596" text-anchor="middle" fill="#87867f" font-size="10">idempotent · 640 ms</text>
</g>
<g :opacity="eo('fail')">
  <path d="M264,680 L194,680" fill="none" stroke="#b04a3f" stroke-dasharray="4 4" marker-end="url(#ar-rust)"/>
  <text x="229" y="672" text-anchor="middle" fill="#b04a3f" font-size="10">retryable</text>
</g>
```

```js
function flow() { return {
  sel: 'start', mode: 'all', nodes: { /* id: { title, kind, groups, file, p50, p95, runs, fails, code, next } */ },
  get cur() { return this.nodes[this.sel]; },
  pick(k) { this.sel = k; },
  op(k) { return this.mode === 'all' || this.nodes[k].groups.includes(this.mode) ? 1 : 0.18; },
  eo(g) { return this.mode === 'all' || g.split(' ').includes(this.mode) ? 1 : 0.12; },
  st(k, base) { return this.sel === k ? '#d97757' : base; },
  sw(k) { return this.sel === k ? 2.5 : 1.5; },
}; }
```

## Interaction

- Bind SVG **attributes** (`:stroke`, `:opacity`), not classes, for selection and dimming.
  `<template x-for>` does not work inside `<svg>`, so write the nodes out by hand.
- `tabindex="0"` plus `@focus="pick(k)"` lets Tab walk the chart. The panel has
  `aria-live="polite"`.
- Fill the panel with `x-text` only, and keep code as plain strings in `<pre x-text>`. Do not
  use `innerHTML`.
- "Goes to" buttons call `pick(next.k)` so the reader can step through the flow from the panel.
- End with an export: **Copy as Mermaid** (or Copy JSON of the node list).

## Pitfalls

- A chart that is really a straight list. With no decisions, use a timeline or numbered steps.
- Unlabelled decision edges: the reader cannot tell which way is "yes".
- Edges entering a box from a side that makes them look like they come from a neighbor. Check
  the screenshot and reroute curves into a free face.
- Made-up timings. Pull p50/p95 from a dashboard or say "est." in the panel.
- Wide SVG on mobile: wrap it in `overflow-x-auto`, give it a `min-w-[520px]`, and put `min-w-0`
  on the grid children, or the whole page scrolls sideways.

## Combines well with

- [`incident-report.md`](incident-report.md): mark the step that failed in rust and link the
  timeline to it.
- [`module-map.md`](module-map.md): show the structure first, then use the flowchart for runtime.

## Checklist

- [ ] Every decision is a diamond with labelled outgoing edges.
- [ ] Every node opens a panel with file, timing, runs, fails, code, and next.
- [ ] The path highlights dim the rest, and the Mermaid export matches the drawn graph.
- [ ] The page answers the original question in words below the chart.
