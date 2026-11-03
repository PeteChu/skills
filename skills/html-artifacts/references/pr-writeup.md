# Pattern: PR writeup

The author's side of a PR: why the change exists, what behavior changes before vs. after, a
file-by-file tour in reading order with the *why* for each file, and exactly where reviewers
should spend their attention.

- **Example:** [`examples/pr-writeup.html`](../examples/pr-writeup.html)
- **Source inspiration:** `17-pr-writeup.html` in
  [ThariqS/html-effectiveness](https://github.com/ThariqS/html-effectiveness)
- **Interactive:** no (native `<details>`, anchors, sticky TOC)

## Use when

- "Write up this PR", "PR description for reviewers", "explain my change", "walk reviewers through
  this diff", "make this PR easy to review".
- You (or the agent) authored the change and reviewers lack context on the area.
- The diff touches more than about three files or changes runtime behavior. For judging someone
  else's PR, use [`code-review.md`](code-review.md).

## Reader's job

A reviewer who hasn't seen this code in months should understand the motivation in 30 seconds,
read the files in the right order, and spend most of their time on the 2–3 spots where a mistake
would hurt.

## Anatomy

1. **Header**: eyebrow (`Pull request · <repo>`), `#N: <title>` h1, a mono meta row (files,
   `+N / −M`, `branch → main`, author, flag), prompt box.
2. **Two-column body**: `lg:grid-cols-[minmax(0,1fr)_210px]` with a **sticky TOC** on the right
   (`hidden lg:block sticky top-6`). The TOC lists sections and nests the file links under "File by file".
3. **TL;DR panel**: what was wrong, what this does, and the headline number. 3–4 sentences.
4. **01 Why**: a lede on what changed in the world, then:
   - **Before/after panels**: two cards, each with 4 parallel bullets (rust dots before, olive
     dots after, olive border on after).
   - A **behavior figure** (inline SVG) when the change is about timing, flow, or shape. Show the
     same input under both behaviors.
   - **Stat cards**, including one honest **new cost** in clay that links to a focus item.
5. **02 File by file**: `<details class="fold">` per file **in reading order** (new core thing →
   its producer/caller → client → tests → infra). The core files are `open`. Each summary has the
   path, a `new`/`mod`/`tests` chip, and `+N −M`. The body starts with a bold role ("The heart of
   the PR.", "The producer."), then the why, then an optional short snippet.
6. **03 Where to focus**: 2–3 numbered cards. Each names a concept, links a `file:lines`, and says
   what could go wrong. Use the last card for **"What I deliberately did not do"**.
7. **04 Test plan**: rows with ✓ (olive) or ○ (pending, with when it will be done).
8. **05 Rollout**: 3 step cards (who / % / what to watch), or "no flag, merge = live" if true.

## Build steps

1. Read the full diff and `git log` for the branch. Find the one-sentence motivation and the one
   number that proves it.
2. Order files by how a newcomer should read them, not by path. Merge tiny related files into one
   entry ("tests", "infra").
3. Snippets show the **core 5–15 lines**. When a file mostly deletes code, show old lines struck
   through (`.gone`) and the new lines tinted (`.new`) in one panel instead of a full diff.
4. Write focus items by asking where a wrong line causes data loss, a double effect, or an outage.
   Link each one to its file entry.
5. List what was left out on purpose. That stops review comments asking for scope creep.

## Key snippets

File entry in reading order:

```html
<details id="f-stream" class="fold scroll-mt-6 border border-[#d1cfc5] rounded-xl bg-white overflow-hidden" open>
  <summary class="cursor-pointer px-4 py-3 flex flex-wrap gap-x-3 gap-y-1 items-center bg-[#f0eee6]">
    <span class="flex-1 min-w-0 font-mono text-[13px] text-[#141413] break-all">services/logs/src/stream.ts</span>
    <span class="font-mono text-[11px] rounded-full px-2 py-0.5 bg-[rgba(120,140,93,0.12)] text-olive border border-[rgba(120,140,93,0.45)]">new</span>
    <span class="font-mono text-xs text-olive">+94</span>
  </summary>
  <div class="p-5"><p class="m-0 mb-4"><strong class="text-[#141413]">The heart of the PR.</strong> …why…</p><!-- code panel --></div>
</details>
```

Focus item that links back into the tour:

```html
<li class="bg-white border border-[#d1cfc5] rounded-xl p-5 grid grid-cols-[36px_1fr] gap-3">
  <span class="font-serif text-[26px] leading-none text-clay">1</span>
  <div><p class="font-semibold text-[#141413] m-0 mb-1">Subscribe-then-backfill ordering</p>
  <p class="m-0 text-[14.5px]"><a href="#f-stream" class="font-mono text-[13px] text-clay-dark underline">stream.ts:6–8</a>. If swapped, …</p></div>
</li>
```

```css
.gone { color: #e08a7f; text-decoration: line-through; }               /* removed line in a snippet */
.new  { background: rgba(120,140,93,.22); border-radius: 3px; }       /* added line in a snippet */
.bullets li::before { content: ""; display: inline-block; width: 6px; height: 6px; border-radius: 50%; margin-right: 10px; vertical-align: 2px; }
.bullets.before li::before { background: #b04a3f; } .bullets.after li::before { background: #788c5d; }
```

## Pitfalls

- An alphabetical file list. Reading order is the main value of this pattern.
- Explaining *what* each file does (the diff shows that) instead of *why* it changed.
- Hiding the new cost. Reviewers trust a writeup that names its own tradeoff.
- Focus items that are vague ("check the logic"). Name the lines and the failure mode.
- Pasting the full diff. Link the PR and show only the lines that carry the idea.

## Combines well with

- [`code-review.md`](code-review.md): reviewers answer the writeup's focus list in a review artifact.
- [`change-quiz.md`](change-quiz.md): check that a reviewer actually understood the change.

## Checklist

- [ ] TL;DR states the problem, the change, and one proving number.
- [ ] Before/after panels are parallel, and the stat cards include one new cost.
- [ ] Files are in reading order, each with a role and a why, with core files open.
- [ ] 2–3 focus items with `file:lines` links, plus "what I did not do", a test plan, and a rollout.
