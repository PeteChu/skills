# Themes: dress the page in the topic's world

An ELI5 page is easiest to follow when it _looks like the place the explanation happens_.
If DNS is a post office, the page should look like envelopes, stamps and a sorting room. If a
mortgage is a piggy bank, it should look like coins, jars and receipts. The theme does
comprehension work: every specimen, frame and diagram reminds the reader which world they are
in. This file turns that idea into a repeatable choice.

Read it after picking the metaphor and before writing the design plan. The theme gives you the
plan's starting point, which you then tune to the exact subject.

## 1 · Pick the world

Work down this list and stop at the first match:

1. **The user named a theme.** For example "theme: space", "make it a storybook" or "pirate
   style". Use it, even if it is not one of the families below. Build it on the token
   contract in §2.
2. **The subject has its own recognizable world**, such as an app, a product, a game, a sport
   or a real place. Use **Native UI**: the page looks like the thing itself, the way the
   Discord explainer looks like Discord (`clubhouse-robot.html`).
3. **Otherwise the metaphor's world is the theme.** Match the metaphor you chose to a family
   in the table. The metaphor and the theme are one decision. If the metaphor is a post
   office, the theme is Postal, whatever the topic's field.
4. **No family fits.** Build a custom theme on the contract in §2 and §3. Name it in the
   plan, like the families below.

| Family          | Reach for it when the topic is…                                 | Example topics                                             |
| --------------- | --------------------------------------------------------------- | ---------------------------------------------------------- |
| **Native UI**   | a product, app, platform or game with a look people know        | Discord bots, Git(Hub) PRs, Excel formulas, chess openings |
| **Blueprint**   | a machine or system that is _built_ from parts                  | CPUs, engines, compilers, 3D printers, databases           |
| **Postal**      | something that _moves_ from a sender to a receiver through hops | DNS, the internet, email, APIs, packets, supply chains     |
| **Storybook**   | an abstract or social idea with no physical form                | how AI learns, fairness, voting, feelings, privacy         |
| **Field Guide** | living things or the natural world                              | vaccines, photosynthesis, evolution, weather, digestion    |
| **Toy Lab**     | matter, energy or forces you could test on a bench              | electricity, chemistry, magnets, light, sound              |
| **Game Board**  | rules, turns, chance or step-by-step procedures                 | sorting, recursion, probability, encryption, game theory   |
| **Market**      | money, value or trade                                           | mortgages, interest, inflation, taxes, stocks              |
| **Star Chart**  | very big or very far things, or very long spans of time         | black holes, orbits, light-years, relativity, deep time    |
| **Museum**      | the past, institutions or culture                               | how laws are made, the printing press, empires, languages  |

State the pick in the design plan in one line, with the reason: "Theme: Postal, because DNS is
told as a letter finding its address." A family is a starting point, not a uniform. Tune its
accent, objects and type to the specific subject, and still run the editorial review against
the AI-default looks in `artifact-design.md`.

## 2 · The token contract

Every theme uses the **same token names**. A theme then changes only values, never
structure, and the component CSS can stay the same across pages:

| Token          | Role                                                                                                                                                                       |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--bg`         | the page ground. `body` paints it explicitly                                                                                                                               |
| `--surface`    | cards, specimens, figure panels. Running text sits on `--bg` or `--surface` only                                                                                           |
| `--line`       | hairlines, borders, grid paper. Decoration only, never text                                                                                                                |
| `--ink`        | headings, body text and diagram labels. Must reach **7:1** on `--bg` and `--surface`                                                                                       |
| `--dim`        | captions, secondary text, quiet diagram strokes. Must reach **4.5:1**                                                                                                      |
| `--accent`     | the one hue that carries meaning, such as the hop under discussion. Must reach **3:1** as a mark                                                                           |
| `--on-accent`  | text placed on an `--accent` fill. Must reach **4.5:1** against it                                                                                                         |
| `--accent-ink` | the accent used as text, such as eyebrows and links. Must reach **4.5:1**                                                                                                  |
| `--pop`        | a second, fill-only highlight (coins, stars, stickers). It always carries `--on-pop` text or an `--ink` outline, because bright yellows cannot reach 3:1 on a light ground |
| `--on-pop`     | text placed on a `--pop` fill. Must reach **4.5:1**                                                                                                                        |

Add `--surface2`, `--shadow`, `--go` and `--warn` when the page needs them. They follow the
same both-theme rule. Never use `--faint` grey for text: a grey that is "quiet" in dark
mode usually fails in light mode.

Every family below ships light and dark values that have already been checked against
these ratios. If you change a value, re-check its pair.

## 3 · Readability rules every theme obeys

The theme is a costume. It must never make the words harder to read.

- **Body text stays plain.** Body text is at least 17px with a line-height of at least 1.55,
  set in the theme's body face and kept under 60ch. Never justify it, put it in all caps or set
  long runs in italics.
- **Decorative faces stay short.** The display face is for `h1`/`h2` only. A handwritten,
  stencil or arcade face is for labels of four words or fewer. A whole sentence in a novelty
  face is a readability bug.
- **Textures stay out from behind words.** Grid paper, star fields, grain or gingham can sit
  in the hero ground and inside figure panels. Running text always sits on a flat `--bg`
  or `--surface`. Keep textures faint, around 6–12% opacity in `--line` or `--ink`.
- **The costume has an intensity budget.** The hero and the live demo wear the full theme.
  The mechanism diagram wears it in its frames and objects. Prose sections stay quiet, with
  only an eyebrow and the specimen's styling. If every section is in full costume, no
  section stands out.
- **Color is never the only signal.** Pair each meaningful color with a label, an icon or a
  shape. "The red letter is lost" also needs the letter to look crumpled or carry a ✕ label.
- **Specimens stay legible at a glance.** A fake receipt, envelope or placard is set at body
  size or larger. If it needs a magnifier to read, it is decoration, not a specimen.
- **Check both themes on the drawings themselves.** Text inside an SVG takes `--ink`,
  `--on-accent` or `--on-pop`, matched to the fill directly behind it. A literal hex in the
  drawing is fine only for a fill that carries no text, such as a robot's paint or a coin's face.

## 4 · Light and dark, with a toggle that starts from the system

Every ELI5 page ships both themes **and** a visible toggle. The page first follows the
viewer's system setting. The toggle lets them flip it, for example to show a kid the bright
version on a dark laptop. The choice is remembered, and choosing the system's own theme
again returns the page to following the system.

**CSS: the three-state token pattern from `artifact-design.md`, plus `color-scheme`.** The
toggle works by writing `data-theme` on `<html>`, so the explicit `[data-theme]` blocks are
required, not optional. Light-first is shown here. A dark-first family swaps light and dark
throughout.

```css
:root {
  color-scheme: light;
  /* the theme's complete light tokens */
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;
    /* the theme's dark tokens */
  }
}
:root[data-theme="dark"] {
  color-scheme: dark;
  /* the same dark tokens again */
}
body {
  background: var(--bg);
  color: var(--ink);
}
@media (prefers-reduced-motion: no-preference) {
  body {
    transition:
      background-color 0.25s,
      color 0.25s;
  }
}

.theme-toggle {
  position: fixed;
  top: 14px;
  right: 14px;
  z-index: 10;
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--ink);
  cursor: pointer;
}
.theme-toggle:focus-visible {
  outline: 3px solid var(--accent-ink);
  outline-offset: 2px;
}
.theme-toggle svg {
  width: 20px;
  height: 20px;
}
.theme-toggle[data-mode="dark"] .i-moon,
.theme-toggle[data-mode="light"] .i-sun {
  display: none;
}
```

**Before first paint.** Put this in `<head>`, before the `<style>`, so a remembered choice
never flashes the wrong theme:

```html
<script>
  try {
    var saved = localStorage.getItem("eli5-theme");
    if (saved === "light" || saved === "dark")
      document.documentElement.setAttribute("data-theme", saved);
  } catch (e) {}
</script>
```

**The button.** Put it as the first child of `<body>`. It shows the icon of the theme it
will switch _to_, and its label says what happens:

```html
<button class="theme-toggle" type="button" aria-label="Switch to dark theme">
  <svg class="i-moon" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"
      fill="currentColor"
    />
  </svg>
  <svg class="i-sun" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="4.5" fill="currentColor" />
    <path
      d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    />
  </svg>
</button>
```

**The behavior.** Put this at the end of the page's script:

```js
(function () {
  var root = document.documentElement;
  var btn = document.querySelector(".theme-toggle");
  var mq = matchMedia("(prefers-color-scheme: dark)");
  var KEY = "eli5-theme";
  function system() {
    return mq.matches ? "dark" : "light";
  }
  function current() {
    var t = root.getAttribute("data-theme");
    return t === "light" || t === "dark" ? t : system();
  }
  function paint() {
    var mode = current();
    btn.setAttribute("data-mode", mode);
    btn.setAttribute(
      "aria-label",
      mode === "dark" ? "Switch to light theme" : "Switch to dark theme",
    );
  }
  btn.addEventListener("click", function () {
    var next = current() === "dark" ? "light" : "dark";
    try {
      if (next === system()) {
        // Back to the system's own theme, so follow the system again.
        root.removeAttribute("data-theme");
        localStorage.removeItem(KEY);
      } else {
        root.setAttribute("data-theme", next);
        localStorage.setItem(KEY, next);
      }
    } catch (e) {
      root.setAttribute("data-theme", next);
    }
    paint();
  });
  mq.addEventListener("change", paint);
  paint();
})();
```

Storage is a per-viewer convenience: every read and write is wrapped, and the page still
renders correctly when storage is blocked. When a host page stamps `data-theme` itself, the
toggle simply starts from that stamp.

Before publishing, flip the toggle both ways and look at every figure, specimen and demo
state in both themes. The toggle makes the second theme one click away for every reader,
so it gets the same care as the first.

## 5 · The families

Each family lists its tokens (contrast-checked in both modes), a type pairing from Google
Fonts, the objects that make the world, how its diagrams are drawn, and what its live moment
usually is. All type pairings set body text in a face built for easy reading.

### Native UI

- **World:** the product itself, including its real chrome, objects and accent.
- **Tokens:** sample them from the product's own light and dark modes, then map them onto the
  contract and check every pair against §2. A product's brand color often fails as text, so
  derive a darker or lighter `--accent-ink` from it when needed.
- **Type:** the product's own feel, using the closest Google Fonts face. Keep the body face
  readable even if the product's isn't.
- **Objects:** the product's real UI pieces as specimens, such as a profile card, a channel
  list, a commit row or a cell with a formula.
- **Live moment:** a working miniature of the product.
- **Exemplar:** `clubhouse-robot.html`.

### Blueprint

```text
light  --bg:#EEF3F8; --surface:#FFFFFF; --line:#C3D3E4; --ink:#10233B; --dim:#3F5672; --accent:#1F5FAD; --on-accent:#FFFFFF; --accent-ink:#1A4F91; --pop:#E0A100; --on-pop:#1A1400;
dark   --bg:#0F2A4A; --surface:#163659; --line:#3A6491; --ink:#F3F7FC; --dim:#BCD0E6; --accent:#FFC845; --on-accent:#1A1400; --accent-ink:#FFD670; --pop:#7FC4FF; --on-pop:#06213D;
```

- **World:** a workshop drawing board. Light mode is drafting paper and dark mode is a
  classic blueprint.
- **Type:** Barlow Semi Condensed (display, engineering labels), Atkinson Hyperlegible (body),
  IBM Plex Mono (part numbers, readouts).
- **Objects:** a title block naming the machine, numbered part callouts, an exploded view,
  dimension lines and a cutaway.
- **Diagrams:** thin even line work, dashed lines for hidden parts and leader lines from each
  part to its label. `--accent` marks the part the section is about.
- **Live moment:** take a part out and watch the machine stop, or turn the crank and watch it
  run.

### Postal

```text
light  --bg:#F3F5F9; --surface:#FFFFFF; --line:#CCD5E0; --ink:#14213D; --dim:#475569; --accent:#C8202F; --on-accent:#FFFFFF; --accent-ink:#B11E2F; --pop:#1D4E89; --on-pop:#FFFFFF;
dark   --bg:#131A2A; --surface:#1B2438; --line:#34425E; --ink:#EEF2F8; --dim:#B3BED0; --accent:#FF5A67; --on-accent:#1B0A0D; --accent-ink:#FF8A93; --pop:#7DB3F5; --on-pop:#0B1A30;
```

- **World:** airmail envelopes, stamps and a sorting office at night.
- **Type:** Overpass (display, signage feel), Lexend (body), Overpass Mono (addresses,
  postmarks).
- **Objects:** an addressed envelope as the hero specimen, postage stamps, postmarks as
  timestamps, sorting bins and a route map.
- **Diagrams:** a transit-map route where stations are hops and the line is the path.
  Numbered stops are fine because the route is a real sequence. `--accent` marks the letter in
  flight.
- **Live moment:** type an address and watch the letter hop from station to station until it
  arrives.

### Storybook

```text
light  --bg:#EAF4FB; --surface:#FFFFFF; --line:#BCD6E8; --ink:#1F2A44; --dim:#4A5878; --accent:#2C78B8; --on-accent:#FFFFFF; --accent-ink:#1F5F96; --pop:#F2B200; --on-pop:#2A1E00;
dark   --bg:#1A2140; --surface:#232C52; --line:#3E4A7A; --ink:#F4F6FF; --dim:#C2C8E6; --accent:#8FC3FF; --on-accent:#0D1B33; --accent-ink:#A9D1FF; --pop:#FFC93C; --on-pop:#2A1E00;
```

- **World:** a picture book. Light mode is a daytime sky and dark mode is a bedtime story.
  Avoid the cream-paper look.
- **Type:** Baloo 2 (display), Andika (body, designed for early readers).
- **Objects:** named characters who carry the idea, speech bubbles, and page spreads with
  the picture on one side and one line of text on the other.
- **Diagrams:** soft round shapes and characters moving between scenes. The mechanism is
  told as "first… then… so…" panels.
- **Live moment:** choose what happens next, and the story branches to show the consequence.

### Field Guide

```text
light  --bg:#F0F5EC; --surface:#FFFFFF; --line:#C6D4BD; --ink:#1D2B1F; --dim:#4B5E4D; --accent:#2E7D4F; --on-accent:#FFFFFF; --accent-ink:#256B42; --pop:#D9822B; --on-pop:#231200;
dark   --bg:#18221C; --surface:#203028; --line:#355040; --ink:#EEF5EE; --dim:#B9CBBC; --accent:#7CC99A; --on-accent:#0E2416; --accent-ink:#9AD9B2; --pop:#F0A85A; --on-pop:#2A1600;
```

- **World:** a naturalist's notebook, with specimen cards and annotated sketches. Keep the
  dark green soft, never acid on near-black.
- **Type:** Bitter (display), Lexend (body), Kalam (handwritten annotations of four words
  or fewer).
- **Objects:** specimen cards that give the everyday name first and the real term second,
  magnifier circles that zoom from body to organ to cell, and a life-cycle wheel.
- **Diagrams:** sketches with leader-line notes and zoom insets connected by guide lines. The
  cycle is drawn as a loop, not a list.
- **Live moment:** a scale slider that zooms in through levels, or a dial (sunlight, germs,
  temperature) whose effect you watch happen.

### Toy Lab

```text
light  --bg:#EEF6F6; --surface:#FFFFFF; --line:#C2D9D9; --ink:#132C33; --dim:#44606A; --accent:#00808C; --on-accent:#FFFFFF; --accent-ink:#006C76; --pop:#C2255C; --on-pop:#FFFFFF;
dark   --bg:#10252A; --surface:#173238; --line:#2F5560; --ink:#ECF7F8; --dim:#AFCBD0; --accent:#3CC6D2; --on-accent:#062226; --accent-ink:#6AD7E0; --pop:#FF6B9E; --on-pop:#2A0614;
```

- **World:** a kid's science kit, with beakers, meters and labeled knobs.
- **Type:** Rubik (display, bold), Atkinson Hyperlegible (body), JetBrains Mono (meter
  readouts).
- **Objects:** beakers with fill levels, gauges, before-and-after jars, particles drawn as
  dots, and a labeled control panel.
- **Diagrams:** a setup diagram (source → thing → meter) with the moving stuff drawn as
  particles along the path. `--pop` marks the reaction moment.
- **Live moment:** turn a knob and the readout and particles respond. Change one variable
  at a time.

### Game Board

```text
light  --bg:#EEF1FF; --surface:#FFFFFF; --line:#C3CCF2; --ink:#1B1F3B; --dim:#4A4F75; --accent:#D62F3C; --on-accent:#FFFFFF; --accent-ink:#B5121F; --pop:#FFB703; --on-pop:#261A00;
dark   --bg:#17152B; --surface:#221F3D; --line:#403B6B; --ink:#F4F2FF; --dim:#C1BCE6; --accent:#FF5C6C; --on-accent:#26060A; --accent-ink:#FF8C97; --pop:#FFD166; --on-pop:#261A00;
```

- **World:** a tabletop game. Light mode is a bright board and dark mode is an arcade
  cabinet in deep violet.
- **Type:** Bungee (display only, never body), Rubik (body), DM Mono (move log, scores).
- **Objects:** board squares, tokens, dice, cards, a rule card, a score counter and a move
  log as the specimen.
- **Diagrams:** the board itself, with tokens at each state and arrows for moves. Number the
  moves because turns are a real sequence.
- **Live moment:** play it. A "Next move" button steps the procedure one turn at a time with
  a move counter, plus a "Shuffle" or "Roll" to try again.

### Market

```text
light  --bg:#EFF5F1; --surface:#FFFFFF; --line:#C1D6CA; --ink:#142A21; --dim:#46604F; --accent:#1E7A52; --on-accent:#FFFFFF; --accent-ink:#17663F; --pop:#D9A400; --on-pop:#231A00;
dark   --bg:#13201A; --surface:#1A2B23; --line:#31503F; --ink:#EEF6F1; --dim:#B4CABD; --accent:#4FC28A; --on-accent:#072015; --accent-ink:#78D3A5; --pop:#F2C14E; --on-pop:#231A00;
```

- **World:** a market stall and a piggy bank, with banknote green and coin gold.
- **Type:** Bricolage Grotesque (display), Nunito Sans (body), Courier Prime (receipts).
- **Objects:** a receipt as the specimen, price tags, labeled jars (save, spend, owe), coin
  stacks and a payment calendar.
- **Diagrams:** money as coins that physically move between jars. Charts are coin stacks
  with `tabular-nums` totals. Interest is the extra coins that appear, drawn in `--pop` with
  an ink outline.
- **Live moment:** sliders (amount, rate, years) with live math, where the coin stacks and
  totals update together.

### Star Chart

```text
light  --bg:#ECEFFA; --surface:#FFFFFF; --line:#C2CBE6; --ink:#141B3A; --dim:#464F78; --accent:#2F5BD3; --on-accent:#FFFFFF; --accent-ink:#2449B0; --pop:#F0A030; --on-pop:#1F1300;
dark   --bg:#0E1530; --surface:#161F42; --line:#33407A; --ink:#F2F4FF; --dim:#BAC2E8; --accent:#FFB454; --on-accent:#2A1600; --accent-ink:#FFC77D; --pop:#8FB8FF; --on-pop:#0A1433;
```

- **World:** a star atlas. Dark mode is a deep navy night (not near-black) and light mode is
  a printed atlas page.
- **Type:** Jost (display), Lexend (body), DM Mono (coordinates, distances).
- **Objects:** star catalog cards, constellation connect-the-dots, orbit paths, and scale bars
  with comparisons such as "if Earth were a marble".
- **Diagrams:** orbits and scale comparisons drawn to a stated scale, or explicitly marked
  "not to scale". Draw a star field on canvas, faintly, in the hero and figure panels only.
- **Live moment:** a scale slider, or an orbit you can play and pause. It respects
  `prefers-reduced-motion` by starting paused.

### Museum

```text
light  --bg:#E9EEF0; --surface:#FFFFFF; --line:#C7D0D4; --ink:#1E2328; --dim:#4F5A61; --accent:#7A2E4D; --on-accent:#FFFFFF; --accent-ink:#7A2E4D; --pop:#B8892B; --on-pop:#1E1500;
dark   --bg:#1C1A22; --surface:#26232E; --line:#433E50; --ink:#F3F0F7; --dim:#C3BCD0; --accent:#E58FB4; --on-accent:#2A0E1B; --accent-ink:#F0A9C7; --pop:#E2B65A; --on-pop:#231800;
```

- **World:** a gallery visit. Light mode has cool stone walls and dark mode is the gallery
  after hours, with mulberry and brass accents.
- **Type:** Marcellus (display, inscription feel), Source Sans 3 (body and placards).
- **Objects:** wall placards as specimens (title, date, one line), display cases, a timeline
  rail with dated pins, and "then and now" pairs.
- **Diagrams:** a timeline (numbering and dates are fine because time is a real sequence) or a
  room-by-room floor plan where each room is a step.
- **Live moment:** drag through time and watch the scene change, or match each object to its
  era.
