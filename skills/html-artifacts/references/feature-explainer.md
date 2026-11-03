# Pattern: Feature explainer

Explain how one feature works end to end in *this* repo: a TL;DR up top, the request path as
numbered collapsible steps, tabbed config snippets for "how do I use it", then gotchas and an FAQ.

- **Example:** [`examples/feature-explainer.html`](../examples/feature-explainer.html)
- **Source inspiration:** `14-research-feature-explainer.html` in
  [ThariqS/html-effectiveness](https://github.com/ThariqS/html-effectiveness)
- **Interactive:** yes (Alpine: collapsible steps, expand/collapse all, tabs with arrow keys,
  copy; optional step-linked diagram)

## Use when

- "How does X work in this repo?", "walk me through rate limiting / uploads / auth / caching",
  "what do I need to add to use X in my feature?", "explain this feature before I change it".
- The reader is about to **use or modify** an existing feature and needs both the mechanism and the
  integration recipe.
- For the static *shape* of a whole package, use [`module-map.md`](module-map.md). For a general
  concept not tied to this codebase, use [`concept-explainer.md`](concept-explainer.md).

## Reader's job

Answer two questions: "what actually happens when this runs?" and "what's the minimum I add to use
it?". The TL;DR should answer both in three bullets; the rest is evidence and detail on demand.

## Anatomy

1. **Layout**: `lg:grid-cols-[200px_minmax(0,1fr)]`. Left: sticky "On this page" nav with sub-links
   for each step (highlight the active one) and a **Files read** list. Hidden below `lg`.
2. **Header**: eyebrow (`Research · feature explainer · <repo>`), title "How X works in <repo>",
   prompt box, **TL;DR panel** (clay left border, 3 bullets), a row of fact chips (volume, limits,
   latency, one rust chip for the scary number).
3. **01 At a glance**: a small sequence diagram (actors as columns, numbered messages). Badges are
   clickable and open the matching step; the open step's arrow turns clay.
4. **02 Step by step**: 3–6 collapsible cards. Header row: `▸`, `N · verb phrase` (serif), and
   `path:line` (mono, right-aligned). Body: 2–4 sentences, an optional ≤8-line code excerpt, timing
   chips. First step open; "Expand all / Collapse all" buttons in the section header.
5. **03 Using it in your feature**: tabs (config file, route/server code, client code, sample
   response) with the **new lines highlighted in clay**, a Copy button for the active tab, then an
   olive "shortcut" callout for the zero-config path.
6. **04 Gotchas**: 3–5 cards, bold lead sentence + one-line consequence.
7. **05 FAQ**: `<details class="fold">` items phrased as the questions people ask in Slack.

## Build steps

1. Find the entry point (middleware, hook, route) and trace one real request through it. Write down
   each hop as `path:line` before drafting any prose.
2. Collapse the trace into 3–6 steps named by what happens, not by function name.
3. Find the config surface (YAML, env, decorator, registry) and write the snippets for the user's
   actual use case, not a generic one.
4. Collect gotchas from defaults, dev/prod differences, and places where two checks disagree.
5. Write the TL;DR last, from the steps.

## Key snippets

```html
<div id="step-2" class="scroll-mt-24 border border-[#d1cfc5] rounded-xl bg-white overflow-hidden"
  :style="active === 2 ? 'border-color:#d97757' : ''">
  <button type="button" @click="toggle(2)" :aria-expanded="isOpen(2)"
    class="w-full text-left px-5 py-3.5 flex flex-wrap items-baseline gap-x-3 gap-y-1 hover:bg-[#faf9f5] focus-visible:outline-2 focus-visible:outline-clay">
    <span class="text-clay inline-block transition-transform" :class="isOpen(2) && 'rotate-90'">▸</span>
    <span class="font-serif text-[17px] text-[#141413]">2 · Browser uploads straight to the bucket</span>
    <span class="sm:ml-auto font-mono text-[11px] text-[#87867f]">web/hooks/useUpload.ts:44</span>
  </button>
  <div x-show="isOpen(2)" x-cloak class="px-5 pb-5 sm:pl-11">…</div>
</div>
```

```html
<div role="tablist" class="flex overflow-x-auto" @keydown.right.prevent="nextTab(1)" @keydown.left.prevent="nextTab(-1)">
  <template x-for="t in tabs" :key="t">
    <button type="button" role="tab" @click="tab = t" :aria-selected="tab === t" :tabindex="tab === t ? 0 : -1"
      :class="tab === t ? 'bg-white text-[#141413] border-b-clay' : 'text-[#87867f] border-b-transparent'"
      class="font-mono text-xs px-4 py-2.5 border-r border-[#d1cfc5] border-b-2 -mb-px" x-text="labels[t]"></button>
  </template>
</div>
<pre x-ref="yaml" x-show="tab === 'yaml'" class="…">…</pre>
```

## Interaction

- One `x-data="explainer()"` on the page wrapper; define the function in a `<script>` in `<head>`
  (before Alpine's deferred script runs). State: `open: [1]`, `active`, `tab`, `tabs`, `copied`.
- `toggle(n)` adds/removes from `open` and sets `active`; `show(n)` opens, sets `active`, and
  `scrollIntoView` in `$nextTick` (used by nav sub-links and diagram badges).
- SVG bindings: `:stroke="active === n ? '#d97757' : '#87867f'"` and a matching `:marker-end`.
  Also set static `stroke`/`marker-end` so the diagram renders before Alpine boots.
- Copy reads `$refs[tab].textContent`, so each `<pre>` has `x-ref` equal to its tab key.
- Leave the first step without `x-cloak` so the page is meaningful with JS off.
- For an active state that recolors an element with a static color class, bind `:style` rather
  than swapping Tailwind classes: two border-color utilities on one element fight by CSS order.

## Pitfalls

- Steps named after functions (`presignUpload()`) instead of what happens ("Ask the API for a URL").
- Config tabs showing the existing generic setup instead of the change the user needs.
- A TL;DR that restates the title. It must contain the mechanism and the integration cost.
- Tab labels that drift from the file path in the snippet's first comment.
- Long excerpts inside steps. Link the path; quote only the lines that carry the idea.

## Combines well with

- [`module-map.md`](module-map.md): show the package shape first when the feature spans many modules.
- [`implementation-plan.md`](implementation-plan.md): turn "using it in your feature" into a plan.

## Checklist

- [ ] TL;DR answers "how it works" and "what I add" in ≤3 bullets.
- [ ] Every step header has a real `path:line`; diagram badges open the matching step.
- [ ] Tabs work by click and ←/→; Copy copies the active tab; new lines are highlighted.
- [ ] Gotchas name concrete defaults or dev/prod differences; FAQ uses the reader's phrasing.
