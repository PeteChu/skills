---
name: code-wiki
description: >-
  Build, update, query, and maintain a persistent, source-cited "code wiki" for a repository — an evolving set of Markdown pages that explain how a codebase actually works. Use this skill whenever the user wants durable, saved documentation of a codebase, repo, package, or service: phrases like "create/build/generate a code wiki", "document this repo/codebase", "write up how the system works and save it", "make architecture docs", "seed a knowledge base for this code". Also use it to keep that wiki current ("update/refresh the code wiki", "bring the wiki up to date", "sync docs with the latest changes") and to answer questions against it durably ("add this to the wiki", "explain how X works and save the answer", "ask the code wiki …"). Trigger even when the user does not say the word "wiki" but clearly wants persistent, filed, source-grounded explanations of code. The skill drives a bundled deterministic Node.js engine that scaffolds, validates, and writes metadata; the coding agent does the reading, reasoning, and writing.
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

The `prompt` returned by `prepare` is canonical and tailored to the action, the options, the source file map, and (for update/query) the files that changed. **Read it and follow it** rather than improvising the wiki structure — that is what keeps the wiki consistent across different agents.

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
--max-size <bytes>             skip source files larger than this in the orientation map.
--question "<text>"            the query (required for `prepare query`).
--force                        lets `init` replace a non-empty wiki. ASK THE USER FIRST.
```

For `update` and `query`, language/format/detail/max-size are inherited from the existing wiki unless you override them. Pass the **same** `--target`/`--output` to `finalize` that you used for `prepare`.

## Writing good wiki content (always)

- **Cite real source** for every implementation claim — file paths and line ranges. This is what makes a code wiki trustworthy.
- **Include Mermaid diagrams** to show structure and data flow; humans grasp architecture faster from a diagram than prose.
- **Match the detail level.** `summary` = orientation; `standard` = working detail; `deep` = thorough; `exhaustive` = comprehensive.
- **One log heading per operation**, exactly: `## [YYYY-MM-DD] init|update|query | <summary>`. The prompt gives you today's date and the exact line to add. The engine fails finalize if there isn't exactly one new heading of the right verb — this keeps history parseable.
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
