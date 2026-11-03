# Pattern: Blindspot pass

Scan territory the user has never worked in and report their unknown unknowns as cards. Each card
says what is true, why it bites, and gives a copyable prompt fix. The fixes then fold into one
improved implementation prompt.

- **Example:** [`examples/blindspot-pass.html`](../examples/blindspot-pass.html)
- **Source inspiration:** `unknowns/01-blindspot-pass.html` in
  [ThariqS/html-effectiveness](https://github.com/ThariqS/html-effectiveness)
- **Interactive:** yes (copy per fix, include/exclude toggles, live final prompt)

## Use when

- "Do a blindspot pass", "what don't I know about X", "I've never touched this module",
  "what will bite me if I…", "before I start, what should I know".
- The user is about to implement something in **unfamiliar code**, and the risk is in what they
  wouldn't think to ask, not in choosing between options.
- If the user already knows the open questions and needs to decide them, use
  [`interview.md`](interview.md). If they want options, use [`brainstorm-map.md`](brainstorm-map.md).

## Reader's job

Read each card once, decide whether that constraint applies, then copy one better prompt. The page
succeeds when the final prompt contains sentences the user could not have written that morning.

## Anatomy

1. **Header**: eyebrow (`Blindspot pass · <path> · N files scanned`), a title naming the count
   ("Seven things you'd have learned the hard way…"), the prompt box with a copy button, and a mono
   line saying what was read (files, commits, ADRs, reverted PRs).
2. **Asked vs. actual**: two cards side by side. Left: "what you asked for" (the naive mental
   model and estimate). Right, with a clay border: "what you're actually walking into", with the
   3–4 bold surprises.
3. **Stat chips**: counts per category. Rust for landmines, clay for history, slate for missing
   concepts, default for conventions.
4. **Territory map** (recommended): an inline SVG of the directory tree with numbered markers
   pinned to the file that hides each blindspot. Use the category colors and highlight the
   riskiest directory with a clay stroke.
5. **Blindspot cards**: 5–9 of them, all with the same structure, in this order:
   1. Number badge and category chip.
   2. Serif title phrased as a surprising claim ("The rate cache can't tell two carriers apart").
   3. One paragraph of facts with real identifiers.
   4. **Why it bites**: a gray band that describes the failure mode, including why tests miss it.
   5. **Prompt fix**: an imperative sentence the user can paste, with Copy and "Include" toggles.
   6. A mono evidence line (file:line, PR, ADR).
6. **Category filter** above the cards, plus a sticky desktop sidebar listing every blindspot with
   an include checkbox and a jump link.
7. **Final prompt**: a dark-bordered panel whose `<pre>` is rebuilt live from the included fixes,
   followed by a work order and a "stop and show me the plan after…" checkpoint. Copy button.
8. **"Start here" callout** (olive) naming the single most expensive blindspot.

## Build steps

1. Actually explore: read the module, `git log` on it, look for reverts, TODOs with names, ADRs,
   feature flags with different dev/prod values, half-finished migrations, and tests that skip.
2. Keep only findings that would **change what the user tells the agent**. Drop trivia.
3. Classify each one as Landmine (silent failure), History (someone tried and it was reverted),
   Missing concept (a domain idea the interface hides), or Convention (an unwritten required step).
4. Write the prompt fix first, as one imperative sentence naming files and a verification step.
   Then write the card around it.
5. Put the fixes in the Alpine data model once, and render them in the cards with `x-text` so the
   card text and the final prompt never drift apart.
6. Order the final prompt's work steps so that the riskiest constraint is handled first.

## Key snippets

```html
<script>
function blindspots() { return {
  filter: 'all', copied: '',
  spots: [{ id: '01', cat: 'landmine', label: 'Weights', fix: 'Read weight from parcels.weight_g only…' }],
  inc: { '01': true },
  show(cat) { return this.filter === 'all' || this.filter === cat },
  get included() { return this.spots.filter(s => this.inc[s.id]) },
  get finalPrompt() {
    return ['Add DHL Express… Constraints from the blindspot pass:', '',
      ...this.included.map((s, i) => `${i + 1}. ${s.label}: ${s.fix}`), '',
      'Stop and show me the plan after reading PR #1932, before writing code.'].join('\n') },
  copy(t, k) { navigator.clipboard.writeText(t).then(() => { this.copied = k; setTimeout(() => this.copied = '', 1400) }) },
}}
</script>
```

```html
<article x-show="show('landmine')" :class="inc['01'] ? '' : 'opacity-55'" class="bg-white border border-[#d1cfc5] rounded-xl p-6">
  <!-- badge + chip, serif title, facts paragraph -->
  <div class="grid sm:grid-cols-[110px_1fr] gap-3 bg-[#f0eee6] rounded-lg px-4 py-3 text-[14px] mb-4">
    <span class="font-mono text-[11px] uppercase tracking-[0.06em] text-rust">Why it bites</span><span>…</span>
  </div>
  <div class="border border-[rgba(217,119,87,0.55)] bg-[rgba(217,119,87,0.08)] rounded-lg p-3">
    <p class="font-mono text-[12.5px] text-[#141413] m-0 mb-3" x-text="spots[0].fix"></p>
    <button type="button" @click="copy(spots[0].fix, '01')" class="font-mono text-xs border …">Copy fix</button>
    <label class="font-mono text-xs"><input type="checkbox" x-model="inc['01']" class="accent-clay"> Include in final prompt</label>
  </div>
</article>
<pre class="whitespace-pre-wrap break-words font-mono text-[12.5px]" x-text="finalPrompt"></pre>
```

## Interaction

- The category filter changes `filter`. Cards use `x-show="show('<cat>')"`. Sidebar jump links
  reset the filter to `all` before scrolling.
- The card checkbox and the sidebar checkbox bind to the same `inc[id]`. Excluded cards dim to
  `opacity-55` instead of disappearing.
- Renumber the final prompt from the included list so it never has gaps. Show an
  `N constraints · M chars` counter next to Copy.
- Use one `copied` key for the whole page so that only the button just clicked shows "Copied ✓".

## Pitfalls

- Generic advice ("watch out for edge cases"). Every card needs a file, a PR, or a flag name.
- A "why it bites" that doesn't explain why **tests won't catch it**. That gap is what makes it
  a blindspot.
- Prompt fixes written as observations rather than instructions. Each fix should start with a verb
  and end with something verifiable.
- Duplicating fix text in the HTML and in JS. Keep it in one place and render it with `x-text`.
- More than ~9 cards. Merge related findings or move them into a `<details>` "also noticed" list.

## Combines well with

- [`interview.md`](interview.md): blindspots often surface decisions only the user can make.
  Interview on those next.
- [`implementation-plan.md`](implementation-plan.md): turn the improved prompt into a reviewed plan.
- [`module-map.md`](module-map.md): when the territory map needs to become a full architecture view.

## Checklist

- [ ] Prompt box at the top and an "asked vs. actual" pair right under it.
- [ ] Every card has category, claim title, facts, why-it-bites, prompt fix, and evidence.
- [ ] Fix text lives once in JS and the final prompt rebuilds from the included fixes.
- [ ] Copy works for the prompt, each fix, and the final prompt. `[x-cloak]` is styled.
- [ ] The final prompt ends with a work order and a stop-and-show-plan checkpoint.
