# Pattern: Animation sandbox

Isolate one transition on a bench next to what ships today, with sliders for duration, distance,
and the cubic-bezier handles. Draw the easing curve and a filmstrip of sampled frames, show readouts
like time-to-arrive and overshoot, and generate copy-paste CSS.

- **Example:** [`examples/animation-sandbox.html`](../examples/animation-sandbox.html)
- **Source inspiration:** `07-prototype-animation.html` in
  [ThariqS/html-effectiveness](https://github.com/ThariqS/html-effectiveness)
- **Interactive:** yes (Alpine + Web Animations API).

## Use when

- "This animation feels slow / floaty / janky", "tune the easing", "prototype the transition for X",
  "what duration should this be".
- A micro-interaction (toast, drawer, checkbox, sheet, list insert) needs to be **felt**, not
  described.
- Choosing between easing presets, or explaining why one curve feels better.
- For a flow of several screens, use [`clickable-prototype.md`](clickable-prototype.md). For a
  static diagram of a motion spec, use [`svg-figures.md`](svg-figures.md).

## Reader's job

Press replay, move a slider, and feel the difference against the baseline. Then copy the CSS. The
current production values must always be on screen for comparison.

## Anatomy

1. **Header**: eyebrow (`Prototype · <app> · motion`), title naming the transition, prompt box, and a
   mono line with today's values and their file (`420ms ease-in-out · translateY(24px) in
   Toast.module.css:12`), plus the replay shortcut.
2. **Bench**: two synchronized lanes, "Shipped today" (gray frame) and "Your settings" (clay frame),
   each a small mock surface with the real element. Above them: Replay, slow-mo ×4, loop, include
   exit, and a live progress readout.
3. **Controls panel**: preset chips (Expo out, Spring-ish, Emphasized, Ease-in-out, Linear) and range
   sliders for duration, distance, start scale, and x1/y1/x2/y2. Add "Reset to recommended".
4. **Readouts**: stat cards for time to 95% (with the delta against today), overshoot %, frames at
   60 Hz, and travel distance.
5. **Curve + filmstrip**: an SVG plot of your curve (clay) against today's (gray dashed) and linear
   (dotted), with control handles, a shaded overshoot zone, and a playhead dot. Beside it, nine equal
   time slices showing the element's offset, scale, and opacity. Add a lifecycle bar (enter / hold /
   exit).
6. **Output**: a generated CSS panel (keyframes, the exit rule if enabled, and a
   `prefers-reduced-motion` fallback) with Copy. Beside it, a "what to feel for" aside with concrete
   numbers.

## Build steps

1. Find the real transition: file, duration, easing, transform, and delays. Those become the
   baseline lane and the comparison numbers.
2. Rebuild only the animated element with its real look (size, colors, copy) on a neutral mock
   surface. Leave out the rest of the app.
3. Drive playback with `el.animate(keyframes, { duration, easing, fill: 'both' })` so changes apply
   on the next replay with no CSS juggling. Cancel previous animations first.
4. Compute everything from the bezier: sample `y(x)` by bisection to get the filmstrip, the 95%
   arrival time, and the overshoot. Do not hand-write these numbers.
5. Generate the CSS from state with a getter. Always include the reduced-motion fallback.
6. Write the "feel for" notes from the computed numbers, e.g. "half visible by 25ms vs 210ms today".

## Key snippets

```js
bez(a, b, t) { const u = 1 - t; return 3*u*u*t*a + 3*u*t*t*b + t*t*t; },
yAt(x) {                                   // progress at time fraction x
  let lo = 0, hi = 1, t = x;
  for (let i = 0; i < 32; i++) { t = (lo + hi) / 2; (this.bez(this.x1, this.x2, t) < x) ? lo = t : hi = t; }
  return this.bez(this.y1, this.y2, t);
},
play(el, dur, easing, dist) {
  el.getAnimations().forEach(a => a.cancel());
  el.animate([{ opacity: 0, transform: `translateY(${dist}px)` }, { opacity: 1, transform: 'none' }],
             { duration: dur * (this.slow ? 4 : 1), easing, fill: 'both' });
},
```

```html
<svg viewBox="0 0 270 290" role="img" aria-label="Easing curve, yours vs today">
  <path :d="currentPath" stroke="#87867f" stroke-width="2" stroke-dasharray="6 4" fill="none"/>
  <line :x1="X(0)" :y1="Y(0)" :x2="X(x1)" :y2="Y(y1)" stroke="#d97757" opacity=".6"/>
  <path :d="tunedPath" stroke="#d97757" stroke-width="3" fill="none"/>
  <circle :cx="X(p)" :cy="Y(yAt(p))" r="5" fill="#141413"/>   <!-- rAF playhead -->
</svg>
```

Leave room above `y = 1` in the plot (`Y = 210 - y*120` in a 290-tall viewBox) so spring overshoot
is visible rather than clipped.

## Interaction

- **Replay plays both lanes together.** Bind it to a button and to the `R` key (ignore the key when
  focus is in an input).
- Sliders use `x-model.number` and replay on `@change` (release), not on `@input`, so dragging does
  not restart the animation on every frame.
- Preset chips set all four handles. The active preset is **derived** by matching values, so
  dragging a handle shows "custom".
- Slow-mo multiplies durations ×4, and loop re-triggers after the full lifecycle.
- The filmstrip and curve are bindings, not `x-for` inside `<svg>`. Use HTML for repeated frames,
  because Alpine templates do not work in the SVG namespace.
- Copy uses `navigator.clipboard` with a `textarea` fallback.

## Pitfalls

- No baseline lane: without one, "better" is unmeasurable.
- An exit animation enabled by default leaves the element invisible at rest, so screenshots and
  first loads look broken.
- Hard-coded readouts that do not update when sliders move.
- Animating layout properties (`top`, `height`) in the generated CSS. Prefer `transform` and
  `opacity`.
- Forgetting `prefers-reduced-motion`.

## Combines well with

- [`clickable-prototype.md`](clickable-prototype.md): drop the tuned transition into a flow to feel
  it in context.
- [`design-system.md`](design-system.md): promote the winning duration and easing to motion tokens.

## Checklist

- [ ] Today's values are on screen as a lane, a curve, and a delta in the readouts.
- [ ] Duration, distance, and all four bezier handles are adjustable, and presets mark themselves
      active.
- [ ] The curve, filmstrip, and readouts are computed from the same bezier.
- [ ] Replay works by button and keyboard, and slow-mo and loop work.
- [ ] Generated CSS is copyable and includes a reduced-motion fallback.
