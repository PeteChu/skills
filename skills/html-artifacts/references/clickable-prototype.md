# Pattern: Clickable prototype ("mock before you wire")

A throwaway, single-file mock of a few linked screens with fake data, so the user can feel an
interaction before any real code changes. It carries state between screens, can toggle layout
variants in place, and ends with A/B questions whose answers fill a reply to paste back.

- **Example:** [`examples/clickable-prototype.html`](../examples/clickable-prototype.html)
- **Source inspiration:** `08-prototype-interaction.html` and `unknowns/04-toolbar-mock.html` in
  [ThariqS/html-effectiveness](https://github.com/ThariqS/html-effectiveness)
- **Interactive:** yes (Alpine. Small vanilla JS only for drag-and-drop).

## Use when

- "Mock it before you build it", "let me click through the flow", "prototype the new X step", "I
  want to react to the layout first".
- The open question is about **feel or placement** (where a toolbar sits, how a picker reads, whether
  a step should exist), and it is cheaper to answer by clicking than by reading.
- A single gesture needs feeling, such as drag-to-reorder or swipe-to-dismiss. Mock one screen with
  the gesture working.
- For one transition's timing, use [`animation-sandbox.md`](animation-sandbox.md). For three looks
  with no flow, use [`visual-directions.md`](visual-directions.md).

## Reader's job

Click through the happy path, flip between variants on the screen in question, then answer the
questions so the reply writes itself. They should never wonder what is real: the page must say
"mock, no code touched".

## Anatomy

1. **Header**: eyebrow (`Prototype · <app> · <area>`), a title that says what to do ("Click through
   …"), prompt box, and a mono line: `Mock only · no app code touched · real wiring would live in
   <path> behind <flag>`, plus keyboard hints.
2. **Flow map**: numbered pill buttons (`1 Cart → 2 Delivery time → 3 Review → 4 Confirmed`). The
   current step is filled, and steps whose prerequisites are missing are disabled.
3. **Device frame**: phone (`max-w-[340px] h-[640px] rounded-[38px] border-[10px]`) or app window
   with a status bar, app bar with back button and `n / N`, a scrolling viewport, and a bottom CTA
   per screen.
4. **Variant toggle** ("mock before you wire"): a segmented control near the frame that swaps the
   layout of one screen or element (A · Day tabs, B · Week grid, C · Next available; or floating
   pill, docked rail, under the seekbar). A callout states each variant's tradeoff in one sentence.
5. **"What you're feeling" panel**: 2–4 decisions baked into the **current** screen, each with a bold
   lead and the reason, so the user can push back on specifics.
6. **"Left out on purpose" chips**: scope that was skipped deliberately (error states, promo codes,
   auto-scroll).
7. **Open questions**: 3–4 A/B(/C) cards, each with lettered chips. Answering the layout question
   also switches the variant.
8. **Self-filling reply**: a sticky panel with `n / 4 answered`, a `<pre>` that renders
   `1. Placement: ___` and fills in as chips are picked, a free-notes textarea folded into the reply,
   and "Copy reply".

## Build steps

1. Pick the smallest set of screens that reaches the decision (usually 2–4), and write fake data
   that looks real: prices, names, times, and one sold-out or edge item.
2. Put all state in one `x-data` object: `screen`, `history[]`, `variant`, the user's selections, and
   `answers{}`. Screens are `x-show` blocks in the same frame.
3. Carry state forward: the slot picked on screen 2 must appear on screens 3 and 4, with totals
   recomputed.
4. Build each variant against the same data so switching keeps the user's selection.
5. For each screen, write the decisions you made without being asked. Those become the notes and,
   when they matter, the questions.
6. End with the reply template and footnote where real wiring would go. Do not touch app code.

## Key snippets

```js
go(k) {
  if (k === this.screen || ((k === 'review' || k === 'done') && !this.slot)) return;
  this.history.push(this.screen); this.screen = k; this.$refs.viewport.scrollTop = 0;
},
back() { if (this.history.length) this.screen = this.history.pop(); },
answer(q, o) { this.answers[q.key] = o[1]; if (o[2]) this.variant = o[2]; },   // Q1 also flips the mock
get reply() {
  return 'My reactions to the delivery-slot prototype:\n' +
    this.questions.map((q, i) => `${i + 1}. ${q.label}: ${this.answers[q.key] || '___'}`).join('\n') +
    '\nOther notes: ' + (this.freeNotes.trim() || '___');
},
```

```html
<div class="w-full max-w-[340px] h-[640px] rounded-[38px] border-[10px] border-[#141413] bg-white overflow-hidden shadow-xl flex flex-col">
  <div class="flex items-center gap-2 px-4 py-2.5 border-b border-[#f0eee6]">…back · title · n / 4…</div>
  <div class="flex-1 overflow-y-auto" x-ref="viewport">
    <div x-show="screen === 'cart'">…</div>
    <div x-show="screen === 'slot'" x-cloak>…variant A / B / C blocks…</div>
  </div>
  <div class="border-t border-[#f0eee6] p-3"><!-- one CTA per screen, disabled until valid --></div>
</div>
```

## Interaction

- **Real navigation**: CTAs, the back arrow, `Esc` for back, and the flow map for jumping. Guard
  jumps that would show empty state.
- **The CTA names the consequence** ("Continue · Today 6–7 pm", "Place order · $53.79") and stays
  disabled with a reason until valid.
- **Variants swap in place** and keep selections. Reset only variant-local UI (e.g. "Other times").
- Arrow keys move between tabs. Every control is a real `<button>` with `focus-visible`.
- For a gesture prototype, use native `dragstart/dragover/drop`. Snap the drop indicator to the
  nearest gap, not to the raw cursor, and keep the dragged row as a 35%-opacity ghost.
- Render notes with `x-text` (a `[bold, rest]` pair), never `x-html`.

## Pitfalls

- Building the real feature "while you're at it". The point is to decide before wiring.
- Screens that ignore earlier choices, which makes the flow feel fake and hides the real question.
- Variant toggles that reset everything, so the user cannot compare like with like.
- Questions about things the mock does not show. Every question must point at something clickable.
- A reply template the user has to rewrite. Blanks (`___`) should be the only edits needed.

## Combines well with

- [`animation-sandbox.md`](animation-sandbox.md): tune the one transition the flow depends on.
- [`implementation-plan.md`](implementation-plan.md): after the reply comes back, plan the real
  wiring at the footnoted path.

## Checklist

- [ ] The header says "mock only" and names where real code would live, with any flag.
- [ ] 2–4 linked screens with back, `Esc`, a flow map, and state that carries forward.
- [ ] A variant toggle with a one-line tradeoff for each variant, and selections that survive it.
- [ ] Per-screen "what you're feeling" notes and a "left out on purpose" list.
- [ ] A/B questions fill a copyable reply that includes free notes.
