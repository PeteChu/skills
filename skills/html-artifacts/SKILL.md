---
name: html-artifacts
description: >-
  Generate polished, self-contained HTML artifacts instead of Markdown. Use whenever the user asks for a substantial report, plan, spec, code review, PR write-up, code explainer, research summary, status or incident report, design exploration, prototype, diagram, slide deck, comparison, or one-off editing UI that should be easy to read, share, or interact with in a browser. Prefer this skill for rich deliverables even if the user says “doc”, “report”, “summary”, “plan”, “show me options”, or “write this up” and does not explicitly say HTML.
---

# html-artifacts

Create a single, self-contained `.html` file as the final artifact. The article/examples this skill is based on show that HTML beats Markdown for dense technical work because it can combine prose, tables, inline SVG diagrams, code snippets, visual hierarchy, and small interactions in one browser-readable file.

Do not respond with a long Markdown document when the user needs a substantial artifact. Build an HTML page, save it with the `write` tool, and report the path.

## Workflow

1. **Identify the artifact’s job.** Decide what the user needs to do with the file: compare options, review code, understand a system, present status, tune values, edit structured data, or hand off an implementation plan.
2. **Gather enough context.** Read relevant files, diffs, data, notes, or conversation context before designing. If key facts are missing, make light assumptions and mark them; ask only when ambiguity would change the structure.
3. **Choose a pattern** from the artifact patterns below. Combine patterns when useful, but keep one clear information architecture.
4. **Generate one complete HTML file** with inline CSS and, only when useful, vanilla inline JavaScript. No build step. No Markdown wrapper.
5. **Save the file.** Use the user’s requested path if provided. Otherwise slugify the task into `html-artifacts/<slug>.html` when an `html-artifacts/` directory exists; otherwise save `<slug>.html` in the current directory.
6. **Reply briefly** with the saved path and a one-sentence note about what the page contains.

## Hard requirements

- Produce complete HTML: `<!doctype html>`, `<html lang="en">`, `<head>`, viewport meta, `<title>`, inline `<style>`, and `<body>`.
- Keep the artifact self-contained: no CDN, no external fonts, no external CSS/JS, no remote images, no framework dependencies. Use inline SVG instead of linked images when possible.
- Use semantic HTML (`header`, `main`, `section`, `article`, `aside`, `nav`, `footer`) and native controls (`details`, `summary`, `button`, `input`, `textarea`) before inventing custom widgets.
- Escape user/source content correctly in HTML: especially code snippets, diffs, JSON, logs, and user-provided text. Use `&lt;`, `&gt;`, `&amp;` inside markup and code examples.
- For interactive pages, use small vanilla JS, keep state local to the page, and prefer `textContent`/DOM creation over injecting unsanitized strings with `innerHTML`.
- Never execute untrusted code from the source material. Do not add network calls unless the user explicitly asks and accepts that it is no longer self-contained.
- The page must stand alone: include enough title, context, labels, legends, and source notes that someone can open it later without the chat.

## Default visual language

Follow the warm, editorial style used by the example HTML files:

- Ivory page background, white content panels, dark slate text, clay/rust emphasis, olive success/positive indicators, oat neutral fills.
- Serif headings, system sans body, monospace metadata/code.
- 1.5px borders, 8–14px radii, generous whitespace, restrained shadows.
- Mono uppercase eyebrows above major titles; concise lead text below.
- Clay accents for “look here”, olive for “good/pass/done”, rust/clay for “risk/blocking”.
- Responsive grids with clear breakpoints; avoid horizontal overflow except for code, tables, or diagrams.

Use this starter shell unless a different layout is clearly better:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Artifact title</title>
    <style>
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
        --serif: ui-serif, Georgia, "Times New Roman", serif;
        --sans:
          system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial,
          sans-serif;
        --mono: ui-monospace, "SF Mono", Menlo, Monaco, Consolas, monospace;
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
        color: var(--slate);
        font-family: var(--serif);
        font-weight: 500;
      }
      h1 {
        font-size: clamp(32px, 5vw, 44px);
        line-height: 1.12;
        letter-spacing: -0.015em;
        margin: 0 0 14px;
      }
      h2 {
        font-size: 24px;
        letter-spacing: -0.01em;
        margin: 0 0 12px;
      }
      .lead {
        max-width: 720px;
        color: var(--gray-700);
        margin: 0;
      }
      code,
      pre {
        font-family: var(--mono);
      }
      .panel {
        background: var(--white);
        border: 1.5px solid var(--gray-300);
        border-radius: 12px;
      }
    </style>
  </head>
  <body>
    <main class="page">
      <header class="page-head">
        <div class="eyebrow">Context · artifact type</div>
        <h1>Artifact title</h1>
        <p class="lead">Short orientation paragraph.</p>
      </header>
    </main>
  </body>
</html>
```

## Artifact patterns

### Exploration or comparison

Use for “show options”, “compare approaches”, “brainstorm directions”.

- Header with a compact prompt/context box.
- Grid of option cards/artboards, each labeled with a number or letter.
- Each card should include the concrete example/mock/code, the tradeoff it makes, and chips for key properties.
- End with a recommendation or “when to choose each” section.

### Code review, PR review, or PR write-up

Use for reviewing a diff, explaining a PR, or preparing a reviewer-friendly summary.

- PR/repo header with branch, author, file count, additions/deletions.
- TL;DR or “what this does” near the top.
- Risk map as clickable chips; color-code safe / worth a look / needs attention.
- File cards with rendered diffs, inline annotations, and comments tied to specific lines.
- Collapsible low-risk files using `<details>`.
- Next-step checklist at the bottom.

### Code understanding or feature explainer

Use when the user wants to understand how code or a system works.

- Sticky sidebar or nav listing key files/sections.
- Inline SVG flow diagram showing modules, data flow, or request path.
- Step-by-step walkthrough with file paths and relevant line ranges.
- Collapsible code snippets so the page stays readable.
- Callouts for gotchas, invariants, and “start here” concepts.

### Implementation plan or spec

Use for planning work to hand off or implement later.

- Summary strip: scope, owners, timeline, risk, feature flag, migration, or rollout.
- Milestone timeline or phased slices.
- Data-flow SVG diagram and/or UI mockups.
- Key code/API/schema snippets.
- Risks and mitigations table.
- Open questions with owners and decision deadlines.

### Status report, incident report, or research report

Use for weekly updates, postmortems, syntheses, and executive-readable reports.

- Strong title/meta row and TL;DR panel.
- Stat cards for headline numbers.
- Timeline for incidents or delivery progress.
- Tables for exact items and SVG charts for trends.
- Clear sections for highlights, impact, root cause, action items, carryover, and sources.

### Design system, component variants, or prototype

Use for visual exploration, UI components, animations, and interaction tuning.

- Artboard/stage panels with labels and rationale.
- Component variant matrix when dimensions matter.
- Controls in a sticky/side panel for theme, density, easing, timing, or options.
- CSS variables for tunable values; update them from small JS controls.
- Include copy-paste CSS/parameter snippets when the user will implement the result.

### Diagrams, explainers, and slide decks

Use HTML’s visual space instead of ASCII diagrams.

- Prefer inline SVG for flowcharts, architecture diagrams, charts, rings, timelines, and illustrations.
- Include labels directly on the diagram plus a legend/caption nearby.
- For slide decks, use full-viewport sections, scroll snap, a slide counter, and arrow-key navigation.

### Custom editing UI

Use when the user needs to sort, tag, tune, review, approve/reject, or edit structured data.

- Embed the starting data as JavaScript objects/arrays.
- Render controls/cards from data instead of hardcoding every row.
- Keep a sticky toolbar with status counts, reset, and export/copy actions.
- End the workflow with a button like “Copy as JSON”, “Copy diff”, “Copy as Markdown”, or “Copy prompt”. This is the point of the editor: the user can manipulate visually, then paste the result back.
- Validate dependencies and constraints in the UI (warnings for invalid feature-flag prerequisites, missing fields, conflicting choices, etc.).

## Interaction guidelines

- Add interaction only when it helps the user inspect, compare, tune, or export. Static pages should stay static.
- Native browser features often suffice: anchors, sticky sidebars, `<details>`, form controls, range sliders, checkboxes.
- Make copy buttons robust with a clipboard fallback.
- Give buttons visible hover/focus states and use real `<button>` elements.
- Keep JavaScript readable and close to the data it manipulates. Prefer simple functions over clever abstractions.

## Code, data, and diagrams

- Render code in dark panels or bordered light snippets with monospace type and horizontal overflow.
- For diffs, use rows with line numbers, `+`/`−` markers, and green/rust tinted backgrounds.
- For exact data, use semantic tables with clear headers. For trends/relationships, use inline SVG charts.
- Avoid ASCII diagrams, emoji-as-legend systems, and walls of prose where SVG/table/card layouts would be clearer.
- If source evidence matters, include file paths, PR numbers, dates, commands, or sources in mono metadata.

## Final quality checklist

Before saving, verify:

- The artifact is a saved `.html` file, not Markdown pasted into chat.
- It has no external rendering dependencies; any external hyperlinks are informational, not required for the page to work.
- The page opens as a complete standalone document.
- The first screen explains what the artifact is and why it exists.
- Visual hierarchy is obvious: title → summary → sections → details.
- Important risks/findings/actions are visually scannable.
- Code/data are escaped and readable.
- Interactive controls work without a server.
- Mobile or narrow screens degrade gracefully.
- Any uncertainty is labeled as an assumption or open question, not presented as fact.

For more detailed recipes and snippets, read `REFERENCE.md` in this skill directory.
