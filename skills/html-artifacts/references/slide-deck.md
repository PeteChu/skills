# Pattern: Slide deck

A short presentation in one HTML file. Each slide is a full-viewport section, scroll-snap moves
between them, and arrow keys, a counter, a progress bar, and dot nav make it feel like a deck.
Sections are plain HTML, so it still reads top to bottom when scrolled.

- **Example:** [`examples/slide-deck.html`](../examples/slide-deck.html)
- **Source inspiration:** `09-slide-deck.html` in
  [ThariqS/html-effectiveness](https://github.com/ThariqS/html-effectiveness)
- **Interactive:** yes (arrow keys / Space / Home / End, prev-next buttons, dot nav, live counter; Alpine)

## Use when

- "Make slides for…", "turn this into a deck", "something I can present at standup / eng
  review / demo day".
- The content is a **talk**: one idea per screen, presented in order, usually ending on an ask.
- The audience will see it on a shared screen or step through it alone. For a document people
  skim at their own pace, use [`status-report.md`](status-report.md) or
  [`pitch-doc.md`](pitch-doc.md) instead.

## Reader's job

Take in one claim per slide in a few seconds, then move on. Every slide title is a full-sentence
takeaway ("Conflict tickets fell 81% after launch"), not a label ("Results").

## Anatomy

1. **Title slide**: small SVG ornament, mono eyebrow (`Team · meeting · date`), a big serif
   title, a one-line subtitle that previews the ask, a compact prompt box, and a byline (`8 slides
   · ~6 min · presenter · ← → or scroll`).
2. **Body slides** (5–8 total), each with the same shell: an eyebrow (section name), a takeaway
   `h2`, then **one** visual unit. Pick from:
   - 3 big-number stats with top rules (problem slide)
   - an inline SVG architecture strip (what we built)
   - an SVG bar chart with an annotated event line, plus 3 stat cards (results)
   - a numbered list with status chips on the right (what went wrong)
3. **Decision slide**, inverted (`bg-[#141413] text-ivory`): a question as the title and two
   option cards, the leaning one bordered in clay with an "Our lean" badge, plus a deadline and
   owner line.
4. **Next steps slide**: 3–5 serif lines with clay dashes.
5. **Sources / appendix slide**: a `<dl>` of where every number came from, followed by the
   footer.
6. **Fixed chrome**: a 3px clay progress bar at the top, a vertical dot nav on the right
   (`md:` and up), and a bottom-right `← 03 / 08 →` pill with a translucent ivory background so
   it stays readable on the inverted slide.

## Build steps

1. Write the slide titles first as a sequence of sentences that tell the story. If the titles
   alone don't make the argument, reorder before building.
2. Use one shell per slide:
   `section[data-slide][data-title] snap-start snap-always min-h-[100svh] flex items-center
   justify-center px-[6vw] py-[10vh]`, with an inner `max-w-[880px] w-full`.
3. Put `snap-y snap-mandatory` on `<html>` (the scrolling element), not on `body`.
4. Use `min-h` instead of `h` so a dense slide grows on phones instead of clipping.
5. Size type for a room: `h1` around `clamp(40px,6.4vw,68px)`, `h2` around `clamp(30px,4.2vw,44px)`,
   body 15–17px, stat numbers 56px serif.
6. End with an inverted decision slide when the deck exists to get an answer.

## Key snippet

```html
<html lang="en" class="snap-y snap-mandatory">
<body x-data="deck()" @keydown.window="key($event)">
  <div class="fixed top-0 left-0 h-[3px] bg-clay z-30 transition-[width] duration-300"
       :style="'width:' + ((cur + 1) / n * 100) + '%'"></div>
  <span class="fixed bottom-5 right-6 font-mono text-xs bg-ivory/90 border border-[#d1cfc5] rounded-full px-3 py-1.5" aria-live="polite"
        x-text="String(cur + 1).padStart(2, '0') + ' / ' + String(n).padStart(2, '0')">01 / 08</span>
  <section id="s4" data-slide data-title="Results"
    class="snap-start snap-always min-h-[100svh] flex items-center justify-center px-[6vw] py-[10vh]">
    <div class="w-full max-w-[880px]">
      <p class="font-mono text-xs tracking-[0.12em] uppercase text-[#87867f] m-0 mb-6">Results</p>
      <h2 class="font-serif font-medium text-[clamp(30px,4.2vw,44px)] leading-[1.14] tracking-tight m-0 mb-8">Conflict tickets fell 81% after launch</h2>
      <!-- one visual unit -->
    </div>
  </section>
```

```js
init() {
  this.slides = [...document.querySelectorAll('[data-slide]')];
  this.n = this.slides.length;
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) this.cur = this.slides.indexOf(e.target);
  }), { rootMargin: '-50% 0px -50% 0px' });   // the slide crossing the viewport midline
  this.slides.forEach((s) => io.observe(s));
},
go(i) { this.cur = Math.max(0, Math.min(this.n - 1, i)); this.slides[this.cur].scrollIntoView({ behavior: 'smooth' }); },
```

## Interaction

- Keys: →/↓/PageDown/Space go forward, ←/↑/PageUp/Shift+Space go back, Home/End jump to the
  ends. Call `preventDefault()` so the browser's own scroll doesn't double-step, and skip Space
  when a button has focus.
- Track the current slide with a **midline** `rootMargin` instead of `threshold: 0.6`. The
  threshold never fires for a slide taller than the viewport.
- Dot nav buttons get `aria-label="Slide N: <title>"` and `aria-current="step"`.
- Respect `prefers-reduced-motion` by turning off smooth scrolling.

## Pitfalls

- Walls of text on a slide. If a slide needs scrolling on desktop, split it.
- Topic titles ("Metrics") instead of takeaway titles.
- `h-screen` slides that clip on phones or short laptop screens. Use `min-h-[100svh]`.
- Scroll-snap set on `body` while `html` scrolls (or the reverse), which makes snapping silently
  do nothing.
- A counter or buttons that vanish on the dark slide. Give fixed chrome its own background.
- Numbers with no source. The appendix slide is cheap insurance.

## Combines well with

- [`svg-figures.md`](svg-figures.md): draw the architecture and chart visuals as figures first.
- [`status-report.md`](status-report.md): the same data as a skimmable doc for people who missed
  the meeting.

## Checklist

- [ ] Slide titles read as a story on their own, one claim each.
- [ ] Arrow keys, buttons, dots, counter, and progress bar all track the current slide.
- [ ] No slide clips at 1400×900 or overflows sideways at phone width.
- [ ] The decision slide names the options, the lean, the deadline, and the owner.
- [ ] Every number traces to a source on the appendix slide.
