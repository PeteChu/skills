# Pattern: Change quiz (merge-readiness report)

A report on a diff (mental model, non-obvious behaviors, assumptions it leans on) that ends in a
short quiz the reader must pass before merging. Wrong answers quote the report and link back to
the section to re-read.

- **Example:** [`examples/change-quiz.html`](../examples/change-quiz.html)
- **Source inspiration:** `unknowns/11-change-quiz.html` in
  [ThariqS/html-effectiveness](https://github.com/ThariqS/html-effectiveness)
- **Interactive:** yes. An Alpine quiz with score, feedback, and a pass/fail result.

## Use when

- "Quiz me before I merge", "make sure I understand this change", "I'm approving code I didn't
  write", "onboard me to this PR".
- An agent or teammate wrote most of the diff and the approver must own it in production.
- To find defects, use [`code-review.md`](code-review.md). To explain the change to reviewers,
  use [`pr-writeup.md`](pr-writeup.md). This pattern checks understanding, not correctness.

## Reader's job

Read three short sections, then prove they could handle an incident or review involving this
change. The page shouldn't let them feel done until they actually are.

## Anatomy

1. **Header**: eyebrow (`Merge readiness · <repo> · PR #`), a title, the prompt box, and a chip
   row (branch → base, files and commits, +/− lines, CI status).
2. **01 Mental model**: one inline SVG that replaces reading 10+ files. Use before/after flows or
   a state lifecycle. Color new states and paths clay, keep existing ones gray, and label the
   edge cases on the arrows (`409 if slug taken`, `410 Gone`).
3. **02 Non-obvious behaviors**: exactly 3 cards with ids (`beh-1`…), each a numbered badge plus
   a title that states the behavior as a fact. Each card has a **What / Why / Where** definition
   list. Where lists `path:line` chips.
4. **Leans-on callout** (rust border, `id="sec-leans"`): the existing behavior this change
   silently depends on, and the upcoming work that would break it.
5. **Part 2 · Prove it**: a divider, then a sticky score bar (title, score / total, answered
   count, progress bar).
6. **Questions**: 5–6 `<fieldset>` cards. Each has "Question n of N", a scenario-style question
   (serif), and 4 option buttons with A–D badges. Feedback appears after a pick:
   - Correct: an olive callout that reinforces why.
   - Wrong: a rust callout with "The answer is C", a quoted excerpt from the report, and a
     `Re-read: <section> ↑` link to the anchor.
7. **Result** (after all are answered): on a pass, an olive "Cleared to merge" panel with a merge
   checklist (verified items ticked, remaining steps open). On a miss, a rust panel listing the
   missed sections (deduplicated) as links, plus a **Reset quiz** button.

## Build steps

1. Read the full diff and find 3 behaviors a skim would miss: implicit scopes, ordering, TTLs,
   failure and recovery semantics, freed or reserved resources.
2. Find the one existing behavior the change leans on (middleware, callbacks, indexes) and any
   planned work that would break it.
3. Write questions as **incidents or support tickets** ("a user reports X; what happened?"), not
   trivia. Each maps to exactly one anchor. Give every section at least one question.
4. Make distractors plausible. Each should be what a skimmer would guess.
5. Store `excerpt` as a verbatim sentence from the report so wrong-answer feedback teaches with
   the same words.

## Key snippet

```html
<section id="quiz" x-data="quiz()" @keydown="onKey($event)">
  <template x-for="(q, qi) in qs" :key="qi">
    <fieldset :data-q="qi" class="bg-white border rounded-xl px-5 py-5 min-w-0">
      <p class="font-serif text-[18px] text-[#141413] m-0 mb-4" x-text="q.q"></p>
      <template x-for="(o, oi) in q.opts" :key="oi">
        <button type="button" @click="pick(qi, oi)" :disabled="picks[qi] !== null" :class="optClass(qi, oi)"
          class="text-left flex gap-3 border rounded-lg px-3.5 py-2.5 focus-visible:outline-2 focus-visible:outline-clay">
          <span class="font-mono text-[11px] w-6 h-6 rounded-md grid place-items-center bg-[#f0eee6]" x-text="'ABCD'[oi]"></span>
          <span x-text="o"></span>
        </button>
      </template>
      <div x-show="picks[qi] !== null && picks[qi] !== q.correct" x-cloak class="mt-4 border-l-4 border-rust …">
        <blockquote x-text="q.excerpt"></blockquote>
        <a :href="'#' + q.anchor" x-text="'Re-read: ' + q.label + ' ↑'"></a>
      </div>
    </fieldset>
  </template>
</section>
```

```js
function quiz() { return {
  qs: [{ q: '…', opts: ['…','…','…','…'], correct: 1, why: '…', excerpt: '…', anchor: 'beh-1', label: 'B1: …' }],
  picks: [], init() { this.picks = this.qs.map(() => null) },
  pick(qi, oi) { if (this.picks[qi] === null) this.picks[qi] = oi },
  get answered() { return this.picks.filter(p => p !== null).length },
  get score() { return this.picks.filter((p, i) => p === this.qs[i].correct).length },
  get done() { return this.answered === this.qs.length },
  get missed() { const s = new Set(); return this.qs.filter((q, i) =>
    this.picks[i] !== null && this.picks[i] !== q.correct && !s.has(q.anchor) && s.add(q.anchor)) },
  reset() { this.picks = this.qs.map(() => null); this.$nextTick(() => this.$root.scrollIntoView()) },
}}
```

## Interaction

- Answers lock after one pick. The chosen option turns olive or rust (struck through), the
  correct one gets a dashed olive border, and the rest fade.
- Keyboard: options are real buttons (Tab/Enter). Pressing A–D while focus is inside a fieldset
  picks that option (`onKey` reads `closest('[data-q]')`).
- Section anchors flash briefly via `:target { animation: … }` so the re-read target is obvious.
- Render all text with `x-text`. Keep the quiz data in a `<script>` function and never build
  HTML strings.

## Pitfalls

- Trivia questions ("which file changed?"). Every question should be a decision.
- Questions about facts the report never states. The reader can't recover from a wrong answer.
- An answer key that is always B. Vary the position of `correct`.
- `m-0` on cards inside `space-y-*` removes the gap. Leave margins to the parent.
- More than 7 questions. Past that it turns into a chore and people skim.

## Combines well with

- [`code-review.md`](code-review.md): review for bugs first, then quiz for understanding.
- [`implementation-notes.md`](implementation-notes.md): deviations from the build make good quiz
  material.

## Checklist

- [ ] 3 behaviors plus a leans-on callout, each with a stable `id`.
- [ ] Every question maps to an anchor and quotes the report in its wrong-answer feedback.
- [ ] Score, answered count, and progress update live. Reset clears all state.
- [ ] Pass shows a merge checklist. Fail lists deduplicated re-read links.
- [ ] Works with keyboard only, and nothing renders as raw `{{ }}` or blank `x-text`.
