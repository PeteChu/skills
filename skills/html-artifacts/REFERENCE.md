# HTML Artifact Pattern Reference

This reference distills the patterns from `html-effectiveness/ARTICLE.md` and the companion standalone HTML examples. Use it when building a browser-readable artifact instead of a Markdown document.

## What the examples have in common

- **One file, no dependencies.** Every example is a complete `.html` document with inline CSS and optional inline vanilla JS. No CDN, no external images, no build step.
- **Warm editorial design.** Ivory background, white panels, dark slate text, muted gray borders, clay accent, olive positive state, rust danger state.
- **Readable structure.** Header with mono eyebrow, serif title, short lead/prompt. Sections are separated by whitespace, rules, cards, or panels.
- **Information density without walls of text.** Cards, grids, tables, SVG diagrams, chips, callouts, timelines, sidebars, and collapsible details carry information that Markdown would flatten.
- **Purpose-built interaction.** When interactive, the page solves a narrow loop: compare variants, click through a diagram, tune an animation, drag cards, edit flags, preview prompts, then copy/export the result.
- **Source awareness.** Technical artifacts include file paths, PR numbers, commands, owners, dates, line ranges, or source notes in mono metadata.

## Standard tokens

Use these tokens as the default. Add a small number of task-specific tokens only when the content needs them.

```css
:root {
  --ivory: #faf9f5;
  --slate: #141413;
  --clay: #d97757;
  --clay-d: #b85c3e;
  --oat: #e3dacc;
  --olive: #788c5d;
  --rust: #b04a3f;
  --gray-150: #f0eee6;
  --gray-300: #d1cfc5;
  --gray-500: #87867f;
  --gray-700: #3d3d3a;
  --white: #ffffff;

  --serif: ui-serif, Georgia, "Times New Roman", Times, serif;
  --sans:
    system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --mono: ui-monospace, "SF Mono", Menlo, Monaco, Consolas, monospace;
}
```

Typical aliases seen in editor/prototype examples:

```css
--gray-50: #f0eee6;
--gray-200: #d1cfc5;
--gray-800: #3d3d3a;
```

## Page shell recipe

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Short, specific title</title>
    <style>
      :root {
        /* tokens */
      }
      * {
        box-sizing: border-box;
      }
      html {
        scroll-behavior: smooth;
      }
      body {
        margin: 0;
        padding: 56px 24px 96px;
        background: var(--ivory);
        color: var(--gray-700);
        font-family: var(--sans);
        font-size: 15px;
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
      }
      .page {
        max-width: 1100px;
        margin: 0 auto;
      }
      header.page-head {
        margin-bottom: 44px;
        max-width: 820px;
      }
      .eyebrow {
        font-family: var(--mono);
        font-size: 11px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--gray-500);
        margin-bottom: 10px;
      }
      h1,
      h2,
      h3 {
        font-family: var(--serif);
        color: var(--slate);
        font-weight: 500;
      }
      h1 {
        font-size: clamp(32px, 5vw, 44px);
        line-height: 1.12;
        letter-spacing: -0.015em;
        margin: 0 0 14px;
      }
      .lead {
        max-width: 720px;
        margin: 0;
      }
      .panel {
        background: var(--white);
        border: 1.5px solid var(--gray-300);
        border-radius: 12px;
      }
      code,
      pre {
        font-family: var(--mono);
      }
      @media (max-width: 820px) {
        body {
          padding: 36px 18px 72px;
        }
      }
    </style>
  </head>
  <body>
    <main class="page">
      <header class="page-head">
        <div class="eyebrow">Project · artifact type</div>
        <h1>What the reader should understand</h1>
        <p class="lead">
          One short paragraph that orients the reader and explains why the
          artifact exists.
        </p>
      </header>
    </main>
  </body>
</html>
```

## Reusable components

### Prompt or source box

Use near the top when the artifact is generated from a request, investigation, or prompt.

```html
<div class="prompt-box">
  <span class="label">Prompt</span>
  Show me three different approaches and the tradeoffs for each.
</div>
```

```css
.prompt-box {
  background: var(--gray-150);
  border: 1.5px solid var(--gray-300);
  border-radius: 12px;
  padding: 16px 20px;
  font-size: 14px;
}
.prompt-box .label {
  display: block;
  margin-bottom: 6px;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--gray-500);
}
```

### Chips / pills

Use for metadata, risk, categories, and compact properties.

```css
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border: 1.5px solid var(--gray-300);
  border-radius: 999px;
  background: var(--white);
  padding: 6px 11px;
  font-family: var(--mono);
  font-size: 11.5px;
  color: var(--gray-700);
}
.chip.attention {
  background: rgba(217, 119, 87, 0.12);
  border-color: rgba(217, 119, 87, 0.55);
  color: var(--clay-d);
}
.chip.good {
  background: rgba(120, 140, 93, 0.12);
  border-color: rgba(120, 140, 93, 0.45);
  color: var(--olive);
}
```

### Section header with number

```html
<div class="sec-head">
  <span class="num">02</span>
  <h2>Data flow</h2>
</div>
<p class="sec-intro">What this section is meant to clarify.</p>
```

```css
section {
  margin-bottom: 60px;
}
.sec-head {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 8px;
}
.sec-head .num {
  font-family: var(--mono);
  font-size: 12px;
  background: var(--oat);
  color: var(--slate);
  padding: 3px 9px;
  border-radius: 8px;
}
.sec-head h2 {
  margin: 0;
  font-size: 25px;
  letter-spacing: -0.01em;
}
.sec-intro {
  color: var(--gray-500);
  max-width: 720px;
  margin: 0 0 24px;
}
```

### Code panel

```html
<div class="code">
  <pre><span class="kw">export function</span> <span class="fn">Example</span>() {
  <span class="kw">return</span> <span class="str">"escaped code"</span>;
}</pre>
</div>
```

```css
.code {
  background: var(--slate);
  border-radius: 12px;
  padding: 18px 20px;
  overflow-x: auto;
}
.code pre {
  margin: 0;
  color: #e8e6de;
  font-family: var(--mono);
  font-size: 12.5px;
  line-height: 1.65;
  white-space: pre;
}
.code .kw {
  color: var(--clay);
}
.code .str {
  color: var(--olive);
}
.code .cm {
  color: var(--gray-500);
}
.code .fn {
  color: #c9b98a;
}
```

### Diff rows

Use grid rows for line number, marker, code. Tint additions/removals subtly.

```css
.diff {
  background: var(--slate);
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
  color: var(--gray-500);
  user-select: none;
}
.diff-row .mark {
  text-align: center;
  color: var(--gray-500);
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
  color: var(--olive);
}
.diff-row.del {
  background: rgba(176, 74, 63, 0.15);
}
.diff-row.del .mark {
  color: var(--rust);
}
.diff-row.hunk {
  background: rgba(255, 255, 255, 0.04);
}
```

### Collapsible detail

```html
<details class="file" open>
  <summary>
    <span class="path">apps/web/example.tsx</span
    ><span class="badge">worth a look</span>
  </summary>
  <div class="body">Explanation and snippets.</div>
</details>
```

```css
details.file {
  border: 1.5px solid var(--gray-300);
  border-radius: 12px;
  background: var(--white);
  overflow: hidden;
}
details.file summary {
  list-style: none;
  cursor: pointer;
  padding: 14px 18px;
  display: flex;
  gap: 12px;
  align-items: center;
  background: var(--gray-150);
}
details.file summary::-webkit-details-marker {
  display: none;
}
details.file summary::before {
  content: "▸";
  color: var(--clay);
  transition: transform 120ms;
}
details.file[open] summary::before {
  transform: rotate(90deg);
}
details.file .path {
  flex: 1;
  font-family: var(--mono);
  font-size: 13px;
  color: var(--slate);
}
details.file .body {
  padding: 16px 18px 18px;
}
```

### Timeline

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
  background: var(--gray-300);
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
  background: var(--gray-500);
  border: 2px solid var(--ivory);
  box-sizing: content-box;
}
.tl-dot.impact {
  background: var(--clay);
}
.tl-dot.done {
  background: var(--olive);
}
.tl-time {
  display: inline-block;
  font-family: var(--mono);
  font-size: 12px;
  color: var(--gray-700);
  background: var(--gray-150);
  border: 1px solid var(--gray-300);
  border-radius: 6px;
  padding: 2px 8px;
  margin-bottom: 6px;
}
```

### Copy button helper

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

CSS clues:

```css
.approaches {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 28px;
}
@media (max-width: 1100px) {
  .approaches {
    grid-template-columns: 1fr;
  }
}
.approach {
  background: var(--white);
  border: 1.5px solid var(--gray-300);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.reco {
  border-left: 4px solid var(--clay);
  background: var(--white);
  border-radius: 0 12px 12px 0;
  padding: 24px 28px;
  max-width: 860px;
}
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

Use CSS variables for tunable values:

```css
:root {
  --ease: cubic-bezier(0.34, 1.56, 0.64, 1);
  --duration: 280ms;
}
```

Then update with JS:

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

- Any `https://` or `http://` occurrence should be an informational hyperlink only, never a CSS/JS/image/data source required for rendering.
- No `//cdn`, `<link rel="stylesheet">`, remote `<img>`, or remote `<script src>`.
- No Tailwind/Bootstrap/import maps/frameworks.
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
