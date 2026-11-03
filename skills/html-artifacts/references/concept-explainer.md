# Pattern: Concept explainer

Teach one general concept with a live model the reader can poke, a comparison against the
alternatives, and a hover-linked glossary. A variant, "teach me my unknowns", adds a vocabulary
ladder so a vague ask becomes a precise prompt.

- **Example:** [`examples/concept-explainer.html`](../examples/concept-explainer.html)
- **Source inspiration:** `15-research-concept-explainer.html` and
  `unknowns/02-color-grading-explainer.html` in
  [ThariqS/html-effectiveness](https://github.com/ThariqS/html-effectiveness)
- **Interactive:** yes (Alpine: sliders and inputs drive the model, glossary hover-linking, copy)

## Use when

- "Explain X to me", "how does consistent hashing / a Bloom filter / CRDTs / color grading work",
  "I don't know what X is but I need to do it", "teach me enough to prompt you properly".
- The concept has **a parameter you can turn** and a visible consequence. That is what earns the
  live model; without one, a static diagram from [`svg-figures.md`](svg-figures.md) is enough.
- If the question is about how *this repo* implements something, use
  [`feature-explainer.md`](feature-explainer.md).

## Reader's job

Build intuition by doing: move a slider, see the effect, then name the tradeoff in their own
words. The "teach me my unknowns" variant adds a second job: leave with vocabulary they can paste
into their next request.

## Anatomy

1. **Layout**: `lg:grid-cols-[minmax(0,1fr)_250px]`; main column plus a sticky **glossary** aside
   (stacks below on mobile).
2. **Header**: eyebrow (`Learning · concept explainer · <context>`), title naming the concept, prompt
   box, a lead that states the problem in the user's numbers and the core tradeoff in one sentence.
3. **01 Mental model**: 3–4 step cards (or a pipeline strip). Key nouns are `.term` spans.
4. **02 Live model**: one white panel with: parameter sliders (value shown in mono), the
   visualization (grid of cells, SVG ring, rendered frame), inputs to add/query, a verdict panel
   colored olive/clay/rust, 2×2 readout tiles, and a small SVG chart of the governing formula with
   a dot for "where you are now". Add one **"Show me the interesting case"** button that jumps the
   state to where the concept's surprising behavior appears.
5. **03 Versus the alternatives**: table with the concept and 2–3 alternatives as columns, sized to
   the user's scale; highlight the concept's column header in clay; color cells olive/rust.
6. **Glossary aside**: `<dl>` of 5–7 terms. Hovering a `.term` in the text tints its entry, and
   hovering an entry tints every matching term.

### Variant: teach me my unknowns

Use when the user says they don't know the domain ("I don't know what color grading is but I need
to grade this video"). Add after the comparison:

7. **Vocabulary ladder**: 5–7 cards, ordered from basic to advanced. Each card: term + mono kicker
   (symbol or unit), a one-breath definition, and a **"say it like this"** quote (clay left border,
   italic) showing the term used in a realistic instruction.
8. **What good looks like**: a ✓/! checklist of quality criteria in the user's context.
9. **Prompts you couldn't have written an hour ago**: open with the vague "before" ask, then 2–4
   precise prompts that use the ladder's terms, each with a Copy button.

## Build steps

1. Restate the user's problem with their numbers (100 M URLs, a 3-minute launch video). Every
   later figure uses them.
2. Pick the one or two parameters that matter and the formula or rule that links them to the
   outcome. Implement the model in a `<script>` function so it is real, not animated fake data.
3. Choose defaults that look healthy, then find (by running the model) a state that shows the
   failure mode, and wire it to the "show me" button.
4. Build the comparison at the user's scale. Label assumptions in the section intro.
5. For the variant, write the ladder from the prompts backwards: draft the precise prompts first,
   then make sure every term they use has a rung.

## Key snippets

```html
<span class="term" tabindex="0" :class="hl('fp')"
  @mouseenter="g='fp'" @mouseleave="g=null" @focus="g='fp'" @blur="g=null">false positive</span>
…
<div class="px-4 py-3 transition-colors" :class="hl('fp')" @mouseenter="g='fp'" @mouseleave="g=null">
  <dt class="font-serif text-[15.5px] text-[#141413]">False positive</dt>
  <dd class="m-0 text-[13px]">"Probably seen" for an item never added.</dd>
</div>
```

```html
<article class="bg-white border border-[#d1cfc5] rounded-xl p-5 flex flex-col gap-2">
  <h3 class="m-0 font-serif text-[19px] font-medium text-[#141413]">Bits per item <span class="font-mono text-[11px] text-[#87867f] font-normal">m / n</span></h3>
  <p class="m-0 text-[14px]">One-breath definition.</p>
  <p class="m-0 mt-auto text-[13.5px] italic bg-[rgba(217,119,87,0.08)] border-l-2 border-clay rounded-r-md px-3 py-2">"We can afford 12 bits per item. What false-positive rate does that buy?"</p>
</article>
```

```css
.term { border-bottom: 1.5px dotted #d97757; cursor: help; border-radius: 2px; }
input[type="range"] { accent-color: #d97757; }
```

## Interaction

- One page-level `x-data="model()"` so the glossary and the main text share `g` (hovered term).
  `hl(t)` returns the tint class when `g === t`.
- Derived values are getters (`get bits()`, `get fpRate()`, `get curve()`); sliders use
  `x-model.number`. Seed the model in `init()` so the first paint is not empty.
- Chart: `<polyline :points="curve">` computed from the formula across the x range, plus
  `<circle :cx :cy>` for the current state. Static axes and gridlines stay in markup.
- Render cells with `<template x-for="(b, i) in bits" :key="i">` and pass `b` into a class helper
  rather than recomputing inside it.
- User text goes through `x-model`/`x-text` only. Never build markup from it.

## Pitfalls

- A model that only animates. If changing a slider doesn't change a computed outcome, cut it.
- Defaults that never show the interesting behavior and no button to get there.
- Comparison numbers at a generic scale instead of the user's.
- Glossary terms that never appear in the text, or text terms with no glossary entry.
- In the variant: definitions without the "say it like this" line. The quote is what transfers.

## Combines well with

- [`interview.md`](interview.md): after the ladder, interview the user using the new vocabulary.
- [`implementation-plan.md`](implementation-plan.md): turn the payoff prompts into a plan.

## Checklist

- [ ] The lead uses the user's numbers and states the tradeoff in one sentence.
- [ ] Every control changes a computed readout; one button jumps to the failure case.
- [ ] Every `.term` has a glossary entry and hover works both ways (and on keyboard focus).
- [ ] Variant: each ladder term appears in at least one payoff prompt; prompts have Copy buttons.
