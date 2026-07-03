---
name: code-wiki
description: >-
  Use this skill whenever the user wants durable, source-cited documentation that explains how a codebase actually works — a persistent set of Markdown pages filed in the repo and maintained as the code changes. Trigger for: "document this repo/codebase", "read through the code and write up how it fits together", "build architecture docs" (data flow, component boundaries, request flow, how the pieces connect), "seed an onboarding / knowledge base", or deep-diving a package/subsystem that's a "black box". Also use it to refresh existing docs ("bring docs up to date", "sync with recent changes") and to answer "how does X work" durably, saving the answer into the wiki. Trigger even when the word "wiki" never appears — the intent is long-form, filed, system-level explanation grounded in real source. Skip for throwaway chat answers, a single diagram, inline comments/JSDoc, a lone README, runbooks, or docs-site setup like Docusaurus.
---

# code-wiki

A **code wiki** is a persistent set of Markdown pages, stored in the repository under `docs/code-wiki/`, that explain how the code works — grounded in real source with citations and diagrams. It is created and maintained _by the agent_ (you), but a small deterministic engine handles all the bookkeeping: path resolution, scaffolding, validation, and metadata. You never call an LLM through the engine; the engine is a transparent helper.

The engine is a single dependency-free Node.js 18+ script: **`scripts/code-wiki`**, sitting next to this file. Everything the engine does is visible JavaScript you can read.

## Mental model: who owns what

- **The engine owns the deterministic shell:** paths, the schema file, run state, validation, and `.code-wiki.json` metadata. Do not edit `.code-wiki-run.json`, `.code-wiki-prompt.md`, `.code-wiki-schema.md`, or `.code-wiki.json` by hand.
- **You own the content:** `00-index.md`, the numbered chapter pages (`01_*.md`, `02_*.md`, …), answer pages under `answers/`, and the prose in `log.md`. Source understanding and writing quality come from you.
- **Wiki artifacts are not source evidence.** Never cite `docs/code-wiki/**` as proof of how the code works — read the real source.

## The core loop (every action)

```
1. prepare <action>     → engine scaffolds + returns a canonical `prompt`
2. follow the prompt    → read source, write/refresh the named wiki files,
                          add exactly ONE new log heading
3. finalize <action>    → engine validates, writes metadata, cleans up
4. if ok:false          → read its `repairPrompt`, fix ONLY those files,
                          re-run finalize
```

The `prompt` returned by `prepare` is canonical and tailored to the action, the options, the source file map, and (for update/query) the files that changed. **Read it and follow it** rather than improvising the wiki structure — that is what keeps the wiki consistent across different agents. The prompt is the `prompt` field of the JSON output; on a large repo it can run to dozens of KB, so pull just it out with `jq -r .prompt` (or `node -e 'console.log(JSON.parse(require("fs").readFileSync(0)).prompt)'`) rather than scanning the whole blob.

## How staleness is tracked (update & query)

The engine records, in `.code-wiki.json`, the commit at which each **chapter and answer page** was last reviewed. When you run `prepare update`, the "files changed" list is computed against the **oldest** of those per-page commits — not one global baseline.

The reason this matters: every `finalize` (including a `query` that only wrote an answer page) advances a single global "last commit" field. If `update` trusted that field, a `query` could stamp HEAD as the baseline while leaving every chapter unrefreshed, and the next `update` would see an empty diff and wrongly conclude "nothing to do." Diffing against the oldest chapter instead means a source change made after _any_ chapter was last written always surfaces, and the prompt lists each chapter that lags HEAD (with how many commits behind), so you know which pages to re-read even when the diff looks small.

- For wikis created or finalized by older engine versions (no per-page history yet), the diff falls back to the global commit and the prompt prints a **transition note** plus, if the diff is empty, a warning that *empty ≠ current* — spot-check the chapters against source rather than trusting the empty list.
- `query`'s freshness hint uses the same baseline, so its "files changed since last review" reflects chapter staleness too.

This is the key defense against confidently shipping a stale wiki: treat an empty `update` diff as unverified until you've checked the stale chapters the prompt names.

## Detecting intent

Map what the user asked for to an action. When unsure, run `doctor` first — it reports wiki state and recommends the next action.

| User intent                                                                          | Action                                                                    |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| "create / build / generate / seed a code wiki", "document this repo"                 | `doctor`, then `prepare init` (or `prepare update` if one already exists) |
| "update / refresh / sync the wiki", "bring docs up to date"                          | `doctor`, then `prepare update` (or `prepare init` if none exists)        |
| "ask the wiki …", "explain how X works and save it", "add this question to the wiki" | `prepare query --question "…"` (requires an existing wiki)                |
| "what's the state of the wiki", "is it initialized"                                  | `doctor`                                                                  |
| "cancel / abort / never mind" (mid-run)                                              | `abort`                                                                   |

Notes:

- A vague "update the wiki" should **initialize only when no wiki exists**; if one exists, update it.
- `query` requires an existing wiki — it answers wiki-first rather than silently running a full initialization.
- **Read `doctor` before acting.** Its `recommendation` and `wikis` array tell you what to do. If `recommendation` is `none` and there is a `wikis` array, you are looking at a container that holds several per-package wikis — pick the one the user means and re-run with `--target`/`--output` (see [Multiple wikis](#multiple-wikis-monorepos--per-package)). Do **not** run `prepare init` against the container in that case.

## Running the engine

The engine resolves the Git repository root itself; run it from anywhere inside the repo you are documenting. Use the absolute path to the script beside this file:

```bash
node /absolute/path/to/code-wiki/scripts/code-wiki doctor
node /absolute/path/to/code-wiki/scripts/code-wiki prepare init
```

Every command prints JSON and uses conventional exit status (`ok:true` → 0, `ok:false` → nonzero; `doctor` exits 0 whenever inspection succeeds, even with no wiki). Parse the JSON.

## Options you will use

```text
--target <path>                source dir to document (default: repo root). A subdir
                               targets one package; the wiki then lives at docs/code-wiki/<basename>.
--output <path>                wiki output dir (default: docs/code-wiki[/target-basename]).
--format standard|obsidian     obsidian adds vault scaffolding + wikilink/callout conventions.
--language <lang>              prose language (default: english).
--detail-level summary|standard|deep|exhaustive   how deep to go (default: standard).
--exclude <glob[,glob...]>     extra source excludes; these EXTEND the defaults.
--no-gitignore                 include gitignored files in the orientation map. By default the
                               map honors .gitignore (via git), so ignored build output, caches,
                               and secrets stay out of the wiki's source view.
--max-size <bytes>             skip source files larger than this in the orientation map.
--question "<text>"            the query (required for `prepare query`).
--force                        lets `init` replace a non-empty wiki. ASK THE USER FIRST.
--lean                         (update/query) drops the full source orientation map from the
                               prompt — the existing wiki is your orientation, so you keep just
                               the changed files + staleness list. Use it on large repos to cut
                               noise and cost. The full map is still in the JSON `fileMap` field.
```

For `update` and `query`, language/format/detail/max-size are inherited from the existing wiki unless you override them. Pass the **same** `--target`/`--output` to `finalize` that you used for `prepare`.

## Multiple wikis (monorepos / per-package)

A repo can hold **more than one wiki** — typically one per package in a monorepo. Each lives in its own subdirectory:

```
docs/code-wiki/
├── backend/      wiki for the backend package
├── frontend/     wiki for the frontend package
└── web/          wiki for the web package
```

This is created automatically by passing `--target <pkg>`: the wiki then lives at `docs/code-wiki/<pkg>`. A whole-repo wiki (no `--target`) instead lives directly at `docs/code-wiki`.

The important wrinkle: when several package wikis exist, running `doctor` (or any command) **with no `--target`/`--output`** resolves to the `docs/code-wiki` container, which is _not itself a wiki_. The engine detects this situation so you don't get lost:

- `doctor` reports `recommendation: "none"`, a `note`, and a **`wikis` array** listing every existing package wiki (its `outputDir`, `chapters`, `answers`). It will **not** tell you to `init` the container.
- `prepare query`/`prepare update` with no target fails with a message that **names the existing package wikis** and tells you to pass `--target`/`--output`.
- `prepare init --force` on the container is **refused** — it would delete every package wiki at once. To replace one package wiki, target it explicitly: `--output docs/code-wiki/<pkg> --force`.

So when a user says "update the wiki" or "ask the wiki …" in a repo that has package wikis:

1. Run `doctor` and look for a `wikis` array.
2. If present, identify which package the user means from their wording (or ask if it's ambiguous), then re-run `doctor`/`prepare` with `--target <pkg>` (preferred) or `--output docs/code-wiki/<pkg>`.
3. Proceed with the normal core loop against that one wiki.

Never run `prepare init` against the `docs/code-wiki` container when package wikis exist — it cannot target a single package and the container is not where content belongs.

## Writing good wiki content (always)

- **Cite real source** for every implementation claim — file paths and line ranges. This is what makes a code wiki trustworthy.
- **Include Mermaid diagrams** to show structure and data flow; humans grasp architecture faster from a diagram than prose.
- **Match the detail level.** `summary` = orientation; `standard` = working detail; `deep` = thorough; `exhaustive` = comprehensive.
- **One log heading per operation**, exactly: `## [YYYY-MM-DD] init|update|query | <summary>`. The prompt gives you today's date and the exact line to add. The engine fails finalize if there isn't exactly one new heading of the right verb — this keeps history parseable.
- **Heed `finalize` warnings, especially Markdown lint.** `finalize` flags stray trailing backslashes (which glue two lines into one when rendered) and unbalanced inline-code spans (an odd number of backticks). These slip past the structural checks but break rendering. Fix any `…: line ends with a stray backslash` / `…: odd number of backticks` warnings before reporting the wiki done — they are warnings, not failures, but they point at real breakage. When you refresh a chapter, also re-open the cited source files and confirm line ranges like `service.go:156-211` still point at the right code; a commit can shift line numbers without changing your prose.
- For `query`, file a durable page under `answers/` only when the answer is substantial and reusable; trivial answers can skip it.
- Keep `00-index.md` current as the wiki's map: link every new chapter **and** every durable answer page, so a reader (or a later `query`) can find things without scanning filenames.

## Guardrails

- **Ask before `init --force`.** It deletes the existing wiki output. Confirm with the user unless they explicitly asked to replace it.
- **Stay in-repo.** The engine refuses paths outside the Git repository; don't try to work around that.
- **Repair, don't rebuild.** When `finalize` returns a `repairPrompt`, fix only the items it names and retry — do not blow away the run and start over.
- **Don't fake content to pass validation.** If finalize keeps failing on substance (e.g. no chapter pages), write real pages that reflect the source.

## When NOT to use this skill

- The user wants a quick, throwaway explanation in chat (no persistence needed) — just answer.
- You are not inside a Git repository — the engine requires one.
- The user wants fully autonomous, no-review documentation generation — this skill always puts the agent in the loop for content.

For the full command reference, every JSON shape, and the complete validation rules, read **`references/contract.md`** in this directory. Run `node scripts/code-wiki --help` to see the engine's own usage.
