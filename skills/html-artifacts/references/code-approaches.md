# Pattern: Code approaches comparison

Lay several implementation approaches for the same problem next to each other, each with real
code, its tradeoffs, and comparable properties, then end with a recommendation.

- **Example:** [`examples/code-approaches.html`](../examples/code-approaches.html)
- **Source inspiration:** `01-exploration-code-approaches.html` in
  [ThariqS/html-effectiveness](https://github.com/ThariqS/html-effectiveness)
- **Interactive:** no (static by default)

## Use when

- "Show me a few ways to do X", "what are my options", "compare approaches for…"
- The user has not decided, and seeing the options side by side is the decision aid.
- The approaches differ in **code shape**, not only in prose. If they differ only visually, use
  [`visual-directions.md`](visual-directions.md). If there are 8+ ideas of different effort, use
  [`brainstorm-map.md`](brainstorm-map.md).

## Reader's job

Point at one option. Each card must be comparable at a glance: same section order, same property
chips, similar code length.

## Anatomy

1. **Header**: eyebrow (`Exploration · <project>`), title stating the problem, prompt box quoting
   the ask.
2. **Approach grid**: 2–4 `<article>` cards in `lg:grid-cols-3` (or `lg:grid-cols-2` for two or
   four). Each card has the following, in the same order:
   1. Number badge (`01`) + approach name (serif) + one-line thesis (muted).
   2. Dark code panel with the **minimal real code**, 10–25 lines, written against the user's
      actual APIs and file paths.
   3. Pro/con table: 3 rows, with an olive dot for pros and a clay dot for cons.
   4. Property chips with the **same keys on every card** (e.g. bundle, testability, reuse,
      migration cost).
3. **Recommendation aside**: clay left border. Name the pick, say why in 2–3 sentences grounded in
   the codebase, and give the condition under which a different option would win.
4. Optional **"when to choose each"** table when the answer depends on context.

## Build steps

1. Read the relevant code first so every snippet uses real names, imports, and paths.
2. Choose approaches that are genuinely different (inline vs. abstraction vs. dependency; sync vs.
   queue). Do not include strawmen.
3. Fix the property keys before writing any card, then fill each card in the same order.
4. Write the recommendation last. It must reference specifics (call sites, existing patterns,
   constraints) and not generic best practice.

## Key snippet

```html
<section class="grid grid-cols-1 lg:grid-cols-3 gap-7 mb-14">
  <article class="bg-white border border-[#d1cfc5] rounded-xl p-6 flex flex-col gap-5">
    <header>
      <h2 class="font-serif font-medium text-[21px] text-[#141413] m-0 mb-1.5">
        <span class="font-mono text-xs bg-oat px-2 py-0.5 rounded-lg mr-2 align-[3px]">01</span>Inline retry loop
      </h2>
      <p class="text-sm text-[#87867f] m-0">Retry logic lives in the sender.</p>
    </header>
    <div class="bg-[#141413] rounded-xl px-5 py-4 overflow-x-auto"><pre class="m-0 …">…</pre></div>
    <div class="grid grid-cols-2 border border-[#d1cfc5] rounded-lg overflow-hidden text-[13px]">
      <div class="bg-[#f0eee6] px-3.5 py-2 font-semibold text-xs uppercase">Pro</div>
      <div class="bg-[#f0eee6] px-3.5 py-2 font-semibold text-xs uppercase border-l border-[#d1cfc5]">Con</div>
      <div class="px-3.5 py-2.5 border-t border-[#d1cfc5] pro">No new infra</div>
      <div class="px-3.5 py-2.5 border-t border-l border-[#d1cfc5] con">Blocks the request</div>
    </div>
    <div class="flex flex-wrap gap-2 mt-auto"><!-- chips, same keys on every card --></div>
  </article>
</section>
```

```css
.pro::before, .con::before { content: ""; display: inline-block; width: 6px; height: 6px; border-radius: 50%; margin-right: 8px; vertical-align: 2px; }
.pro::before { background: #788c5d; } .con::before { background: #d97757; }
```

Use `mt-auto` on the chip row so chips align at the bottom of cards of different heights.

## Pitfalls

- Pseudo-code instead of real code: the reader cannot judge integration cost.
- Different chip keys per card make the cards impossible to compare.
- A recommendation that hedges ("it depends") with no tiebreaker.
- More than 4 cards: past that, switch to `brainstorm-map`.

## Combines well with

- [`implementation-plan.md`](implementation-plan.md): after the user picks, turn the pick into a plan.
- [`interview.md`](interview.md): when the choice hinges on unknown requirements, ask first.

## Checklist

- [ ] Every card has the same section order and the same chip keys.
- [ ] Code uses real identifiers/paths and is HTML-escaped.
- [ ] Recommendation names one option and the condition that would flip it.
