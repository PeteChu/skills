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
4. **Generate one complete HTML file** with Tailwind utility classes (via CDN), minimal custom CSS only for patterns Tailwind cannot express, and Alpine.js (CDN) when interaction is needed. No build step. No Markdown wrapper.
5. **Save the file.** Use the user’s requested path if provided. Otherwise slugify the task into `html-artifacts/<slug>.html` when an `html-artifacts/` directory exists; otherwise save `<slug>.html` in the current directory.
6. **Reply briefly** with the saved path and a one-sentence note about what the page contains.

## Hard requirements

- Produce complete HTML: `<!doctype html>`, `<html lang="en">`, `<head>`, viewport meta, `<title>`, inline `<style>`, and `<body>`.
- Keep the artifact self-contained except Tailwind CSS Play CDN (`cdn.jsdelivr.net/npm/@tailwindcss/browser@4`) and Alpine.js CDN (`cdn.jsdelivr.net/npm/alpinejs@3`). These two CDNs are permitted. No other external fonts, CSS/JS, remote images, or framework dependencies. Use inline SVG instead of linked images when possible.
- Use semantic HTML (`header`, `main`, `section`, `article`, `aside`, `nav`, `footer`) and native controls (`details`, `summary`, `button`, `input`, `textarea`) before inventing custom widgets.
- Escape user/source content correctly in HTML: especially code snippets, diffs, JSON, logs, and user-provided text. Use `&lt;`, `&gt;`, `&amp;` inside markup and code examples.
- For interactive pages, prefer Alpine.js directives over vanilla JS when the interaction involves state (tabs, filters, toggles, forms). Keep state in `x-data` objects; use `textContent`/DOM creation over `innerHTML` when Alpine does not apply.
- Never execute untrusted code from the source material. Do not add network calls unless the user explicitly asks and accepts that it is no longer self-contained.
- The page must stand alone: include enough title, context, labels, legends, and source notes that someone can open it later without the chat.

## Default visual language

Follow the warm, editorial style. All styling comes from Tailwind utility classes plus a tiny `<style>` block for box-sizing and smooth scrolling. The custom colors (ivory, clay, oat, olive, rust) are registered in the `@theme` block of the Tailwind v4 Play CDN.

- **Page:** `bg-ivory` background, `text-gray-700` body, `font-sans`
- **Panels:** `bg-white border border-gray-300 rounded-xl`
- **Headings:** `font-serif` titles in `text-[#141413]` (slate), `font-medium`
- **Eyebrow:** `font-mono text-[11px] tracking-[0.08em] uppercase text-gray-500`
- **Code:** `font-mono` in dark panels (`bg-[#141413]`) or bordered snippets
- **Accents:** `text-clay` / `text-clay-dark` for emphasis, `text-olive` for positive, `text-rust` for danger
- **Chips:** `inline-flex items-center gap-1.5 border border-gray-300 rounded-full bg-white px-2.5 py-1.5 font-mono text-[11.5px]`
- **Responsive:** Tailwind's breakpoints (`md:`, `lg:`) for grid layout
- **H1 size:** `text-[clamp(32px,5vw,44px)]` via arbitrary value

Use this starter shell unless a different layout is clearly better:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Artifact title</title>
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
          Context · artifact type
        </p>
        <h1
          class="text-[#141413] font-serif font-medium text-[clamp(32px,5vw,44px)] leading-[1.12] tracking-tight m-0 mb-3.5"
        >
          Artifact title
        </h1>
        <p class="max-w-[720px] m-0">Short orientation paragraph.</p>
      </header>
    </main>
  </body>
</html>
```

For static pages, omit the Alpine script entirely. When interaction is needed, add `<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3/dist/cdn.min.js"></script>` before the closing `</head>`.

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
- For interactive state (tabs, filters, toggles, forms, copy buttons), prefer **Alpine.js directives** (`x-data`, `x-text`, `x-on:click`, `x-model`, `x-show`, `x-cloak`) over vanilla JS. Add `<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3/dist/cdn.min.js"></script>` when the page has interactive controls.
- For simple copy buttons, use Alpine:

```html
<button
  x-data="{ copied: false }"
  @click="await navigator.clipboard.writeText('text'); copied = true"
  @click.outside="copied = false"
>
  <span x-show="!copied">Copy</span>
  <span x-show="copied" class="text-olive">Copied ✓</span>
</button>
```

- Give buttons visible hover/focus states and use real `<button>` elements.
- Keep JavaScript readable and close to the data it manipulates. Prefer simple functions over clever abstractions. When Alpine does not fit (e.g., SVG manipulation, complex rendering), fall back to small vanilla JS blocks.

## Code, data, and diagrams

- Render code in dark panels or bordered light snippets with monospace type and horizontal overflow.
- For diffs, use rows with line numbers, `+`/`−` markers, and green/rust tinted backgrounds.
- For exact data, use semantic tables with clear headers. For trends/relationships, use inline SVG charts.
- Avoid ASCII diagrams, emoji-as-legend systems, and walls of prose where SVG/table/card layouts would be clearer.
- If source evidence matters, include file paths, PR numbers, dates, commands, or sources in mono metadata.

## Final quality checklist

Before saving, verify:

- The artifact is a saved `.html` file, not Markdown pasted into chat.
- The only rendering dependencies are the Tailwind CDN (`cdn.jsdelivr.net/npm/@tailwindcss/browser@4`) and optionally Alpine.js (`cdn.jsdelivr.net/npm/alpinejs@3`); any other external hyperlinks are informational, not required for the page to work.
- The page opens as a complete standalone document.
- The first screen explains what the artifact is and why it exists.
- Visual hierarchy is obvious: title → summary → sections → details.
- Important risks/findings/actions are visually scannable.
- Code/data are escaped and readable.
- Interactive controls work without a server.
- Mobile or narrow screens degrade gracefully.
- Any uncertainty is labeled as an assumption or open question, not presented as fact.

For more detailed recipes and snippets, read `REFERENCE.md` in this skill directory.
