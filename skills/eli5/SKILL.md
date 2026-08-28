---
name: eli5
description: >-
  Explain a topic like I'm 5: a picture-heavy HTML artifact with few words, one consistent
  metaphor, and a story anyone can follow. Invoked manually via /eli5 <topic>.
disable-model-invocation: true
---

# eli5

Produce a picture explainer: one HTML artifact that teaches a mechanism to someone who
knows nothing about it. Big pictures, few words.

**Before writing any HTML, read the two bundled references shipped with this skill** —
they are local files, not platform skills; do not search the filesystem beyond this
folder for them:

- `references/artifact-design.md` — the design pass: palette, type, both-theme tokens,
  layout, and publishing. Mandatory for every artifact.
- `references/artifact-diagramming.md` — when a picture earns its place, and the
  inline-SVG mechanics that keep it legible in both themes.

What follows is the ELI5 layer neither of them provides — the brief itself.

## Assume zero knowledge; explain by metaphor

The reader has never seen the thing. The job is not "simplified" — it is *translated*.
Pick one concrete metaphor the reader already lives with (a treehouse with rooms, a mail
carrier, a puppet and a hand) and let that single metaphor carry the whole mechanism.
Every real term the topic needs gets introduced inside the metaphor first, real name
attached second: "The rooms are *channels*. Each room has a `#` name." Never use a real
term the metaphor hasn't earned yet.

The bar is a curious ten-year-old. Five is the idiom; ten is the comprehension target.

## Few words is the format, not a decoration diet

Prose blocks run at most three short sentences. What would be a paragraph becomes a
caption, a bullet, or a picture. Diagramming's rule — "if a sentence says it faster,
write the sentence" — runs in reverse here: **if a picture says it faster, delete the
sentence.** Stronger still, if a *specimen* says it faster, delete both: a fake profile
card carrying a BOT tag, one sample chat message, a three-line rules snippet shown as the
thing itself teaches more than any description of it. Show the artifact; don't describe
the artifact.

No glossary section. Definitions live where they are used — inside captions and
specimens.

## One metaphor, one world

The page doesn't just explain the subject; it *looks like* the subject's own world. The
Discord explainer is styled as Discord — profile-card hero, `#` channels, the app's own
accent. This is the metaphor and the design language being one decision. When following
the design reference's process step, derive the palette and objects from the subject's world,
not a generic scheme, and run its editorial review against the AI-default looks it
forbids.

Emoji may appear only where the subject itself would contain them (inside a chat
message, on a dice roll) — never as section markers or decoration.

## The story arc

One claim per section, eyebrows labeling the movement:

1. **Open on the thing itself** — hero: what it is in one sentence, beside a specimen of
   it (a profile card, the real UI, the object itself).
2. **Set the world** — establish the metaphor with the first picture.
3. **The mechanism** — the core diagram: the few hops or parts the whole topic turns on.
   This is the section the page exists for. Every hop the prose narrates must appear in
   the picture — a step that lives only in a text tile or inside the demo's buttons is
   not drawn yet.
4. **Variations** (optional) — the common flavors, as a quiet tile grid. Number nothing
   that isn't actually a sequence.
5. **The reveal** — what it really is underneath the metaphor. The "the robot is the
   puppet, the human is the hand" moment: the one insight the reader keeps.
6. **Your turn** — the live version, next section.
7. **So, in one picture** — the whole topic compressed to one line and one image.

## Your turn: one live moment

End the body with a working miniature of the thing — a clickable demo, a real input, an
actual roll of the dice. All the page's boldness is spent here; everything before it
stays quiet. It must genuinely work from the saved file: no network, and animation that
respects `prefers-reduced-motion`.

## Ship it

Name the page like a product — "The Clubhouse Robot", not "Discord Bot Explained" — and
put the explainer sentence in the publish `description`. Start the file with
`<!doctype html>` so the saved page stands alone in any browser, save it as
`<slug>.html` (or the user's path), and publish it. Reply with the path and one sentence.

Two bundled exemplars live in this folder: `clubhouse-robot.html` (a finished page) and
`worked-example-eli5.md` (its build trace). Read them when a page isn't landing.
