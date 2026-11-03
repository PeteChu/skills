# Pattern: Code review

The reviewer's side of a PR: a verdict up front, a risk map that jumps to files, annotated diffs
with severity-tagged comments inline, low-risk files collapsed, and a before-merge checklist.

- **Example:** [`examples/code-review.html`](../examples/code-review.html)
- **Source inspiration:** `03-code-review-pr.html` in
  [ThariqS/html-effectiveness](https://github.com/ThariqS/html-effectiveness)
- **Interactive:** no (native anchors, `<details>`, and checkboxes only)

## Use when

- "Review this PR", "review my diff", "what needs to change before merge", "is this safe to ship",
  "where should I look first in this PR".
- You are judging someone else's change. For explaining your own change to reviewers, use
  [`pr-writeup.md`](pr-writeup.md).
- The diff spans several files with uneven risk. For a one-file nit, plain chat is enough.

## Reader's job

Know the verdict in 10 seconds, see where the risk is concentrated, read only the risky hunks with
the comment beside the exact line, and leave with a checklist.

## Anatomy

1. **Header**: eyebrow (`Code review · <repo> · pull request #N`), PR title as h1, a mono meta
   row (author initials avatar, `branch → main`, `+N / −M · K files`, CI state), prompt box.
2. **Verdict row** (`md:grid-cols-[1fr_300px]`):
   - Verdict callout. Use a rust border for request changes, olive for approve, and clay for
     approve with comments. One sentence on what is right, then the blocking issues as bullets.
   - Comment tally card: one chip per severity with counts.
3. **01 Risk map**: a proportional bar (segment width = lines changed, color = risk) where every
   segment is an `<a href="#f-…">`. Below it, a chip row for the risky files, a "N safe files"
   chip, and a legend.
4. **02 Files, riskiest first**: open file cards for anything rust or clay. Each card has:
   - A header with the path, risk chip, and `+N −M`.
   - A dark diff using the foundations diff rows. Mark the commented lines with `.hot` (clay inset bar).
   - **Inline comment** blocks inserted directly after the line they discuss. Each one has a severity
     chip, a mono `line N` anchor, the reasoning with evidence, and a fix snippet when it helps.
5. **Safe files**: `<details class="fold">` per file with one or two sentences saying why it's safe.
   Say what's *missing* there too (e.g. "tests are all sequential").
6. **03 Before merge**: an ordered checklist of native checkboxes. Each item is tagged with its
   severity. End with an estimated fix time and which files need re-review.

## Severity scale

| Tag        | Chip color              | Meaning                                     |
| ---------- | ----------------------- | ------------------------------------------- |
| blocking   | rust tint               | Wrong behavior, data loss, security, outage |
| should fix | clay tint               | Real bug in an edge case or ops hazard      |
| question   | white + gray border     | Intent unclear, so ask instead of asserting |
| nit        | `#f0eee6` + muted text  | Style, naming, docs drift                   |
| praise     | olive tint              | Name what to keep doing (at least one)      |

## Build steps

1. Read the whole diff and the code it calls before writing anything. Classify each file as rust,
   clay, or olive.
2. For every blocking comment, give **evidence**: a repro, a number, or the caller that breaks.
   Never write "this might be a problem".
3. Order files by risk, not alphabetically. Write the inline comments, then the verdict, then
   the checklist that mirrors the blocking and should-fix comments.
4. Build the risk bar last, with `grow-[N]` set to each file's changed-line count.

## Key snippets

Risk bar segment (keeps a minimum width so tiny files stay clickable):

```html
<div class="flex h-12 rounded-lg overflow-hidden border border-[#d1cfc5] font-mono text-[11px]">
  <a href="#f-ratelimit" title="src/middleware/rateLimit.ts · +19"
     class="grow-[19] basis-0 min-w-[28px] bg-rust text-white grid place-items-center truncate px-1 hover:brightness-110">rateLimit</a>
  <a href="#f-tests" class="grow-[58] basis-0 min-w-[28px] bg-olive/30 grid place-items-center border-l border-white">tests</a>
</div>
```

Inline comment between diff rows:

```html
<div class="row add hot"><span class="ln">16</span><span class="mk">+</span><span class="bd">  await redis.set(bucket, used + 1);</span></div>
<div class="bg-white border-y border-[#d1cfc5] px-4 py-3 font-sans text-[13.5px] whitespace-normal">
  <p class="m-0"><span class="font-mono text-[11px] rounded-full px-2 py-0.5 mr-2 bg-[rgba(176,74,63,0.10)] text-rust border border-[rgba(176,74,63,0.45)]">blocking</span>
  <span class="font-mono text-[11px] text-[#87867f] mr-2">lines 11–16</span>Read-then-write is not atomic…</p>
</div>
```

```css
.diff .row.hot { box-shadow: inset 3px 0 0 #d97757; }
.file:target { box-shadow: 0 0 0 3px rgba(217,119,87,.4); }        /* flash the jumped-to card */
.step:has(input:checked) label { text-decoration: line-through; color: #87867f; }
```

Use the diff row CSS and `details.fold` CSS from `foundations.md`.

## Pitfalls

- Comments listed under the diff instead of beside their line, which forces the reader to match
  line numbers.
- Every file expanded. Collapse anything safe, or the risky hunks get lost.
- A verdict that doesn't match the tally (e.g. "approve" with two blocking comments).
- No praise. One genuine "keep this" makes the rest land better.
- Unescaped `<`/`>` in TypeScript generics inside diff rows.

## Combines well with

- [`pr-writeup.md`](pr-writeup.md): the author-side counterpart. Review the writeup's "focus" list first.
- [`blindspot-pass.md`](blindspot-pass.md): follow up on what the diff *doesn't* touch.

## Checklist

- [ ] Verdict and severity tally are at the top and agree with each other.
- [ ] The risk map links to every file, and files are ordered by risk.
- [ ] Each comment sits under its line, has a severity, and blocking ones have evidence.
- [ ] Safe files are collapsed with a reason, and the before-merge checklist mirrors the blockers.
