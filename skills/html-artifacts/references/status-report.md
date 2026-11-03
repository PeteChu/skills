# Pattern: Status report

A skimmable weekly (or sprint) status page: stat band, TL;DR, what shipped, what slipped and
why, one small trend chart, next week, and asks. It is built for a Monday-morning read on a phone.

- **Example:** [`examples/status-report.html`](../examples/status-report.html)
- **Source inspiration:** `11-status-report.html` in
  [ThariqS/html-effectiveness](https://github.com/ThariqS/html-effectiveness)
- **Interactive:** no (static by default)

## Use when

- "Write the weekly status", "summarize last sprint", "what did the team ship", "Monday update".
- The input is a time window of PRs, deploys, tickets, or incident notes, and the readers are
  stakeholders who will skim it and not open the links.
- For a single incident, use [`incident-report.md`](incident-report.md). To explain one PR in
  depth, use [`pr-writeup.md`](pr-writeup.md).

## Reader's job

In under a minute, know three things: what landed, what didn't and when it will, and whether
anything needs them. The title and TL;DR must answer all three without scrolling.

## Anatomy

1. **Header**: eyebrow (`<Project> · <team> · weekly status`), a title that states the headline
   ("Week 44: X shipped, Y slipped a week"), a mono meta line (date range, repo@branch, counts,
   generated-at), and the prompt box.
2. **Stat band**: 4 stat cards (`grid-cols-2 md:grid-cols-4`). Each has a number, a label, and a
   delta vs. last period. Give the card that needs attention a rust border. Pick metrics the
   readers care about (a business SLO), not only PR counts.
3. **TL;DR panel**: 3 bullets with a bold lead clause. One for the best news, one for the slip,
   one for the incident or risk. Link the bullet to the "Asks" section if a decision is needed.
4. **Shipped / Slipped** side by side (`lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]`):
   - Shipped: a data table with columns PR (mono, clay), What changed, Owner, Risk (dot + label).
     List 6–10 notable rows and summarize the rest in one mono line with the git command.
   - Slipped: one card per item with a left color bar (clay = slipped, rust = blocked, gray =
     deprioritized), a status chip, `→ new date · owner`, title, and a one-sentence reason.
5. **Trend chart**: one small inline SVG bar chart of the metric that tells this week's story.
   Show this period against the previous one, with a dashed target/SLO line and one annotation
   pointing at the cause ("#2291 deployed Wed").
6. **Next week + Asks** (`md:grid-cols-2`): a numbered list with an owner per row, plus a clay
   callout for decisions needed (who, by when, what changes based on the answer) and FYIs.

## Build steps

1. Gather sources for the window: `git log --merges <prev-tag>..<tag>`, the deploy log, the
   tracker (planned vs. done), and incident channels. Record them in the meta line.
2. Diff plan against reality first. Every planned item is either shipped or slipped. Each slip
   needs a reason and a new date (or "TBD" plus the blocker).
3. Choose the one chart. Plot the metric that changed and explain it with an annotation. Avoid
   generic velocity charts unless velocity is the story.
4. Write the title and TL;DR last, from the content above. The title is a sentence, not
   "Status — Week 44".
5. Keep it static and short. If it doesn't fit in about two phone screens above the chart,
   cut rows.

## Key snippets

```html
<!-- Slipped card -->
<article class="bg-white border border-[#d1cfc5] border-l-4 border-l-clay rounded-xl px-5 py-4">
  <div class="flex flex-wrap items-center gap-2 mb-1.5">
    <span class="inline-flex border border-[rgba(217,119,87,0.55)] rounded-full bg-[rgba(217,119,87,0.12)] px-2.5 py-0.5 font-mono text-[11px] text-clay-dark">slipped 1 wk</span>
    <span class="font-mono text-[11px] text-[#87867f]">→ Nov 9 · Tomás Ruiz</span>
  </div>
  <h3 class="font-serif font-medium text-[17px] text-[#141413] m-0 mb-1">Dunning v2 retry schedules</h3>
  <p class="text-sm m-0">Backfill for 41,206 open invoices took 3 h on staging; splitting into resumable batches.</p>
</article>
```

```html
<!-- Risk cell -->
<td class="px-4 py-3 align-top font-mono text-xs whitespace-nowrap dot dot-med">Med</td>
```

```css
.dot::before { content: ""; display: inline-block; width: 7px; height: 7px; border-radius: 50%; margin-right: 7px; vertical-align: 1px; }
.dot-low::before { background: #788c5d; } .dot-med::before { background: #d97757; } .dot-high::before { background: #b04a3f; }
```

Chart recipe: `viewBox="0 0 720 206"`, baseline at y=160, a fixed px-per-unit scale, bars in
fixed slots (`x = 56 + 44*i`, width 28). Previous period bars are `#e3dacc`. Current period bars
are olive under target and clay over it. Draw the target as a `stroke-dasharray` line labeled at
the right edge, outside the bars. Put value labels inside the bar tops so they never collide
with the target line. Wrap the SVG in `overflow-x-auto` with `min-w-[600px]`.

## Pitfalls

- A title that only names the week. It should state the headline.
- A slip with no reason or no new date. That is the line readers look for.
- A long table of every chore PR. Show the notable ones and count the rest.
- Grid children holding wide tables without `min-w-0`, which makes the page overflow on mobile.
- A chart with no annotation. Readers can't tell why the line moved.
- Labels on top of bars colliding with the SLO line. Put them inside the bars or at the edge.

## Combines well with

- [`incident-report.md`](incident-report.md): link the week's incident to its full write-up.
- [`svg-figures.md`](svg-figures.md): for chart construction details beyond one bar chart.

## Checklist

- [ ] Title and TL;DR answer shipped / slipped / needs-you without scrolling.
- [ ] Every slipped item has a reason, owner, and new date or blocker.
- [ ] Stat cards show deltas vs. last period; the attention card is visually distinct.
- [ ] One chart, labeled, with a target line and an annotation for the cause.
- [ ] Sources and generated-at time appear in mono metadata.
