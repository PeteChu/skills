# Pattern: Implementation notes (deviation log)

A running log kept during a build. It records every place the code forced a departure from the
plan, the conservative call made, what to revisit, and the decisions only a human can make. It
ends with bullets to fold into the next plan.

- **Example:** [`examples/implementation-notes.html`](../examples/implementation-notes.html)
- **Source inspiration:** `unknowns/09-implementation-notes.html` in
  [ThariqS/html-effectiveness](https://github.com/ThariqS/html-effectiveness)
- **Interactive:** yes. Filter chips (Alpine) and a "Copy bullets" export.

## Use when

- "Keep notes as you build", "log deviations from the plan", "don't stop to ask, write down what
  you decided", or at the end of a long autonomous run that followed a plan.
- A plan exists (often from [`implementation-plan.md`](implementation-plan.md)) and the build has
  finished or paused. The reader wants to know where reality disagreed with it.
- If there was no plan, or nothing deviated, use [`pr-writeup.md`](pr-writeup.md).

## Reader's job

Audit the judgment calls made without them. They confirm or overturn each conservative call,
answer the "for you" items, and paste the fold-back bullets into the next plan. Deviations must
be findable in seconds, and decisions needed from the reader must stand apart from FYIs.

## Anatomy

1. **Header**: eyebrow (`Implementation notes · <repo> · during the build`), a title that counts
   the deviations ("four places the code overruled the plan"), the prompt box, and a mono meta
   line (notes file path, branch, run window, commit count).
2. **Summary band**: 4 stat cards: entries, deviations (clay border), need-your-call (rust
   border), and plan steps as written vs. resolved.
3. **Two-column body** (`lg:grid-cols-[minmax(0,1fr)_290px]`):
   - **Log** on the left. A sticky chip toolbar (All / Deviations / For you / Discoveries / As
     planned, each with a count) sits over a vertical timeline. Each entry has a mono time
     column, a rail dot, a type badge, a serif title, and a body.
   - **Sidebar** on the right (sticky on `lg`) with a "Plan vs. build" list: each plan step and
     its outcome (`as planned` in olive, `changed · D1` / `dropped · D3` in clay). Below it, a
     short callout defining what "conservative" meant for this run.
4. **Entry types**, each with its own badge and dot color:
   - *As planned*: olive outline dot. One or two lines with the files touched and any
     verification.
   - *Discovery*: gray. Prior art or facts found that the plan didn't know, which didn't force a
     change.
   - *Deviation N of M*: solid clay dot. A 4-row definition list: **Plan said**, **Code
     revealed** (with file:line and numbers), **Conservative call** (clay-tinted row), and
     **Revisit**.
   - *For you*: solid rust dot. A decision the agent should not make (product, legal, contract).
     State current behavior, the alternative, and its cost.
5. **Fold-back panel** (dark, full width): "What this changes about attempt #2". Give 3–5
   numbered bullets, each a generalizable lesson for the plan template (not a recap), plus a
   **Copy bullets** button that copies a plain-text version.

## Build steps

1. Append entries in real time while building (time, type, title, body). Don't reconstruct the
   log at the end.
2. For each deviation, write "Plan said" verbatim from the plan, then the evidence. Choose the
   option that is easiest to loosen later and never widens access or blast radius.
3. Link each deviation that needs a human to its "For you" entry, and the reverse.
4. Fill the plan-vs-build sidebar from the plan's step list so that every step has an outcome.
5. Write the fold-back bullets last. Each one should prevent a whole class of surprise ("search
   for an existing source of truth before adding a table"), not repeat one incident.

## Key snippets

```html
<main x-data="{ f: 'all', show(t) { return this.f === 'all' || this.f === t } }">
  <div class="sticky top-0 z-10 py-3 bg-ivory/90 backdrop-blur border-b border-[#d1cfc5] flex flex-wrap gap-2" role="toolbar">
    <template x-for="c in [['all','All',12],['dev','Deviations',4],['human','For you',2]]" :key="c[0]">
      <button type="button" @click="f = c[0]" :aria-pressed="f === c[0]"
        :class="f === c[0] ? 'bg-[#141413] text-ivory border-[#141413]' : 'bg-white border-[#d1cfc5] hover:border-[#141413]'"
        class="font-mono text-xs border rounded-full px-3 py-1.5"><span x-text="c[1]"></span> <span class="opacity-60" x-text="c[2]"></span></button>
    </template>
  </div>
  <ol class="relative m-0 p-0 list-none">
    <span class="absolute left-[55px] top-3 bottom-3 w-0.5 bg-[#d1cfc5]" aria-hidden="true"></span>
    <li x-show="show('dev')" class="grid grid-cols-[46px_20px_minmax(0,1fr)] pb-6">
      <span class="font-mono text-xs text-clay-dark pt-1">10:05</span>
      <span class="mx-auto mt-2 w-3 h-3 rounded-full bg-clay"></span>
      <div class="pl-3"><!-- badge, title, dl --></div>
    </li>
  </ol>
</main>
```

```html
<!-- Deviation definition list row; the chosen call gets the tint -->
<div class="grid sm:grid-cols-[150px_1fr] gap-x-4 gap-y-1 px-4 py-3 bg-[rgba(217,119,87,0.08)]">
  <dt class="font-mono text-[11px] uppercase tracking-[0.05em] text-clay-dark">Conservative call</dt>
  <dd class="m-0">Fall back to an in-process bucket sized <code>limit ÷ 6</code>…</dd>
</div>
```

## Interaction

- Chips filter by entry type with `x-show`. One continuous rail element under the list keeps the
  timeline intact when entries hide.
- Cross-links between a deviation and its "For you" entry reset the filter before scrolling:
  `@click.prevent="f = 'all'; $nextTick(() => document.getElementById('h1').scrollIntoView())"`.
- "Copy bullets" uses the foundations copy button and reads a hidden `<pre x-ref>` with a
  plain-text version (no markup), ready to paste into the next prompt.

## Pitfalls

- Deviations without evidence ("seemed better"). "Code revealed" needs a path, a number, or a
  quote.
- Picking the clever option instead of the conservative one, or making product calls silently.
- "For you" items mixed into deviations. The reader then can't find what's blocking them.
- Fold-back bullets that just restate the log. They should change the plan template.
- Long inline code overflowing at 380px. Set `overflow-wrap: anywhere` on `code`.

## Combines well with

- [`implementation-plan.md`](implementation-plan.md): the plan this log deviates from, and where
  the fold-back bullets go.
- [`change-quiz.md`](change-quiz.md): after the build, verify the reviewer understands the result.

## Checklist

- [ ] Every deviation has Plan said / Code revealed / Conservative call / Revisit.
- [ ] Human decisions are their own entry type and are linked from their deviation.
- [ ] The plan-vs-build sidebar accounts for every plan step.
- [ ] Filter counts match the entries; filtering never breaks the rail.
- [ ] The fold-back bullets copy as clean plain text.
