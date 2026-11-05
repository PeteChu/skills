# Foundations — shared shell, tokens, and components

Every pattern in `references/` builds on this file. Read it once per artifact, then read the
pattern file(s) chosen from the mapper in `SKILL.md`.

## What every good artifact has in common

- **One file, minimal dependencies.** A complete `.html` document with Tailwind CSS (Play CDN),
  optional Alpine.js (CDN), and a small `<style>` block only for what utilities cannot express
  (pseudo-elements, syntax tokens, keyframes). No build step.
- **Warm editorial design.** Ivory page, white panels, slate text, muted gray borders, clay accent,
  olive for good/positive, rust for danger.
- **Obvious hierarchy.** Mono eyebrow → serif title → short lead or prompt box → sections →
  details. The first screen says what the artifact is and why it exists.
- **Density without walls of text.** Cards, grids, tables, inline SVG, chips, callouts, timelines,
  sidebars, and `<details>` carry information Markdown would flatten.
- **Purpose-built interaction.** When interactive, the page serves one narrow loop (compare, tune,
  click through, sort, toggle) and ends with a way to get the result back out (copy/export).
- **Beautiful on paper too.** Readers print artifacts or Save as PDF to attach them to tickets,
  emails, and reviews. The shell's print layer keeps the design intact on paper (see
  [Print and Save as PDF](#print-and-save-as-pdf)).
- **Source awareness.** File paths, PR numbers, commands, owners, dates, and line ranges appear in
  mono metadata so the reader can verify claims.

## Tokens

Custom colors are registered in the `@theme` block of the page shell. Use utilities directly.

| Token      | Hex       | Tailwind                                   | Use                              |
| ---------- | --------- | ------------------------------------------ | -------------------------------- |
| ivory      | `#faf9f5` | `bg-ivory`                                 | Page background                  |
| slate      | `#141413` | `text-[#141413]` / `bg-[#141413]`          | Headings, dark code panels       |
| clay       | `#d97757` | `text-clay` / `bg-clay` / `border-clay`    | Accent, attention, primary action |
| clay-dark  | `#b85c3e` | `text-clay-dark`                           | Accent text on light tints       |
| oat        | `#e3dacc` | `bg-oat`                                   | Number badges, warm fills        |
| olive      | `#788c5d` | `text-olive` / `bg-olive`                  | Good, done, safe, pro            |
| rust       | `#b04a3f` | `text-rust` / `bg-rust`                    | Danger, failure, needs attention |
| gray-150   | `#f0eee6` | `bg-[#f0eee6]`                             | Soft panels, table heads         |
| gray-300   | `#d1cfc5` | `border-[#d1cfc5]` (or `border-gray-300`)  | Borders, rules                   |
| gray-500   | `#87867f` | `text-[#87867f]`                           | Muted text, eyebrows, captions   |
| gray-700   | `#3d3d3a` | `text-[#3d3d3a]`                           | Body text                        |

Tints for status chips and rows: `bg-[rgba(217,119,87,0.12)]` (clay), `bg-[rgba(120,140,93,0.12)]`
(olive), `bg-[rgba(176,74,63,0.10)]` (rust). Pair each with a border at ~0.45 alpha.

Fonts: `font-serif` for titles, `font-sans` for body, `font-mono` for metadata, code, chips, and
numbers.

## Page shell

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Short, specific title</title>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <!-- Only when the page is interactive: -->
    <!-- <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3/dist/cdn.min.js"></script> -->
    <style type="text/tailwindcss">
      @theme {
        --color-clay: #d97757;
        --color-clay-dark: #b85c3e;
        --color-oat: #e3dacc;
        --color-olive: #788c5d;
        --color-rust: #b04a3f;
        --color-ivory: #faf9f5;
        --font-serif: ui-serif, Georgia, "Times New Roman", serif;
        --font-mono: ui-monospace, "SF Mono", Menlo, Monaco, Consolas, monospace;
      }
      /* Print lays out at ~680px; let md: layouts apply on paper too */
      @custom-variant md (@media print, (width >= 48rem));
    </style>
    <style>
      * { box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      [x-cloak] { display: none !important; }
      /* ── Print / Save as PDF ─────────────────────────────────────────── */
      @page {
        margin: 16mm 15mm 18mm;
        @bottom-left  { content: "Short artifact title"; font: 8pt ui-monospace, Menlo, monospace; color: #87867f; }
        @bottom-right { content: counter(page) " / " counter(pages); font: 8pt ui-monospace, Menlo, monospace; color: #87867f; }
      }
      @media print {
        * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        html { scroll-behavior: auto; }
        body { background: #fff !important; padding: 0 !important; font-size: 10.5pt; }
        main { max-width: none !important; }
        /* Screen chrome never prints */
        .fixed { display: none !important; }
        button:is([\@click*="copy" i], [\@click*="clipboard"], [\@click*="reset" i], [\@click*="restart"]) { display: none !important; }
        .sticky { position: static !important; }
        .shadow, .shadow-sm, .shadow-md, .shadow-lg, .shadow-xl { box-shadow: none !important; }
        .backdrop-blur { backdrop-filter: none !important; }
        /* Nothing is clipped: scrollers expand, code wraps, wide SVG scales to the page */
        .overflow-x-auto, .overflow-auto, .overflow-y-auto { overflow: visible !important; max-height: none !important; }
        pre, .diff .row { white-space: pre-wrap !important; overflow-wrap: anywhere; }
        svg { max-width: 100% !important; min-width: 0 !important; height: auto; }
        /* Page breaks: keep headings with their content, keep small blocks whole */
        h1, h2, h3, h4, :is(div, header):has(> h2, > h3), :is(div, header):has(> h2, > h3) + p { break-after: avoid; break-inside: avoid; }
        p, li { orphans: 3; widows: 3; }
        tr, li, figure, aside, blockquote, details, img, svg, .tl-item,
        .rounded-xl:not(:has(table, pre, .diff, section)), .rounded-lg:not(:has(table, pre, .diff)) { break-inside: avoid; }
        thead { display: table-header-group; }
        /* External links show where they go */
        a[href^="http"]::after { content: " (" attr(href) ")"; font-size: .8em; color: #87867f; overflow-wrap: anywhere; }
      }
    </style>
  </head>
  <body class="bg-ivory text-[#3d3d3a] font-sans antialiased leading-relaxed px-6 py-14 lg:py-16">
    <main class="mx-auto max-w-[1100px]">
      <header class="mb-11 max-w-[820px]">
        <p class="font-mono text-[11px] tracking-[0.08em] uppercase text-[#87867f] mb-2.5">
          Project · artifact type
        </p>
        <h1 class="text-[#141413] font-serif font-medium text-[clamp(32px,5vw,44px)] leading-[1.12] tracking-tight m-0 mb-3.5">
          What the reader should understand
        </h1>
        <p class="max-w-[720px] m-0">One short paragraph that orients the reader.</p>
      </header>
    </main>
    <script>
      // Print with every <details> open, then restore what the reader had.
      addEventListener('beforeprint', () => document.querySelectorAll('details:not([open])').forEach(d => { d.dataset.printOpened = ''; d.open = true; }));
      addEventListener('afterprint', () => document.querySelectorAll('details[data-print-opened]').forEach(d => { d.open = false; delete d.dataset.printOpened; }));
    </script>
  </body>
</html>
```

Widen `max-w-[1100px]` to `max-w-[1360px]` for side-by-side grids (comparisons, variant sheets).

Copy the shell verbatim, including the `@custom-variant` line, the print block, and the
`beforeprint` script. Replace `"Short artifact title"` in `@page` with the page's short title
(it prints in the footer of every page, beside the page number).

## Shared components

### Prompt or source box

Put this near the top when the artifact answers a request. It lets a reader who never saw the
chat know what was asked.

```html
<div class="bg-[#f0eee6] border border-[#d1cfc5] rounded-xl px-5 py-4 text-[14.5px]">
  <span class="block mb-1.5 font-mono text-[11px] tracking-[0.06em] uppercase text-[#87867f]">Prompt</span>
  Show me three different approaches and the tradeoffs for each.
</div>
```

### Chips

```html
<span class="inline-flex items-center gap-1.5 border border-[#d1cfc5] rounded-full bg-white px-2.5 py-1 font-mono text-[11.5px]">default</span>
<span class="inline-flex items-center gap-1.5 border border-[rgba(217,119,87,0.55)] rounded-full bg-[rgba(217,119,87,0.12)] px-2.5 py-1 font-mono text-[11.5px] text-clay-dark">attention</span>
<span class="inline-flex items-center gap-1.5 border border-[rgba(120,140,93,0.45)] rounded-full bg-[rgba(120,140,93,0.12)] px-2.5 py-1 font-mono text-[11.5px] text-olive">good</span>
<span class="inline-flex items-center gap-1.5 border border-[rgba(176,74,63,0.45)] rounded-full bg-[rgba(176,74,63,0.10)] px-2.5 py-1 font-mono text-[11.5px] text-rust">danger</span>
```

Use the key/value form for properties: `Bundle: <strong class="text-[#141413]">+0.2 kb</strong>`.

### Numbered section header

```html
<section class="mb-14 scroll-mt-6" id="data-flow">
  <div class="flex items-baseline gap-3 mb-2">
    <span class="font-mono text-xs bg-oat text-[#141413] px-2 py-0.5 rounded-lg">02</span>
    <h2 class="m-0 text-[25px] font-serif font-medium text-[#141413] tracking-tight">Data flow</h2>
  </div>
  <p class="text-[#87867f] max-w-[720px] m-0 mb-6">What this section clarifies.</p>
</section>
```

### Stat cards

```html
<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
  <div class="bg-white border border-[#d1cfc5] rounded-xl p-5">
    <p class="font-mono text-[11px] uppercase tracking-[0.06em] text-[#87867f] m-0">p95 latency</p>
    <p class="font-serif text-[34px] leading-none text-[#141413] mt-2 mb-1">212<span class="text-base text-[#87867f]"> ms</span></p>
    <p class="font-mono text-xs text-olive m-0">▼ 38 ms vs last week</p>
  </div>
</div>
```

### Callout

```html
<aside class="border-l-4 border-clay bg-white rounded-r-xl px-6 py-5">
  <p class="font-mono text-[11px] uppercase tracking-[0.06em] text-clay-dark m-0 mb-1">Gotcha</p>
  <p class="m-0">The cache key includes the tenant id — clearing it for one tenant never touches another.</p>
</aside>
```

Use `border-olive` for "start here" and `border-rust` for hard warnings.

### TL;DR panel

```html
<div class="bg-white border border-[#d1cfc5] rounded-xl p-6 grid md:grid-cols-[120px_1fr] gap-4">
  <p class="font-mono text-[11px] uppercase tracking-[0.08em] text-clay-dark m-0">TL;DR</p>
  <ul class="m-0 pl-4 space-y-1.5"><li>…</li></ul>
</div>
```

### Code panel

Syntax token colors need a few custom classes.

```html
<div class="bg-[#141413] rounded-xl px-5 py-4 overflow-x-auto">
  <pre class="m-0 text-[#e8e6de] font-mono text-[12.5px] leading-relaxed"><span class="kw">export function</span> <span class="fn">Example</span>() {
  <span class="kw">return</span> <span class="str">"escaped &lt;code&gt;"</span>;
}</pre>
</div>
```

```css
.kw { color: #d97757; }   /* keywords */
.str { color: #a3b37f; }  /* strings / numbers */
.fn { color: #c9b98a; }   /* identifiers */
.cm { color: #87867f; }   /* comments */
```

Escape every `<`, `>`, and `&` in code. Keep the `<pre>` content flush-left — leading whitespace
inside `<pre>` renders.

### Diff rows

```html
<div class="diff bg-[#141413] font-mono text-[12.5px] leading-[1.7] overflow-x-auto">
  <div class="row hunk"><span class="ln"></span><span class="mk"></span><span class="bd">@@ -40,6 +40,7 @@ export async function save()</span></div>
  <div class="row ctx"><span class="ln">41</span><span class="mk"> </span><span class="bd">  const draft = getDraft();</span></div>
  <div class="row del"><span class="ln">42</span><span class="mk">−</span><span class="bd">  await oldApi.put(draft);</span></div>
  <div class="row add"><span class="ln">42</span><span class="mk">+</span><span class="bd">  await api.put(draft, { retry: 2 });</span></div>
</div>
```

```css
.diff .row { display: grid; grid-template-columns: 48px 18px 1fr; white-space: pre; padding-right: 14px; }
.diff .ln { text-align: right; padding-right: 14px; color: #87867f; user-select: none; }
.diff .mk { text-align: center; color: #87867f; }
.diff .bd { color: #e8e6dc; }
.diff .ctx .bd { color: #b8b6ac; }
.diff .add { background: rgba(120,140,93,.18); } .diff .add .mk { color: #a3b37f; }
.diff .del { background: rgba(176,74,63,.18); }  .diff .del .mk { color: #e08a7f; }
.diff .hunk { background: rgba(255,255,255,.05); } .diff .hunk .bd { color: #87867f; }
```

### Collapsible detail

```html
<details class="fold border border-[#d1cfc5] rounded-xl bg-white overflow-hidden" open>
  <summary class="cursor-pointer px-4 py-3 flex gap-3 items-center bg-[#f0eee6]">
    <span class="flex-1 font-mono text-[13px] text-[#141413]">apps/web/example.tsx</span>
    <span class="font-mono text-xs text-clay-dark">worth a look</span>
  </summary>
  <div class="p-4">Explanation and snippets.</div>
</details>
```

```css
details.fold > summary { list-style: none; }
details.fold > summary::-webkit-details-marker { display: none; }
details.fold > summary::before { content: "▸"; color: #d97757; transition: transform 120ms; }
details.fold[open] > summary::before { transform: rotate(90deg); }
```

### Vertical timeline

```html
<ol class="tl relative list-none m-0 pl-0">
  <li class="tl-item relative pl-8 pb-6">
    <span class="tl-dot impact"></span>
    <span class="font-mono text-xs bg-[#f0eee6] border border-[#d1cfc5] rounded-md px-2 py-0.5">14:02</span>
    <p class="mt-1.5 mb-0">Error rate crosses 5%; pager fires.</p>
  </li>
</ol>
```

```css
.tl::before { content: ""; position: absolute; left: 5px; top: 8px; bottom: 8px; width: 2px; background: #d1cfc5; }
.tl-dot { position: absolute; left: 0; top: 6px; width: 12px; height: 12px; border-radius: 50%; background: #87867f; outline: 3px solid #faf9f5; }
.tl-dot.impact { background: #d97757; } .tl-dot.done { background: #788c5d; } .tl-dot.bad { background: #b04a3f; }
```

### Tabs (Alpine)

```html
<div x-data="{ tab: 'yaml' }">
  <div role="tablist" class="flex gap-1 border-b border-[#d1cfc5]">
    <template x-for="t in ['yaml','env','ts']">
      <button role="tab" @click="tab = t" :aria-selected="tab === t"
        :class="tab === t ? 'border-clay text-[#141413]' : 'border-transparent text-[#87867f]'"
        class="font-mono text-xs px-3 py-2 border-b-2 -mb-px hover:text-[#141413]" x-text="t"></button>
    </template>
  </div>
  <div x-show="tab === 'yaml'" class="pt-3">…</div>
  <div x-show="tab === 'env'" x-cloak class="pt-3">…</div>
  <div x-show="tab === 'ts'" x-cloak class="pt-3">…</div>
</div>
```

### Copy button

```html
<button x-data="{ copied: false }"
  @click="navigator.clipboard.writeText($refs.out.textContent).then(() => { copied = true; setTimeout(() => copied = false, 1400) })"
  class="font-mono text-xs border border-[#d1cfc5] bg-white rounded-lg px-3 py-1.5 hover:border-[#141413] focus-visible:outline-2 focus-visible:outline-clay">
  <span x-show="!copied">Copy</span><span x-show="copied" x-cloak class="text-olive">Copied ✓</span>
</button>
<pre x-ref="out" class="hidden">text to copy</pre>
```

### Reply assembler

Used by patterns that end in "pick what resonates, paste it back" (visual directions, brainstorm,
interview, blindspot pass). Selections update a live textarea the user copies back to the agent.

```html
<div x-data="{ picks: [], get reply() { return this.picks.length
    ? 'Go with: ' + this.picks.join(', ') + '.'
    : 'Nothing selected yet.' } }">
  <label class="flex gap-2 items-center"><input type="checkbox" value="B — editorial" x-model="picks" class="accent-clay"> B — editorial</label>
  <div class="sticky bottom-4 mt-8 bg-white border border-[#141413] rounded-xl p-4 shadow-lg">
    <p class="font-mono text-[11px] uppercase tracking-[0.06em] text-[#87867f] m-0 mb-2">Your reply</p>
    <textarea readonly x-text="reply" class="w-full font-mono text-[13px] bg-[#f0eee6] rounded-lg p-3 h-20"></textarea>
  </div>
</div>
```

### Sticky toolbar

```html
<div class="sticky top-0 z-10 -mx-6 px-6 py-3 bg-ivory/90 backdrop-blur border-b border-[#d1cfc5] flex flex-wrap gap-3 items-center">
  <span class="font-mono text-xs">12 changed</span>
  <span class="font-mono text-xs text-rust">2 warnings</span>
  <span class="flex-1"></span>
  <button class="…">Reset</button>
  <button class="bg-[#141413] text-ivory font-mono text-xs rounded-lg px-3 py-1.5">Copy JSON</button>
</div>
```

### Data table

```html
<div class="overflow-x-auto border border-[#d1cfc5] rounded-xl bg-white">
  <table class="w-full text-sm border-collapse">
    <thead class="bg-[#f0eee6] text-left font-mono text-[11px] uppercase tracking-[0.05em] text-[#87867f]">
      <tr><th class="px-4 py-2.5 font-medium">Risk</th><th class="px-4 py-2.5 font-medium">Mitigation</th></tr>
    </thead>
    <tbody class="divide-y divide-[#f0eee6]">
      <tr><td class="px-4 py-3 align-top">…</td><td class="px-4 py-3 align-top">…</td></tr>
    </tbody>
  </table>
</div>
```

## SVG guidance

- Inline `<svg>` with a `viewBox`; add `role="img"` and an `aria-label` when it carries meaning.
- Label directly on the diagram; add a legend or caption below it.
- Define arrowheads once in `<defs><marker>`; reuse via `marker-end="url(#arrow)"`.
- Use palette hex values directly in SVG attributes. Text: `font-family="ui-monospace, monospace"`
  for labels, `ui-serif, Georgia, serif` for titles.
- Wrap wide diagrams in `<div class="overflow-x-auto">` and give the SVG a `min-w-[720px]`.
- Highlight the important path (hot path, failing step, recommended route) with clay; keep the
  rest gray.

## Interaction rules

- Interaction only when it helps the reader inspect, compare, tune, or export. Static stays static.
- Native first: anchors, sticky sidebars, `<details>`, range inputs, checkboxes, `<dialog>`.
- Alpine for state (`x-data`, `x-model`, `x-show`, `x-for`, `:class`). Keep the data model in one
  `x-data` object near the top of the component, or in a `<script>` that defines a function used
  by `x-data="board()"`.
- Fall back to small vanilla JS for SVG manipulation, drag-and-drop, or keyboard navigation. Use
  `textContent` and `createElement`, never `innerHTML` with source text.
- Real `<button>` elements with visible hover and `focus-visible` states.
- Every editor ends in an export: Copy JSON / Copy diff / Copy Markdown / Copy prompt.

## Print and Save as PDF

Every artifact must look deliberate when the reader presses ⌘P / Ctrl+P and saves a PDF. Without
help, the browser drops every background (dark code panels become pale text on white), prints
buttons and fixed counters on every page, clips wide diagrams and code, collapses `md:` grids
(the printable width is only ~680 CSS px), and splits cards across pages. The shell's print
block fixes all of that. What it does:

- **Keeps the design.** `print-color-adjust: exact` prints panel fills, chips, code panels, and
  callouts even when the dialog's "Background graphics" box is unticked. The page itself turns
  white so no ivory band stops at the paper margin.
- **Paginates like a document.** `@page` sets margins and puts the title and `page / pages` in
  the footer. Chrome 131+ renders these margin boxes; Chrome still adds its own
  date/URL header and footer when there is room, so tell readers to untick "Headers and footers"
  in the print dialog for a clean PDF.
- **Hides screen chrome.** `.fixed` elements, copy/reset/restart buttons, shadows, and blur
  disappear; sticky toolbars become static.
- **Never clips.** Scrollers expand, `<pre>` and diff rows wrap, and wide SVG scales to the page
  width.
- **Breaks well.** Headings try to stay with the lead under them; cards, callouts, figures, table rows,
  list items, and `<details>` don't split. Panels holding a table, code, or a diff may break,
  and table heads repeat on each page.
- **Shows everything.** The `beforeprint` script opens every `<details>` and restores them after.
- **Keeps layouts.** The `@custom-variant md` line makes every `md:` grid apply on paper, so
  stat bands, two-column cards, and side-by-side comparisons stay side by side.

Your part, per artifact:

- Add `print:hidden` to controls the generic rules don't catch: filter bars, theme toggles,
  "Expand all", step-through buttons, sidebar tables of contents. Keep anything that carries
  content (chips, legends, the reply text a picker produced).
- Content hidden by Alpine state (`x-show` accordions, tab panels, step-through slides) prints
  only in its current state. When every panel matters on paper, add `print:block!` to each panel
  (the trailing `!` beats Alpine's inline `display: none`) and give each a visible label.
- Use `print:break-before-page` to start a major part on a fresh page, and
  `print:break-inside-auto` on a tall card (more than half a page) that may split, so it doesn't
  leave a gap.
- Badges hung outside a card (`absolute -top-3`) can land on the previous page when the card moves
  down. Add `print:top-2` to pull them inside.
- `lg:` layouts (sidebars, three-up grids) still collapse on paper. That's usually right; add
  `print:grid-cols-N` only where columns are the point.
- Landscape artifacts (decks, wide boards) override `@page` — see
  [`slide-deck.md`](slide-deck.md#print--save-as-pdf).

Check before you hand off: open the print preview (or render a PDF headlessly) and look at every
page. No near-empty pages, no orphaned headings, no clipped code, no buttons.

## Tailwind gotchas

- Grid or flex children that contain wide tables, code, or SVG need `min-w-0`. Without it, the
  child refuses to shrink and the whole page scrolls sideways on mobile.
- `m-0` on children inside `space-y-*` cancels the gap, because both set margin. Drop the `m-0`
  or use `flex flex-col gap-*` instead.
- Preflight strips list bullets and heading sizes. Add `list-disc pl-5` to `<ul>` (and
  `list-decimal` to `<ol>`) when you want markers.
- For Alpine active states, put **both** colors in the `:class` ternary
  (`:class="on ? 'border-clay' : 'border-[#d1cfc5]'"`). Don't put a static `border-[#d1cfc5]` in
  `class` and add `border-clay` on top: two utilities for the same property are resolved by
  stylesheet order, not by which was added last. Bind `:style` if you must override a static
  class.
- Tailwind v4's bare `border` uses `currentColor`. Always pair it with an explicit border color.
- Tailwind's Play CDN generates classes at runtime. Classes built by string concatenation
  (`'text-' + color`) never exist. Write full class names in `:class` maps.

## Self-contained checks

- Only `cdn.jsdelivr.net/npm/@tailwindcss/browser@4` and `cdn.jsdelivr.net/npm/alpinejs@3` may
  appear in `<script src>`. No `<link rel="stylesheet">`, remote `<img>`, web fonts, or other JS.
- No fetch/XHR/WebSocket unless the user explicitly asks.
- No references to local files that will not travel with the artifact.
- All sample data is fictional or comes from the user's own sources; label assumptions.

## Filename

Slugify the title or task: lowercase, non-alphanumeric runs → `-`, trim, cap ~60 chars, `.html`.
`review optimistic updates pr` → `review-optimistic-updates-pr.html`.
