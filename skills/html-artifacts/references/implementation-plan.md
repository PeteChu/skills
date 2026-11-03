# Pattern: Implementation plan

A hand-off plan another engineer (or agent) can execute as-is: summary numbers, milestones, data
flow diagram, mockups, the risky code, risks, and open questions. It flags the judgment calls the
reader might reverse.

- **Example:** [`examples/implementation-plan.html`](../examples/implementation-plan.html)
- **Source inspiration:** `16-implementation-plan.html` and `unknowns/08-implementation-plan.html`
  in [ThariqS/html-effectiveness](https://github.com/ThariqS/html-effectiveness)
- **Interactive:** optional. Static by default. Add Alpine toggles for flagged decisions and a
  Copy summary (the tweakable variant).

## Use when

- "Write an implementation plan", "plan this feature", "spec this out so I can hand it off",
  "what would it take to build X", "break this into milestones".
- The approach is decided (see [`code-approaches.md`](code-approaches.md) if not) and the work
  spans several packages, tables, or PRs.
- The plan will be read on a phone or forwarded. A Markdown plan would bury the diagram and risks.

## Reader's job

Decide "yes, build this" or "change these two things" in one pass. The implementer then works
top to bottom without asking where anything lives.

## Anatomy

1. **Header**: eyebrow (`Implementation plan · <product>`), feature-name title, prompt box.
2. **Summary strip**: 4 cells in `grid-cols-2 md:grid-cols-4` (effort, packages/surfaces, new
   tables, feature flag). Put effort in clay.
3. **Section chips**: anchor links to each section. Tint the "decisions" chip clay.
4. **01 Milestones**: vertical timeline. Each slice gets a time box, a title, 1–2 sentences, and
   package chips. Each slice must be independently reviewable and land behind the flag.
5. **02 Data flow**: inline SVG with clay for the path that must be correct (unattended,
   idempotent, hot) and gray for the rest. Add a one-line caption legend.
6. **03 Decisions** *(the flagged calls)*: one card per judgment call, showing the plan's pick,
   its cost, and the alternative with "pick this if…".
7. **04 Mockups**: 1–2 low-fidelity HTML mockups that settle placement and content, not pixels.
8. **05 Key code**: the 1–2 snippets most likely to be done wrong (migration, concurrency, cache
   reconcile), with file paths. Do not include boilerplate.
9. **06 Risks**: table with Risk / Sev chip (HIGH rust, MED clay, LOW neutral) / Mitigation.
10. **07 Open questions**: cards, each ending in `Decide with · <who>, before <slice>`.
11. **Mechanical work**: one collapsed `<details>` with the plumbing tasks, labeled "safe to skip".
12. **Hand-off summary**: olive-bordered aside with a Markdown recap and a Copy button.

## Build steps

1. Read the code that will change. Every path, table, job name, and flag must be real.
2. Slice by reviewability (schema → core logic → UI → rollout), not by layer of the stack.
3. Draw the data flow before writing prose. If the diagram is hard to draw, the design is unclear.
4. Mark every place where you chose between two reasonable options. Those become section 03. If
   there are none, say so in a sentence and drop the section.
5. Push renames, fixture updates, OpenAPI regen, and flag registration into the collapsed list.
6. Write the hand-off summary last. It is what gets pasted into the ticket.

## Key snippets

A decision card with an in-place alternative (Alpine):

```html
<article class="bg-white border rounded-xl p-6" :class="d1 === 'alt' ? 'border-clay' : 'border-[#d1cfc5]'">
  <header class="flex items-start justify-between gap-3">
    <h3 class="font-serif font-medium text-[20px] text-[#141413] m-0">When is the invoice created?</h3>
    <button type="button" @click="d1 = d1 === 'pick' ? 'alt' : 'pick'" :aria-pressed="d1 === 'alt'"
      class="shrink-0 font-mono text-xs border border-[#d1cfc5] rounded-lg px-3 py-1.5"
      x-text="d1 === 'pick' ? 'View alternative →' : '← Plan’s pick'"></button>
  </header>
  <div x-show="d1 === 'pick'"><p class="font-mono text-[11px] text-olive">PLAN’S PICK · …</p>…</div>
  <div x-show="d1 === 'alt'" x-cloak><p class="font-mono text-[11px] text-clay-dark">ALTERNATIVE · …</p>…<p>Pick this if …</p></div>
</article>
```

Make the code follow the toggle. Wrap the variant lines inside the `<pre>` and keep each newline
*inside* its span, so hiding a span removes the line:

```html
<pre class="…"><span x-show="d2 === 'pick'"><span class="chg">  interval_unit text,
  anchor_day    int,</span>
</span><span x-show="d2 === 'alt'" x-cloak><span class="chg">  rrule text not null,</span>
</span>  timezone text not null,</pre>
```

```css
.chg { background: rgba(217,119,87,.22); border-radius: 3px; } /* lines a decision controls */
```

The summary is a getter (`get summary()`) that reads `d1`/`d2` and recomputes effort, rendered
with `x-text` in a `<pre class="whitespace-pre-wrap">`.

## Variant: the tweakable plan

Use this when the user says "lead with what I'm likely to change" or "I trust you on the
plumbing". Reorder the whole plan by **likelihood of tweaking**, not execution order:

- A sort banner at the top: `↑ tweak ↓ trust`, plus one sentence explaining the order.
- **Section A, Decisions** (clay badge): data model with flagged columns, new type interfaces with
  numbered margin notes (`①` on the line, the reasoning beside it), and the UX flow as a step strip
  with the **weakest step** called out in rust.
- **Section B, Sequencing**: numbered build order with a day estimate per step.
- **Section C, Mechanical** (olive badge): a collapsed `<details>` ("8 tasks · ~0.5d, folded into
  estimates above").
- End with **"Tweak these three things"**: 3 one-line replies, each with its own Copy button.

## Pitfalls

- Execution order presented as the only order. Put decisions where the reviewer will see them.
- Effort without slices, or slices that can't ship independently.
- Key code that's boilerplate. Show the concurrency, migration, or reconcile logic instead.
- Open questions with no owner or deadline.
- Alternatives that are strawmen. Each "pick this if" must describe a real situation.

## Combines well with

- [`code-approaches.md`](code-approaches.md): settle the approach first, then plan the pick.
- [`flowchart.md`](flowchart.md): when the data flow needs more than one diagram.

## Checklist

- [ ] Summary strip, milestones, data flow, risks, and open questions are all present.
- [ ] Every judgment call is flagged with the plan's pick, its cost, and a real alternative.
- [ ] Mechanical work is collapsed and labeled safe to skip.
- [ ] Paths and names are real. Code is escaped. The hand-off summary copies.
