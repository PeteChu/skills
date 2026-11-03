---
name: explain-pr
description: Turn the current branch into a reviewable PR — plain-language summary, pseudocode of the core change, show-me visuals, a Mermaid diagram when flow is non-obvious, and TDD test evidence. Optionally records a narrated Playwright video walkthrough, asking the user first. Use when opening a PR or when asked to make AI-authored changes easier to review.
disable-model-invocation: true
---

# Explain PR

Turn a branch into a PR a human can review in minutes: plain prose, pseudocode, visual shapes, and proof the tests pin the behavior. The reviewer should never have to reverse-engineer intent from raw hunks. Target the smallest artifact that carries the whole review.

## 1. Understand the change

- Diff against the base branch (`git diff <base>...HEAD`), plus commit messages. Read the hunks and the code around them.
- List the **behavior changes**: what the system or user can do now that it couldn't before (or no longer can). This list drives everything else — keep it to real behavior, not file-by-file narration.

## 2. Gather TDD evidence

- Run the project's test suite (its standard command). Record the command and the result.
- For each behavior change, name the test that pins it (`file:line`). If a behavior has no test, say so in the review — don't paper over it.
- Cheap red→green proof: if running the new tests against the base branch is quick and safe (scratch worktree or stash + targeted test run), do it and report "fails on base, passes on branch". Skip when it isn't cheap; the behavior→test table plus a green suite is the evidence floor.

## 3. Build the review artifact

The deliverable is one focused HTML file, built to show-me's artifact rules: match the product's colors, type, spacing, and components; real labels and data; works on desktop and mobile. Smallest view that makes the point; visuals next to the text they support. Sections, in order:

- **What changed** — 2–4 sentences: the behavior changes and why. No hunk-by-hunk narration.
- **The core change, in pseudocode** — show-me pseudocode or diff block: the logic shift itself, not the whole file.
- **How it flows** — one Mermaid sequence or flowchart, only if the control/data flow is non-obvious from the diff. Render with mermaid.js from a CDN; skip the section entirely when the diff is obvious.
- **Test evidence** — behavior→test table (`behavior | path/to/test.spec.ts:42`) plus the suite line: command, N passed / 0 failed, red→green note if verified.
- **Review guide** — where to start reading, what's mechanical vs. worth scrutiny.

Link code that already reads fine; don't paste it.

## 4. Deliver the review locally

Default: write the artifact to `pr-review-<branch>.html` at the repo root and open it — `Bash(open path/to/pr-review-<branch>.html)` — never push, never run `gh pr create`/`gh pr edit` unless the user explicitly asks for a PR. Only then open it with `gh pr create` (or update in place with `gh pr edit`), converting the same content to a markdown body.

## 5. Offer the video walkthrough — ask first

After delivering the review, ask exactly once:

> Want a narrated video walkthrough of this change? I'd drive the running app with Playwright and talk you through it. Slower to produce; needs Playwright + ffmpeg + a TTS voice.

If declined, or the change has no runnable UI, stop here — the review is done.

If accepted:

1. Write the narration script first: one short sentence per step, steps = the demo path through the changed feature, matching what will be on screen at that moment.
2. Record the running app, never the review artifact: launch the frontend the way the project actually runs it (check package.json / README / docker-compose for the dev command), wait for it to serve, then drive it with Playwright (`video: 'on'` context) through the demo path — real navigation, real clicks on the changed feature. The video's whole job is something the review artifact can't do: prove the feature works in the product. Recording the `pr-review-*.html` file instead is a text slideshow of notes about the feature, not the feature — if you catch yourself pointing Playwright at any file this skill generated, stop. If the change has no UI surface the app exposes, say so and skip the video rather than substitute a recording of anything else.
3. Narrate: TTS each script line (`say -o step-N.aiff` on macOS, or whatever TTS CLI exists), concatenate in order, mux over the recording with ffmpeg, trimming to match.
4. Deliver `pr-walkthrough-<branch>.mp4` next to the repo and open it for the user. If a PR was opened and the user wants it there: GitHub's API can't attach video — tell them to drag the file into the PR description, or upload it as a release asset and link that.
