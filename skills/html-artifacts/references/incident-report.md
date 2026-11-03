# Pattern: Incident report (post-mortem)

A blameless post-incident review. It contains severity pills, a TL;DR, impact numbers, a
minute-by-minute timeline with a metric chart, the root cause with the offending diff, log
excerpts, what went well and what didn't, and action items that each have an owner and a date.

- **Example:** [`examples/incident-report.html`](../examples/incident-report.html)
- **Source inspiration:** `12-incident-report.html` in
  [ThariqS/html-effectiveness](https://github.com/ThariqS/html-effectiveness)
- **Interactive:** no (static by default)

## Use when

- "Write up the incident", "post-mortem for INC-…", "RCA", "what happened on Tuesday".
- The inputs are an incident channel, alerts, logs, a deploy or config history, and a known
  resolution.
- For a weekly roll-up that only mentions the incident, use [`status-report.md`](status-report.md).

## Reader's job

Answer three questions: what broke and for whom, why it broke, and what will stop it happening
again. Engineers verify the root cause from the diff and logs. Managers read the TL;DR, impact,
and action items.

## Anatomy

1. **Layout**: `lg:grid-cols-[170px_minmax(0,1fr)]` with a sticky "On this page" TOC on the left,
   hidden below `lg`. The main column is capped at `max-w-[900px]`.
2. **Header**: eyebrow (`Post-incident review · INC-ID · service`) and a title that names the
   symptom and the customer consequence. Below it, a pill row: severity (rust), status (olive
   when resolved), customer-impact duration, detected time with timezone, and IC. Add the prompt
   box.
3. **TL;DR**: a white panel with a rust left border. One paragraph covering trigger, mechanism,
   impact, mitigation, and data loss (yes or no).
4. **Impact**: 4 stat cards (affected units, money or users, peak metric, time to detect), then a
   two-column key/value table (tickets, data loss, availability, regions).
5. **Timeline**:
   - A **metric chart** (inline SVG line chart). Shade the impact window, draw dashed vertical
     markers for trigger, alert, mitigation, and resolution, include the alert threshold line,
     and label the peak.
   - A **vertical timeline**: a time column in mono, a rail with colored dots, then the text.
     Dot colors: gray for events, rust for impact start, clay for detection, olive for
     mitigation and resolution. Bold lead words ("Trigger.", "Detected.", "Mitigated.").
     Record dead ends ("~7 min spent here"). Blameless does not mean hiding them.
6. **Root cause**: 2 short paragraphs on the mechanism with numbers ("2,000 × 160 ms ≈ 320 s
   > 300 s limit"). Show the diff panel of the change, then a clay callout listing contributing
   factors (detection gaps, missing guards).
7. **Log excerpts**: a dark panel of trimmed log lines. Highlight the lines that prove the
   mechanism with a clay inset bar. Show the command used to fetch them.
8. **What went well / what didn't**: two cards with olive and rust top borders.
9. **Action items**: a checklist with rows of check, owner avatar initials, description, ticket,
   and due date. Done items are struck through. Every item has exactly one owner. End with
   sources and reviewers in mono.

## Build steps

1. Build the timeline first from raw timestamps: alerts, chat, deploy and config logs. Normalize
   to one timezone and say which.
2. Compute impact window, time-to-detect, and time-to-mitigate from the timeline. Do not
   estimate them separately.
3. Find the mechanism and show evidence: the diff that triggered it and the log lines that prove
   it. If the cause is still a hypothesis, say so in the TL;DR.
4. Chart the one metric that shows onset and recovery. Place event markers at the same timestamps
   as the timeline.
5. Turn each contributing factor and each "didn't go well" into an action item with an owner,
   ticket, and date. Remove items that have no owner.

## Key snippets

```html
<!-- Timeline row: time column, rail dot, body -->
<ol class="m-0 p-0 list-none relative border-l-2 border-[#d1cfc5] ml-[74px] sm:ml-[84px]">
  <li class="relative pl-6 pb-5">
    <span class="absolute -left-[74px] sm:-left-[84px] top-0.5 w-[60px] sm:w-[70px] text-right font-mono text-xs text-rust">14:04</span>
    <span class="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-rust"></span>
    <p class="m-0"><strong class="text-rust">Impact starts.</strong> First consumer leaves the group…</p>
  </li>
</ol>
```

```html
<!-- Action item row: collapses ticket/date under the text on mobile -->
<li class="grid grid-cols-[22px_34px_minmax(0,1fr)] sm:grid-cols-[22px_34px_minmax(0,1fr)_90px_70px] gap-x-3 gap-y-1 items-start px-4 py-3">
  <span class="mt-0.5 w-[18px] h-[18px] rounded-[5px] border-2 border-[#d1cfc5]" aria-label="open"></span>
  <span class="w-[30px] h-[30px] rounded-full bg-oat font-mono text-[11px] grid place-items-center" title="Marcus Lee">ML</span>
  <span class="text-sm">Alert on rebalance rate, not just absolute lag</span>
  <span class="col-start-3 sm:col-start-auto font-mono text-[11px] text-clay-dark">SHOP-4412</span>
  <span class="col-start-3 sm:col-start-auto font-mono text-[11px] text-[#87867f] sm:text-right">Nov 6</span>
</li>
```

```css
/* Log panel: highlighted proof lines */
.log .row { white-space: pre; padding: 0 14px; color: #b8b6ac; }
.log .hot { background: rgba(217,119,87,.16); color: #f0d2c4; box-shadow: inset 3px 0 0 #d97757; }
.log .lvl-w { color: #d9a557; } .log .lvl-e { color: #e08a7f; } .log .lvl-i { color: #a3b37f; }
```

Chart recipe: map time linearly (e.g. 7 px/min from x=60), shade the impact window with a
`fill-opacity="0.08"` rust rect, and draw the series as a clay `polyline`. Put marker labels
above the plot at alternating y offsets so neighbors don't overlap. Make the mitigation marker
solid olive and the others dashed gray.

## Pitfalls

- Blame language ("X forgot to…"). Describe systems and decisions instead.
- A timeline that skips the dead ends. Time-to-mitigate is unexplained without them.
- A root cause with no evidence (diff, logs, numbers).
- Action items with no owner or date, or vague ones like "be more careful".
- Mixed timezones between the chart, timeline, and logs.
- Unescaped `<`/`>`/`&` in log lines.

## Combines well with

- [`status-report.md`](status-report.md): the weekly report links here for the full story.
- [`flowchart.md`](flowchart.md): when the failure mechanism is a multi-hop flow worth drawing.

## Checklist

- [ ] Header pills: severity, status, duration, detected time (with TZ), IC.
- [ ] TL;DR covers trigger, mechanism, impact, mitigation, and data loss.
- [ ] Chart markers and timeline times match exactly.
- [ ] Root cause has a diff and highlighted log lines as evidence.
- [ ] Every action item has one owner, a ticket, and a due date.
