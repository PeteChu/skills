# HTML Artifact Pattern Reference

This reference distills the patterns from `html-effectiveness/ARTICLE.md` and the companion standalone HTML examples. Use it when building a browser-readable artifact instead of a Markdown document.

## What the examples have in common

- **One file, minimal dependencies.** Every example is a complete `.html` document with Tailwind CSS (CDN), optional Alpine.js (CDN), and minimal custom CSS. No build step.
- **Warm editorial design.** Ivory background, white panels, dark slate text, muted gray borders, clay accent, olive positive state, rust danger state.
- **Readable structure.** Header with mono eyebrow, serif title, short lead/prompt. Sections are separated by whitespace, rules, cards, or panels.
- **Information density without walls of text.** Cards, grids, tables, SVG diagrams, chips, callouts, timelines, sidebars, and collapsible details carry information that Markdown would flatten.
- **Purpose-built interaction.** When interactive, the page solves a narrow loop: compare variants, click through a diagram, tune an animation, drag cards, edit flags, preview prompts, then copy/export the result.
- **Source awareness.** Technical artifacts include file paths, PR numbers, commands, owners, dates, line ranges, or source notes in mono metadata.

## Standard tokens

Custom colors registered in the `@theme` block of the Tailwind v4 Play CDN (see page shell) are the primary palette. Use Tailwind utility classes directly. Grays and slate use arbitrary values when exact match matters; built-in Tailwind grays (`gray-500`, `gray-700`) are close enough for body text.

| Old CSS variable      | Tailwind equivalent                                    |
| --------------------- | ------------------------------------------------------ |
| `--ivory: #faf9f5`    | `bg-ivory` / `text-ivory` / `border-ivory`             |
| `--slate: #141413`    | `text-[#141413]` / `bg-[#141413]`                      |
| `--clay: #d97757`     | `bg-clay` / `text-clay` / `border-clay`                |
| `--clay-d: #b85c3e`   | `bg-clay-dark` / `text-clay-dark` / `border-clay-dark` |
| `--oat: #e3dacc`      | `bg-oat` / `text-oat`                                  |
| `--olive: #788c5d`    | `bg-olive` / `text-olive` / `border-olive`             |
| `--rust: #b04a3f`     | `bg-rust` / `text-rust` / `border-rust`                |
| `--gray-150: #f0eee6` | `bg-[#f0eee6]`                                         |
| `--gray-300: #d1cfc5` | `border-gray-300` (close) or `border-[#d1cfc5]`        |
| `--gray-500: #87867f` | `text-[#87867f]`                                       |
| `--gray-700: #3d3d3a` | `text-[#3d3d3a]`                                       |
| `--serif`             | `font-serif`                                           |
| `--sans`              | `font-sans`                                            |
| `--mono`              | `font-mono`                                            |

## Page shell recipe

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Short, specific title</title>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <style type="text/tailwindcss">
      @theme {
        --color-clay: #d97757;
        --color-clay-dark: #b85c3e;
        --color-oat: #e3dacc;
        --color-olive: #788c5d;
        --color-rust: #b04a3f;
        --color-ivory: #faf9f5;
        --font-serif: ui-serif, Georgia, "Times New Roman", serif;
        --font-mono:
          ui-monospace, "SF Mono", Menlo, Monaco, Consolas, monospace;
      }
    </style>
    <style>
      * {
        box-sizing: border-box;
      }
      html {
        scroll-behavior: smooth;
      }
    </style>
  </head>
  <body
    class="bg-ivory text-[#3d3d3a] font-sans antialiased px-6 py-14 lg:px-6 lg:py-16"
  >
    <main class="mx-auto max-w-[1100px]">
      <header class="mb-11 max-w-[820px]">
        <p
          class="font-mono text-[11px] tracking-[0.08em] uppercase text-gray-500 mb-2.5"
        >
          Project · artifact type
        </p>
        <h1
          class="text-[#141413] font-serif font-medium text-[clamp(32px,5vw,44px)] leading-[1.12] tracking-tight m-0 mb-3.5"
        >
          What the reader should understand
        </h1>
        <p class="max-w-[720px] m-0">
          One short paragraph that orients the reader and explains why the
          artifact exists.
        </p>
      </header>
    </main>
  </body>
</html>
```

Add Alpine when needed: `<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3/dist/cdn.min.js"></script>` before `</head>`.

## Reusable components

### Prompt or source box

Use near the top when the artifact is generated from a request, investigation, or prompt.

```html
<div class="bg-[#f0eee6] border border-gray-300 rounded-xl p-4 text-sm">
  <span
    class="block mb-1.5 font-mono text-[11px] tracking-[0.06em] uppercase text-gray-500"
    >Prompt</span
  >
  Show me three different approaches and the tradeoffs for each.
</div>
```

### Chips / pills

Use for metadata, risk, categories, and compact properties.

```html
<div class="flex flex-wrap gap-2">
  <span
    class="inline-flex items-center gap-1.5 border border-gray-300 rounded-full bg-white px-2.5 py-1.5 font-mono text-[11.5px] text-[#3d3d3a]"
    >default</span
  >
  <span
    class="inline-flex items-center gap-1.5 border border-gray-300 rounded-full bg-white px-2.5 py-1.5 font-mono text-[11.5px] text-clay-dark bg-[rgba(217,119,87,0.12)] border-[rgba(217,119,87,0.55)]"
    >attention</span
  >
  <span
    class="inline-flex items-center gap-1.5 border border-gray-300 rounded-full bg-white px-2.5 py-1.5 font-mono text-[11.5px] text-olive bg-[rgba(120,140,93,0.12)] border-[rgba(120,140,93,0.45)]"
    >good</span
  >
</div>
```

### Section header with number

```html
<section class="mb-14">
  <div class="flex items-baseline gap-3 mb-2">
    <span class="font-mono text-xs bg-oat text-[#141413] px-2 py-0.5 rounded-lg"
      >02</span
    >
    <h2
      class="m-0 text-[25px] font-serif font-medium text-[#141413] tracking-tight"
    >
      Data flow
    </h2>
  </div>
  <p class="text-gray-500 max-w-[720px] m-0 mb-6">
    What this section is meant to clarify.
  </p>
</section>
```

### Code panel

Syntax highlighting token classes still need a small custom CSS block (pseudo-classes can't be replaced by Tailwind).

```html
<div class="bg-[#141413] rounded-xl p-4 overflow-x-auto">
  <pre
    class="m-0 text-[#e8e6de] font-mono text-[12.5px] leading-relaxed whitespace-pre"
  >
    <span class="kw">export function</span> <span class="fn">Example</span>() {
    <span class="kw">return</span> <span class="str">"escaped code"</span>;
  }</pre>
</div>
```

```css
.kw {
  color: #d97757;
}
.str {
  color: #788c5d;
}
.fn {
  color: #c9b98a;
}
.cm {
  color: #87867f;
}
```

### Diff rows

Uses CSS grid with custom backgrounds. Keep a small `<style>` block — the line-number and marker columns are hard to express purely with Tailwind.

```html
<div
  class="bg-[#141413] font-mono text-[12.5px] leading-relaxed overflow-x-auto"
>
  <div
    class="diff-row add"
    style="grid-template-columns:48px 18px 1fr; display:grid; align-items:baseline; white-space:pre; padding-right:14px;"
  >
    <span
      class="ln"
      style="text-align:right; padding-right:14px; color:#87867f; user-select:none;"
      >42</span
    >
    <span class="mark" style="text-align:center; color:#788c5d;">+</span>
    <span class="body" style="color:#e8e6dc;">
      const result = await api.call();</span
    >
  </div>
  <div
    class="diff-row del"
    style="grid-template-columns:48px 18px 1fr; display:grid; align-items:baseline; white-space:pre; padding-right:14px; background:rgba(176,74,63,0.15);"
  >
    <span
      class="ln"
      style="text-align:right; padding-right:14px; color:#87867f; user-select:none;"
      >43</span
    >
    <span class="mark" style="text-align:center; color:#b04a3f;">−</span>
    <span class="body" style="color:#e8e6dc;">
      const result = await oldApi.call();</span
    >
  </div>
</div>
```

```css
.diff {
  background: #141413;
  font-family: var(--mono);
  font-size: 12.5px;
  line-height: 1.7;
  overflow-x: auto;
}
.diff-row {
  display: grid;
  grid-template-columns: 48px 18px 1fr;
  align-items: baseline;
  white-space: pre;
  padding-right: 14px;
}
.diff-row .ln {
  text-align: right;
  padding-right: 14px;
  color: #87867f;
  user-select: none;
}
.diff-row .mark {
  text-align: center;
  color: #87867f;
}
.diff-row .body {
  color: #e8e6dc;
}
.diff-row.ctx .body {
  color: #b8b6ac;
}
.diff-row.add {
  background: rgba(120, 140, 93, 0.15);
}
.diff-row.add .mark {
  color: #788c5d;
}
.diff-row.del {
  background: rgba(176, 74, 63, 0.15);
}
.diff-row.del .mark {
  color: #b04a3f;
}
.diff-row.hunk {
  background: rgba(255, 255, 255, 0.04);
}
```

### Collapsible detail

Uses `::before` for the toggle arrow, which needs a small custom CSS block.

```html
<details
  class="file border border-gray-300 rounded-xl bg-white overflow-hidden"
  open
>
  <summary
    class="list-none cursor-pointer p-3.5 flex gap-3 items-center bg-[#f0eee6]"
  >
    <span class="flex-1 font-mono text-[13px] text-[#141413]"
      >apps/web/example.tsx</span
    >
    <span class="text-xs text-clay font-mono">worth a look</span>
  </summary>
  <div class="p-4">Explanation and snippets.</div>
</details>
```

```css
details.file summary {
  list-style: none;
  cursor: pointer;
}
details.file summary::-webkit-details-marker {
  display: none;
}
details.file summary::before {
  content: "▸";
  color: #d97757;
  transition: transform 120ms;
  margin-right: 4px;
}
details.file[open] summary::before {
  transform: rotate(90deg);
}
```

### Timeline

The vertical line and dot use `::before`/`::after` pseudo-elements, so a custom CSS block is needed.

```html
<div class="timeline" style="position:relative; padding-left:16px;">
  <div class="tl-entry" style="position:relative; padding:0 0 22px 28px;">
    <div
      class="tl-dot impact"
      style="position:absolute; left:-5px; top:6px; width:12px; height:12px; border-radius:50%; background:#d97757; border:2px solid #faf9f5; box-sizing:content-box;"
    ></div>
    <span
      class="tl-time"
      style="display:inline-block; font-family:ui-monospace,sans-serif; font-size:12px; color:#3d3d3a; background:#f0eee6; border:1px solid #d1cfc5; border-radius:6px; padding:2px 8px; margin-bottom:6px;"
      >Aug 14</span
    >
    <p class="m-0">Deployed fix to production.</p>
  </div>
</div>
```

```css
.timeline {
  position: relative;
  padding-left: 16px;
}
.timeline::before {
  content: "";
  position: absolute;
  left: 16px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: #d1cfc5;
}
.tl-entry {
  position: relative;
  padding: 0 0 22px 28px;
}
.tl-dot {
  position: absolute;
  left: -5px;
  top: 6px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #87867f;
  border: 2px solid #faf9f5;
  box-sizing: content-box;
}
.tl-dot.impact {
  background: #d97757;
}
.tl-dot.done {
  background: #788c5d;
}
```

### Copy button helper

Prefer Alpine for simple copy buttons:

```html
<button
  x-data="{ copied: false }"
  @click="await navigator.clipboard.writeText('text to copy'); copied = true"
  @click.outside="copied = false"
  class="font-mono text-xs text-clay hover:text-clay-dark"
>
  <span x-show="!copied">Copy</span>
  <span x-show="copied" class="text-olive">Copied ✓</span>
</button>
```

Fallback vanilla JS for complex cases:

```js
function copyText(text, button, resetLabel) {
  function flash() {
    var old = resetLabel || button.textContent;
    button.textContent = "Copied ✓";
    button.classList.add("copied");
    setTimeout(function () {
      button.textContent = old;
      button.classList.remove("copied");
    }, 1200);
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(flash, flash);
  } else {
    var ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
    } catch (e) {}
    document.body.removeChild(ta);
    flash();
  }
}
```

## Pattern recipes by task

### 1. Exploration / options grid

Best for implementation approaches, visual directions, naming options, architecture alternatives.

Structure:

1. Header + prompt box.
2. `.approaches` grid with 3–6 `.approach` cards.
3. Each card: number badge, short thesis, concrete example (code/mock/table), pros/cons, chips.
4. Recommendation aside at the end.

CSS clues (Tailwind classes in HTML):

```html
<div class="grid grid-cols-1 lg:grid-cols-3 gap-7">
  <div
    class="bg-white border border-gray-300 rounded-xl p-6 flex flex-col gap-4"
  >
    <!-- card content -->
  </div>
</div>
<div class="border-l-4 border-clay bg-white rounded-r-xl p-6 max-w-[860px]">
  <!-- recommendation -->
</div>
```

### 2. Implementation plan

Best for “make a plan/spec” tasks.

Recommended sections:

- Summary strip: scope, rollout, data model, risk.
- Milestones timeline.
- Data flow diagram as inline SVG.
- Mockups or interface sketches.
- Key code/schema snippets.
- Risks & mitigations table.
- Open questions.

### 3. Code review / PR write-up

Recommended sections:

- PR header with author/branch/stats.
- What this PR does.
- Risk map chips linking to file cards.
- File cards with diffs and review bubbles.
- Collapsed low-risk files.
- Suggested next steps checklist.

### 4. Code understanding / system explainer

Recommended sections:

- Header with repo/module and summary.
- SVG module/data-flow diagram.
- Walkthrough steps with numbered badges.
- Collapsible snippets.
- Sticky sidebar of key files, gotchas, and “if you change this…” notes.

### 5. Status / incident report

Recommended sections:

- Meta row of date/severity/status/owner.
- TL;DR panel.
- Stat cards.
- Timeline.
- Impact/root-cause/action-items.
- Tables/charts for exact changes and trend data.
- Sources footer.

### 6. Interactive explainer

Recommended sections:

- Intro + concept definition.
- Demo panel with inline SVG or visual model.
- Controls (range sliders/buttons) that manipulate the model.
- Readout that explains what changed.
- Comparison table and FAQ/glossary.

Implementation advice:

- Keep the math/data model in small functions.
- Re-render SVG with DOM/SVG APIs or safe static templates.
- Highlight glossary terms on hover/click if helpful.

### 7. Prototype / tuning UI

Recommended sections:

- Stage/artboard.
- Control panel for options, timing, easing, density, color, or copy.
- Timeline/keyframe visualization.
- Copy-paste implementation snippet.

Use Alpine to manage tunable values:

```html
<div
  x-data="{ ease: 'cubic-bezier(0.34, 1.56, 0.64, 1)', duration: 280 }"
  :style="`--ease: ${ease}; --duration: ${duration}ms`"
>
  <label class="font-mono text-xs text-gray-500">Duration</label>
  <input type="range" min="100" max="600" x-model="duration" class="w-full" />
</div>
```

Fallback to JS + CSS custom properties when Alpine does not apply:

```css
:root {
  --ease: cubic-bezier(0.34, 1.56, 0.64, 1);
  --duration: 280ms;
}
```

```js
document.documentElement.style.setProperty("--ease", selectedEase);
```

### 8. Custom editor

Recommended sections:

- Header explaining the specific editing task.
- Sticky toolbar with count/warnings/reset/export.
- Main board/form/editor generated from embedded data.
- Inline warnings for invalid states.
- Export function returns JSON/Markdown/diff/prompt.

Data pattern:

```js
var INITIAL = [
  { id: "BIR-241", title: "Fix sync conflict toast", tag: "bug", col: "now" },
];
var items = INITIAL.map(function (x) {
  return Object.assign({}, x);
});
```

Rendering pattern:

- Clear containers.
- Create elements with `document.createElement`.
- Set user/source text with `textContent`.
- Attach event listeners once per created control.
- Re-render after state changes.

## SVG guidance

- Use inline `<svg>` with `viewBox`; set `role="img"` and `aria-label` when it conveys information.
- Put labels directly in the SVG for flowcharts/charts; add a legend/caption below.
- Use marker definitions for arrows.
- Use the same palette tokens; explicit hex values inside SVG are acceptable when CSS variables are awkward.
- Make diagrams horizontally scrollable in a `.diagram`/`.canvas` wrapper when they need width.

## Self-contained checks

Before finishing, scan the HTML for accidental dependencies:

- The only CDN dependencies allowed are `cdn.jsdelivr.net/npm/@tailwindcss/browser@4` (Tailwind v4 Play CDN) and `cdn.jsdelivr.net/npm/alpinejs@3` (Alpine.js). No other `https://` or `http://` URL should be a CSS/JS/image/data dependency.
- No `<link rel="stylesheet">`, remote `<img>`, or remote `<script src>` except the two permitted above.
- No fetch/XHR/WebSocket unless explicitly requested.
- No references to local files that will not travel with the artifact.

## Filename guidance

Slugify from the artifact title or user task:

- lowercase
- replace non-alphanumeric runs with `-`
- trim leading/trailing `-`
- cap around 60 characters
- append `.html`

Examples:

- `review optimistic updates pr` → `review-optimistic-updates-pr.html`
- `comment threads implementation plan` → `comment-threads-implementation-plan.html`
- `cycle 14 ticket triage board` → `cycle-14-ticket-triage-board.html`
