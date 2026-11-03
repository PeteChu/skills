---
name: html-artifacts
description: >-
  Generate polished, self-contained HTML artifacts instead of Markdown. Use whenever the user asks for a substantial report, plan, spec, code review, PR write-up, code explainer, research summary, status or incident report, design exploration, prototype, diagram, slide deck, comparison, brainstorm, interview, merge quiz, or one-off editing UI that should be easy to read, share, or interact with in a browser. Prefer this skill for rich deliverables even if the user says “doc”, “report”, “summary”, “plan”, “show me options”, or “write this up” and does not explicitly say HTML.
disable-model-invocation: true
---

# html-artifacts

Create a single, self-contained `.html` file as the final artifact. HTML beats Markdown for dense
technical work because one browser-readable file can combine prose, tables, inline SVG diagrams,
code, visual hierarchy, and small interactions. Patterns are distilled from
[ThariqS/html-effectiveness](https://github.com/ThariqS/html-effectiveness) (Apache-2.0) and
rebuilt on Tailwind + Alpine.

Do not respond with a long Markdown document when the user needs a substantial artifact. Build the
HTML page, save it, and report the path.

## Workflow

1. **Identify the artifact's job.** What will the reader *do* with it: pick an option, review a
   change, understand a system, tune a value, edit data, sign off, or hand off a plan?
2. **Gather context.** Read the relevant files, diffs, data, and notes first. Artifacts are only as
   good as the real names, paths, and numbers in them. If facts are missing, make light assumptions
   and label them. Ask only when the ambiguity would change the structure.
3. **Pick patterns with the mapper below.** Choose exactly one *primary* pattern; it decides the
   page's information architecture. Optionally borrow sections from up to two *secondary*
   patterns.
4. **Read the references.** Always read `references/foundations.md` (shell, tokens, components).
   Then read each chosen `references/<pattern>.md`. Open `examples/<pattern>.html` when you want to
   see the finished quality bar.
5. **Generate one complete HTML file.** Use Tailwind (Play CDN) utilities. Keep a tiny `<style>`
   block for pseudo-elements and syntax tokens, and add Alpine.js only when interactive. No build
   step.
6. **Save it.** Use the user's path if given. Otherwise use `html-artifacts/<slug>.html` when that
   directory exists, else `<slug>.html` in the current directory.
7. **Reply briefly** with the path and one sentence on what the page contains.

## Pattern mapper

Match the user's request to the reader's job. Each row links the how-to (`references/`) and a
finished showcase (`examples/`). ◆ = interactive (needs Alpine).

### Decide before building

| The user wants to…                                                        | Pattern                                                  | Example                                                       |
| ------------------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------- |
| See 2–4 implementation approaches side by side with tradeoffs             | [code-approaches](references/code-approaches.md)         | [html](examples/code-approaches.html)                         |
| React to visual/layout directions rendered live, then pick ◆               | [visual-directions](references/visual-directions.md)     | [html](examples/visual-directions.html)                       |
| Survey 8–12 ideas by effort vs. impact and mark what resonates ◆          | [brainstorm-map](references/brainstorm-map.md)           | [html](examples/brainstorm-map.html)                          |
| Be interviewed about an ambiguous feature, one question at a time ◆        | [interview](references/interview.md)                     | [html](examples/interview.html)                               |
| Find what they don't know they don't know in unfamiliar code ◆            | [blindspot-pass](references/blindspot-pass.md)           | [html](examples/blindspot-pass.html)                          |
| Prove understanding of a reference implementation before porting it ◆      | [reference-port](references/reference-port.md)           | [html](examples/reference-port.html)                          |
| Hand off a plan/spec: milestones, data flow, risks, open questions         | [implementation-plan](references/implementation-plan.md) | [html](examples/implementation-plan.html)                     |

### Understand code and concepts

| The user wants to…                                                        | Pattern                                                  | Example                                                       |
| ------------------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------- |
| See the *shape* of a package: modules, arrows, hot path, entry points      | [module-map](references/module-map.md)                   | [html](examples/module-map.html)                              |
| Learn how one feature works end to end in this repo ◆                     | [feature-explainer](references/feature-explainer.md)     | [html](examples/feature-explainer.html)                       |
| Learn a general concept with a live, manipulable model ◆                  | [concept-explainer](references/concept-explainer.md)     | [html](examples/concept-explainer.html)                       |
| Follow a process/pipeline step by step, with timings and failure paths ◆ | [flowchart](references/flowchart.md)                     | [html](examples/flowchart.html)                               |

### Review and ship code

| The user wants to…                                                        | Pattern                                                  | Example                                                       |
| ------------------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------- |
| Review someone's diff: annotated hunks, severity, risk map                | [code-review](references/code-review.md)                 | [html](examples/code-review.html)                             |
| Write up their own PR for reviewers: why, before/after, where to focus    | [pr-writeup](references/pr-writeup.md)                   | [html](examples/pr-writeup.html)                              |
| Check they really understand a change before merging ◆                   | [change-quiz](references/change-quiz.md)                 | [html](examples/change-quiz.html)                             |
| Win buy-in to ship: demo first, objections pre-answered, sign-offs ◆      | [pitch-doc](references/pitch-doc.md)                     | [html](examples/pitch-doc.html)                               |
| Log where the build deviated from the plan, for the next attempt ◆        | [implementation-notes](references/implementation-notes.md) | [html](examples/implementation-notes.html)                  |

### Design and prototype

| The user wants to…                                                        | Pattern                                                  | Example                                                       |
| ------------------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------- |
| Render a repo's tokens (color, type, spacing) as a living reference ◆     | [design-system](references/design-system.md)             | [html](examples/design-system.html)                           |
| Review every size × state × intent of one component on one sheet          | [component-variants](references/component-variants.md)   | [html](examples/component-variants.html)                      |
| Tune a transition's duration/easing before wiring it in ◆                 | [animation-sandbox](references/animation-sandbox.md)     | [html](examples/animation-sandbox.html)                       |
| Click through a few linked screens to feel an interaction ◆               | [clickable-prototype](references/clickable-prototype.md) | [html](examples/clickable-prototype.html)                     |

### Communicate

| The user wants to…                                                        | Pattern                                                  | Example                                                       |
| ------------------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------- |
| Weekly/periodic status: shipped, slipped, trend chart                     | [status-report](references/status-report.md)             | [html](examples/status-report.html)                           |
| Post-mortem: timeline, impact, root cause, action items                   | [incident-report](references/incident-report.md)         | [html](examples/incident-report.html)                         |
| Present to a room: arrow-key slides ◆                                     | [slide-deck](references/slide-deck.md)                   | [html](examples/slide-deck.html)                              |
| Produce figures/diagrams for a post or doc, copyable one by one ◆        | [svg-figures](references/svg-figures.md)                 | [html](examples/svg-figures.html)                             |

### Edit structured data (always ends with an export button)

| The user wants to…                                                        | Pattern                                                  | Example                                                       |
| ------------------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------- |
| Sort/prioritize a list of items into buckets, then copy the order ◆       | [triage-board](references/triage-board.md)               | [html](examples/triage-board.html)                            |
| Edit config/flags with dependency validation, then copy the diff ◆       | [flag-editor](references/flag-editor.md)                 | [html](examples/flag-editor.html)                             |
| Iterate on a prompt/template against sample inputs, then copy it ◆       | [prompt-tuner](references/prompt-tuner.md)               | [html](examples/prompt-tuner.html)                            |

### Telling close patterns apart

- **code-approaches vs. visual-directions vs. brainstorm-map.** Use code-approaches when options
  differ in code, visual-directions when they differ in look, and brainstorm-map for many ideas of
  very different size.
- **code-review vs. pr-writeup.** code-review is the reviewer judging someone's diff. pr-writeup is
  the author explaining their own change.
- **module-map vs. feature-explainer vs. concept-explainer.** module-map shows structure (what
  exists and how it connects). feature-explainer follows behavior (what happens on a request).
  concept-explainer covers an idea that is not tied to this repo.
- **flowchart vs. module-map.** flowchart is a sequence of steps over time; module-map is
  components in space.
- **implementation-plan vs. implementation-notes.** The plan comes before the build. The notes are
  written during it and record where reality diverged.
- **pitch-doc vs. pr-writeup.** pitch-doc persuades decision-makers to ship. pr-writeup helps
  reviewers read the code.
- **status-report vs. incident-report.** status-report covers routine progress. incident-report
  covers one event and its causes.
- **clickable-prototype vs. animation-sandbox.** clickable-prototype covers flow between screens.
  animation-sandbox covers the feel of a single transition.

### Combination recipes

The **primary** pattern sets the page structure. **Secondary** patterns contribute one section
each.

| Situation                                           | Primary              | Borrow from                                   |
| --------------------------------------------------- | -------------------- | --------------------------------------------- |
| "Plan this feature" with real ambiguity             | implementation-plan  | interview (decisions table), code-approaches (chosen-option card) |
| "Plan the port of X to Y"                           | implementation-plan  | reference-port (semantics table), blindspot-pass (risks) |
| "Write up my PR" for a large or risky change        | pr-writeup           | module-map (before/after diagram), change-quiz (reviewer self-check) |
| "Review this PR" touching a pipeline                | code-review          | flowchart (where the change sits)             |
| "Explain how auth works here"                       | feature-explainer    | module-map (overview SVG), blindspot-pass (gotchas) |
| "Write the post-mortem"                             | incident-report      | flowchart (failure path), status-report (metric chart) |
| "Get sign-off to ship"                              | pitch-doc            | clickable-prototype (embedded demo), status-report (stat cards) |
| "Present the design review"                         | slide-deck           | component-variants or visual-directions (one slide each) |
| "Document our design tokens and Button"             | design-system        | component-variants (Button sheet)             |
| "Help me prioritize these ideas/tickets"            | brainstorm-map       | triage-board (drag to Now/Next/Later + export) |
| "Explain this concept, then how we use it"          | concept-explainer    | feature-explainer (repo-specific steps)       |

When no row fits, pick the pattern whose **reader's job** is closest, and keep it as the only
primary. Never stack two primaries. A page that is both a deck and a report serves neither.

## Hard requirements

- Complete HTML: `<!doctype html>`, `<html lang="en">`, `<head>`, viewport meta, `<title>`,
  `<body>`.
- Self-contained except two permitted CDNs: Tailwind Play CDN
  (`cdn.jsdelivr.net/npm/@tailwindcss/browser@4`) and Alpine.js (`cdn.jsdelivr.net/npm/alpinejs@3`).
  No other fonts, CSS, JS, or remote images. Use inline SVG for visuals.
- Semantic HTML (`header`, `main`, `section`, `article`, `aside`, `nav`, `footer`). Use native
  controls (`details`, `button`, `input`, `dialog`) before custom widgets.
- Escape source content: `&lt;`, `&gt;`, `&amp;` in code, diffs, JSON, logs, and user text.
- Use Alpine for interactive state. When Alpine doesn't fit, use small vanilla JS with
  `textContent`/`createElement`, never `innerHTML` with source text.
- Never execute untrusted code from source material. No network calls unless the user explicitly
  asks.
- The page must stand alone: title, context (prompt box), labels, legends, and source notes, so it
  makes sense without the chat.
- Interactive editors and pickers end in an export: Copy JSON / diff / Markdown / prompt / reply.

## Visual language (summary — tokens and snippets in `references/foundations.md`)

Warm editorial style. Ivory page (`bg-ivory`), white bordered panels (`rounded-xl`), serif slate
headings, mono uppercase eyebrows and metadata, and dark code panels. Clay is the accent and
attention color, olive means positive/done, rust means danger. Use the `@theme` block from the
foundations shell verbatim so these utilities exist.

## Final quality checklist

- [ ] A saved `.html` file, not Markdown in chat.
- [ ] Only the two permitted CDN scripts. No other external dependency.
- [ ] The first screen says what this is and why it exists (eyebrow, title, prompt/lead).
- [ ] Hierarchy is obvious: title → summary → sections → details.
- [ ] The primary pattern's checklist (in its reference file) passes.
- [ ] Risks, findings, and actions are visually scannable (chips, color, callouts).
- [ ] Code and data are escaped, readable, and use real identifiers and paths.
- [ ] Interactive controls work offline from `file://` and end in an export where relevant.
- [ ] Narrow screens degrade gracefully (grids collapse; wide SVG scrolls).
- [ ] Assumptions and open questions are labeled, not stated as fact.
