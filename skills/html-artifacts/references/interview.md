# Pattern: Interview

Ask the user about an ambiguous feature one question at a time. Order the questions by
architectural blast radius. The page ends with a decisions table and a ready-to-paste
implementation prompt.

- **Example:** [`examples/interview.html`](../examples/interview.html)
- **Source inspiration:** `unknowns/06-interview.html` in
  [ThariqS/html-effectiveness](https://github.com/ThariqS/html-effectiveness)
- **Interactive:** yes (one-question stage, keyboard picks, free-text answers, decisions table, copy prompt)

## Use when

- "Interview me about X", "ask me questions before you build", "one question at a time",
  "what do you need to know from me", "the spec is fuzzy".
- The open questions are **known**, and only the user can answer them (product intent, risk
  appetite, scope). Reading more code won't resolve them.
- If the user doesn't yet know what the questions are, run [`blindspot-pass.md`](blindspot-pass.md)
  first. If the choice is between coded designs, use [`code-approaches.md`](code-approaches.md).

## Reader's job

Answer one question at a time in a few seconds each by clicking an option, pressing 1–3, or typing
their own answer. Then review the table and copy the prompt. The user should never have to read
all the questions at once.

## Anatomy

1. **Header**: eyebrow (`Spec interview · <repo>`), a title with the count ("Seven decisions to
   make before…"), the prompt box, and a mono line naming what was read and "N open questions,
   ordered by blast radius".
2. **"Settled from the code, not asking"** panel: 2–4 facts the agent resolved from the code,
   so the user can see what was *not* left to them.
3. **Interview shell**: a white card with a header bar (title, `n of N answered`, thin clay
   progress bar). Below it is a two-column grid:
   - **Rail** (left): a blast-radius ring SVG with Architecture at the core, then Data, UX, and
     Polish outward. Numbered dots sit on their ring, filled once answered, with a dark stroke on
     the current one. Below that, a question list with color dots and ✓ marks, a "Decisions table
     →" button, and a radius legend. Hide the list below `lg` and keep the rings.
   - **Stage** (right): the radius badge, `Question n of N`, the question in serif, a "Why this
     matters" line (which part of the architecture it changes), 2–4 option buttons (number key,
     title, one-line tradeoff, optional "my lean" chip), a free-text "Something else?" form, and
     Previous / Skip / key hints.
4. **Summary stage** (after the last question, or via the rail): a status pill, a decisions table
   (radius pill · topic · decision · edit), and a dark `<pre>` with the generated prompt plus Copy
   and Start over.
5. **"Why this order" callout**: says which answers are expensive to change later and invites
   the user to stop after the high-radius ones.

## Build steps

1. Read the code first and move everything it already answers into the "settled" panel.
2. List the real open questions and tag each one `arch`, `data`, `ux`, or `pol`. Sort by blast
   radius. Cap at 5–8 questions.
3. For each question, write a `why` that names the concrete consequence (a queue, a column, a
   screen). Write 2–4 options, each with a tradeoff grounded in numbers or files, and mark your
   lean.
4. Build the prompt template with the radius groups: architecture and data are "fixed", and UX and
   polish are "flexible, flag conflicts". Unanswered questions become "propose a default and tell
   me", and custom answers get "[my wording; ask if unclear]".
5. End the prompt with the settled facts and a "plan first, then stop for review" instruction.

## Key snippets

```js
pick(oi) { this.answers[this.current] = { text: this.q.opts[oi].t, custom: false }; setTimeout(() => this.advance(), 220) },
advance() { const n = this.answers.findIndex((a, i) => !a && i > this.current); this.go(n === -1 ? this.qs.length : n) },
key(e) {                       // bound with @keydown.window on the root
  if (this.summary || ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
  const n = parseInt(e.key, 10);
  if (n >= 1 && n <= this.q.opts.length) { e.preventDefault(); this.pick(n - 1) }
  else if (e.key === 'ArrowLeft' && this.current > 0) this.go(this.current - 1);
},
```

```html
<template x-for="(o, oi) in q.opts" :key="current + '-' + oi">
  <button type="button" @click="pick(oi)"
    :class="isPicked(oi) ? 'border-clay bg-[rgba(217,119,87,0.08)] ring-1 ring-clay' : 'border-[#d1cfc5] bg-white hover:border-[#141413]'"
    class="text-left border rounded-xl px-4 py-3.5 grid grid-cols-[28px_1fr] gap-x-3">
    <span class="font-mono text-xs bg-oat rounded-md w-6 h-6 grid place-items-center" x-text="oi + 1"></span>
    <span><span class="font-medium text-[#141413]" x-text="o.t"></span>
      <span x-show="q.lean === oi" class="font-mono text-[10.5px] … text-olive">my lean</span>
      <span class="block text-sm" x-text="o.d"></span></span>
  </button>
</template>
```

```html
<g class="qdot" tabindex="0" role="button" aria-label="Question 1, sync model" @click="go(0)" @keydown.enter.prevent="go(0)">
  <circle cx="120" cy="100" r="9" :fill="dotFill(0)" :stroke="dotStroke(0)" stroke-width="2" />
</g>
```

## Interaction

- Keep one Alpine object with `qs`, `answers[]`, and `current`. `current === qs.length` is the
  summary. Render all question text with `x-text`, never `innerHTML`.
- Picking an option auto-advances to the next **unanswered** question after a ~220 ms beat so the
  selection is visible. Skip leaves the answer `null`.
- The rail list, ring dots, and summary "edit" links all call `go(i)`. Focus the stage
  (`tabindex="-1"`, `preventScroll`) after each move so keyboard users stay oriented.
- Number keys and ← are ignored while typing in the free-text field.
- Provide a summary entry point on mobile too, since the rail list is hidden there.

## Pitfalls

- Asking things the code already answers. Move them to the "settled" panel instead.
- Questions in file or feature order instead of blast-radius order. The first three should be the
  ones that would force a rewrite.
- Options without tradeoffs ("Yes / No"). Each option needs a consequence.
- Dumping every question on one page. That turns it into a form, and the one-at-a-time focus is
  the point.
- A generated prompt that loses the radius grouping or silently drops unanswered questions.

## Combines well with

- [`blindspot-pass.md`](blindspot-pass.md): discover the unknowns, then interview on the ones only
  the user can decide.
- [`implementation-plan.md`](implementation-plan.md): feed the generated prompt into a plan the
  user reviews next.
- [`code-approaches.md`](code-approaches.md): when one answer hinges on seeing code, branch out to
  a comparison.

## Checklist

- [ ] There's a "settled from the code" panel, and questions are sorted architecture → data → UX → polish.
- [ ] Every question has a "why this matters" line and 2–4 options with tradeoffs, with at most one "my lean".
- [ ] Click, number keys, free text, Previous, Skip, and edit-from-summary all work.
- [ ] Ring dots and the progress bar reflect `answers`, and the summary handles unanswered rows.
- [ ] The generated prompt groups fixed vs. flexible decisions and ends with a plan-first instruction. Copy works.
