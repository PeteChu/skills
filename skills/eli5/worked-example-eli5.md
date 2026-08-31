# Worked example: how the two artifact skills produced `clubhouse-robot.html`

The invocation chain, then the rule-by-rule trace. Reference: the extracted definitions in
`artifact-design.md` and `artifact-diagramming.md` (same folder), output file `../clubhouse-robot.html`.

## 0 · The chain of skills

```
/eli5 Discord bot        ← user command
  └─ eli5 skill          ← "HTML artifact, big pictures, few words"  → sets the BRIEF
      └─ artifact-design ← mandatory load before authoring any artifact → sets the DESIGN PASS
          └─ artifact-diagramming ← loaded because the brief is picture-heavy → sets the DIAGRAM RULES
```

`artifact-design` is explicit that format is not a decision ("author HTML... Markdown is never a
shortcut past the design pass"), and that a plan must exist _before code_: color, type, layout as
named tokens.

## 1 · The pre-code plan (required by artifact-design's Process section)

> **Color**: Discord's native dark chat world — ground `#1E1F22`, panel `#2B2D31`, ink `#F2F3F5`,
> dim `#B5BAC1`, accent blurple `#5865F2`, semantic green `#23A55A`. Light mirrors Discord's real
> light mode (`#F2F3F5` / `#FFFFFF` / `#232428`).
> **Type**: Fredoka display (rounded — the brief _is_ ELI5) + Nunito body + JetBrains Mono for
> `/commands` and the rules snippet.
> **Layout**: one 880px column built from Discord's own objects — hero as a bot _profile popout_,
> mechanism as a chat-frame SVG, ends in a live mini-channel.

The design lead framing ("the subject's own world is where distinctive choices come from") is what
pushed the page from _an explainer about Discord_ to _an explainer that looks like Discord_. The
"editorial review" step ("if any part reads like the generic default you would produce for any
similar page, revise") killed the first instinct — a cream/serif/terracotta hero, which is exactly
the AI-default look the skill lists and forbids.

## 2 · Rule → decision → code

| Skill rule                                                             | Decision it produced                                                                                                                                                                                                                                         | Where in the file                             |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------- |
| design: "Ground it in the subject... vernacular"                       | Page styled _as_ Discord: profile popout hero with banner/avatar/BOT tag/status dot, `#` channels, blurple                                                                                                                                                   | `.profile`, `.banner`, `.bot-tag` (~L140–200) |
| design: "Choose neutrals, don't default" — grey with hue bias          | Ground is `#1E1F22`/`#EDEEF2` — Discord's own near-blurple-tinted greys, not `#333`/`#FAFAFA`                                                                                                                                                                | `:root` token block (L10–52)                  |
| design: "Design both themes" — 3 viewer states                         | Dark-first tokens on bare `:root`; `@media (prefers-color-scheme: light)` guarded with `:root:not([data-theme="dark"])`; `:root[data-theme="light"]` re-declares so an explicit choice wins both ways. Every color is a token; `body` background is explicit | L10–52, `body` L60                            |
| design: "Pair typefaces" + real fallbacks, ~65ch measure               | Fredoka/Nunito/JetBrains Mono via the one CSP-allowed host (Google Fonts), `font-family:"Nunito",system-ui,...`, `p{max-width:60ch}`, `text-wrap:balance` on headings                                                                                        | L54–62, 86                                    |
| design: "Avoid AI-generated design"                                    | No gradient hero (flat blurple banner), no emoji section markers (emoji appears only _inside_ bot chat text, where it is diegetic), no `rounded-lg`-everything, eyebrow labels are mono-uppercase not decoration                                             | throughout                                    |
| design: "Structure is information" — numbering only for real sequences | The flow diagram numbers steps `1 · YOU → 4 · TRICK` because it _is_ a sequence; the four trick tiles are unnumbered because it isn't                                                                                                                        | `.step .n` vs `.trick`                        |
| design: "Spend boldness in one place"                                  | The one orchestrated moment is the **live bot** at the end (tap `/roll` → typing dots → reply). Everything around it is quiet: flat panels, one accent                                                                                                       | demo section + `<script>`                     |
| design: "Name the page like a product"                                 | `<title>The Clubhouse Robot</title>` — a name, not "Discord Bot Explained"; the explainer sentence went into the publish `description` instead                                                                                                               | L2, artifact `description` param              |
| design: focus visible, reduced motion                                  | `:focus-visible` outline on buttons; `@media (prefers-reduced-motion: reduce)` kills the typing animation and smooth scroll                                                                                                                                  | L296, L340                                    |
| diagramming: "Depict the mechanism, not its name"                      | The flow shows the _hop_ a command actually takes (you → Discord the mail carrier → remote brain → reply) — the part prose can't show is that the brain lives "in a computer far away"                                                                       | `.flow` section                               |
| diagramming: "Match complexity to the stakes"                          | One-hop question → four small boxes, no legend, no inventory of Discord's real architecture                                                                                                                                                                  | `.flow`                                       |
| diagramming: "One figure, one claim"                                   | Every SVG wrapped in `<figure>`; each has `role="img"` + an `aria-label` stating the same claim the caption states                                                                                                                                           | treehouse SVG L226, rules block L330          |
| diagramming: "Size by viewBox"                                         | Treehouse drawn once at `viewBox="0 0 640 330"`, scaled by CSS (`max-width:100%;height:auto`) — never resized by editing coordinates                                                                                                                         | L229                                          |
| diagramming: "Theme with currentColor"                                 | Flow arrows, icons, and marker `#ah` all use `currentColor` so they resolve in both themes; literal color reserved for the one element that carries meaning (blurple = Discord itself, `#F0B232` = Botti's name)                                             | `.step .ic`, `<marker id="ah">`               |
| diagramming: "Stay self-contained" — `<use>` in-fragment               | One `<g id="robot">` defined in a hidden `<svg><defs>`, reused 5× via `href="#robot"`; no script/style/foreignObject inside any SVG                                                                                                                          | L347–368                                      |
| diagramming: "If a sentence says it faster, write the sentence"        | No diagram for "it has a BOT tag" or "tricks bots know" — those are a chat sample and a tile grid; SVG spent only where mechanism lives                                                                                                                      | sections 2 & 4                                |

## 3 · The brief's own constraint shaped the most

`eli5` demanded _big pictures, few words_. Every prose block is ≤3 short sentences; the
`figcaption`s carry what would have been paragraphs. The "if a sentence says it faster, write the
sentence" rule from diagramming ran in reverse: if a _picture_ says it faster, delete the sentence.
That's why section 2 ("A robot lives there too") is three bullets plus one fake chat message, not
a paragraph explaining what a BOT tag means — the tag in the fake message _is_ the explanation.

## 4 · What the skills vetoed along the way

- Cream + serif display + terracotta hero (the listed AI default) → replaced by Discord-native palette
- Purple-to-blue gradient hero → flat blurple banner with two faint circles
- A "glossary" section (Server/Channel/Command defined in a list) → folded into the treehouse
  figure's caption; three words didn't need a fourth section
- A theme toggle button → viewer's own theme controls it; the three-state token pattern handles
  the un-stamped default, so no JS toggle to maintain
