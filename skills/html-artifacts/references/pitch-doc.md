# Pattern: Pitch (buy-in) doc

Once the work is built, the last unknown is other people. This pattern packages the prototype,
spec, and notes into one skimmable doc that leads with a working demo, answers reviewer
objections before anyone raises them, and names who must sign off on what, by when.

- **Example:** [`examples/pitch-doc.html`](../examples/pitch-doc.html)
- **Source inspiration:** `unknowns/10-pitch-doc.html` in
  [ThariqS/html-effectiveness](https://github.com/ThariqS/html-effectiveness)
- **Interactive:** yes, lightly (looping demo with pause/replay, objection `<details>`, Copy Slack post; Alpine)

## Use when

- "Write this up so I can get buy-in / sign-off", "package this for #launch", "make the case
  for shipping X", "one doc I can drop in Slack".
- The decision is **ship / don't ship** for something that already exists (prototype, flag,
  branch), and specific people have to approve specific pieces.
- For "here's what changed in this PR", use [`pr-writeup.md`](pr-writeup.md). For a choice
  between options not yet built, use [`code-approaches.md`](code-approaches.md). For a periodic
  update, use [`status-report.md`](status-report.md).

## Reader's job

Busy approvers read the top, watch the demo, open the one objection they care about, find their
own name, and reply ✓. Each approver should be able to act within two minutes.

## Anatomy

1. **Header**: eyebrow (`Ship proposal · <product> · <team>`), a read-time chip, a title stating
   the claim ("X is ready to ship"), a lead with the **ask in bold** (N sign-offs by date → what
   it unlocks), a prompt box, and a **sign-off strip** of chips (initials · area · pending/✓)
   linking to the needs section.
2. **01 Watch it work**: a looping demo in a fake app window (title bar dots and file/page
   name). It shows the real flow in 4–5 beats (select → act → preview → apply → confirmation),
   with a caption that narrates the current beat and pause/replay buttons.
3. **02 The pitch**: one serif paragraph covering the problem, the evidence, what it does, and
   why it's safe, plus 4 evidence stat cards, each with a mono source line.
4. **03 What reviewers will ask**: 4–6 `<details>`, the first one `open`. Each has a mono `Q1`
   tag, the question in the reviewer's words, an answer with numbers, and a `↗ spec §x` evidence
   link.
5. **04 Spec at a glance**: an Area / Decision / Ref table covering fields, entry point,
   permissions, limits, audit, telemetry, and flag ramp.
6. **05 Risk, rollback, and what I need from you**: two cards.
   - Risk (clay left border): rollback, blast radius, worst credible failure, known gap.
   - Needs (olive left border): one row per approver with avatar, name, role, the **specific
     thing** they approve (with spec ref), and their status.
7. **Bottom line**: an oat bar restating the ask and target date, with a **Copy Slack post**
   button.

## Build steps

1. Gather the sources: the prototype, the spec, implementation/load-test notes, and the ticket
   or survey data. Every number in the doc needs one of these behind it.
2. Write the objections first. List what each approver's function always asks (security: data
   exposure, audit; infra: load, new services; product: rollout, comms; design: states). Answer
   each with a number or mechanism, then add a link.
3. Map approvers to the exact decision each owns. "Review the doc" is not an ask.
4. Build the demo from the real UI states. Use fictional but plausible data, and show the
   safety affordance (preview, undo) because that pre-answers an objection.
5. Write the pitch paragraph last, and keep it under about 110 words.

## Key snippet

```html
<div x-data="demo()" x-init="start()">
  <div class="relative bg-[#f0eee6] border border-[#d1cfc5] rounded-xl overflow-hidden select-none">
    <!-- title bar + mock table; cells read state: x-text="applied && sel.includes(i) ? r.due2 : r.due" -->
    <div x-cloak :class="modal ? 'opacity-100' : 'opacity-0 pointer-events-none'"
      class="absolute inset-0 bg-[rgba(20,20,19,0.38)] grid place-items-center p-4 transition-opacity duration-300">…preview…</div>
  </div>
  <div class="flex justify-between mt-2.5 font-mono text-[11px] text-[#87867f]">
    <span x-text="caption"></span>
    <button type="button" @click="toggle()" x-text="playing ? 'Ⅱ pause' : '▶ play'"></button>
  </div>
</div>
```

```js
play() {
  this.reset();
  [0, 2, 3].forEach((row, n) => this.at(600 + n * 450, () => this.sel.push(row)));
  this.at(2350, () => { this.modal = true; this.caption = 'preview: exactly what will change'; });
  this.at(4550, () => { this.modal = false; this.applied = true; this.toast = true; });
  this.at(7800, () => { if (this.playing) this.play(); });
},
```

## Interaction

- The demo is a timeline of `setTimeout` beats kept in `timers[]`. `reset()` clears them, so
  replay and pause never stack loops.
- Show overlays (modal, toast) with **class-bound opacity transitions** instead of
  `x-show` + `x-transition`. That keeps the state deterministic even if a leave transition never
  fires.
- When `prefers-reduced-motion` is set, render the final frame statically and say so in the
  caption.
- Objections use native `<details>`; the evidence links jump to `#spec`.
- Export: **Copy Slack post** copies a short plain-text summary from a hidden `<pre x-ref>` that
  names the ask, each approver's item, and the date.

## Pitfalls

- Burying the demo below the prose. The demo is the first thing after the header.
- Objections written as softballs, or answered without a number, mechanism, or link.
- Vague asks ("thoughts?") or an approver list with no per-person decision and no date.
- Hiding the known gap. Naming it builds more trust than leaving it out.
- A demo whose state drifts across loops because old timers were not cleared.

## Combines well with

- [`clickable-prototype.md`](clickable-prototype.md): link the full prototype from the demo
  caption.
- [`implementation-notes.md`](implementation-notes.md): the source for objection evidence and
  load-test numbers.

## Checklist

- [ ] The ask (who, what, by when) appears in the lead, the sign-off strip, the needs card, and
      the bottom line.
- [ ] The demo loops cleanly, pauses, replays, and respects reduced motion.
- [ ] Every objection answer has a number or mechanism and a `↗` reference.
- [ ] Risk card covers rollback, blast radius, worst failure, and known gap.
- [ ] Copy Slack post produces a standalone summary.
