# code-wiki engine contract

This is the normative reference for the bundled engine (`scripts/code-wiki`).
It documents every command, option, JSON shape, file, and validation rule. The
engine is deterministic and dependency-free (Node.js 18+); it never calls an
LLM and never writes wiki prose.

## Table of contents

1. [Conventions](#conventions)
2. [Commands](#commands)
3. [Options](#options)
4. [JSON output shapes](#json-output-shapes)
5. [Path resolution](#path-resolution)
6. [Wiki layout & file ownership](#wiki-layout--file-ownership)
7. [The source file map](#the-source-file-map)
8. [Run lifecycle](#run-lifecycle)
9. [Validation rules](#validation-rules)
10. [Changed-file detection](#changed-file-detection)

---

## Conventions

- **Every command prints exactly one JSON object to stdout** and nothing else.
  Parse stdout as JSON.
- **Exit status:** `ok:true` → `0`. `ok:false` → nonzero. `doctor` exits `0`
  whenever inspection itself succeeds, even when no wiki exists or there is no
  Git repository.
- **Engine-owned files** (never hand-edit): `.code-wiki-run.json`,
  `.code-wiki-prompt.md`, `.code-wiki-schema.md`, `.code-wiki.json`.
- **Agent-owned files** (you write these): `00-index.md`, `NN_*.md` chapter
  pages, `answers/**`, and the prose appended to `log.md`.

---

## Commands

```text
code-wiki doctor [options]
code-wiki prepare init    [options]
code-wiki prepare update  [options]
code-wiki prepare query   --question "..." [options]
code-wiki finalize init   [options]
code-wiki finalize update [options]
code-wiki finalize query  [options]
code-wiki abort [options]
code-wiki --help
```

`migrate` is reserved for the future and is not implemented in v1; invoking it
returns `ok:false`.

### doctor

Inspection only. Does not require or modify a wiki. Reports Git state, wiki
state at the resolved output dir, whether a run is active, and a recommended
next action. Always exits 0 when inspection succeeds.

### prepare {init|update|query}

Deterministic setup. Resolves paths, creates/refreshes scaffolding, builds the
source file map (and, for update/query, the changed-files list), writes the
temporary run state and a prompt copy, and **returns the canonical `prompt`
inline**. The agent then follows that prompt.

- `init` fails if the output dir is non-empty unless `--force` is given.
- `update` and `query` fail if no wiki is initialized at the output dir.
- `query` requires `--question`.

### finalize {init|update|query}

Validation + metadata. Locates the active run (see [Run lifecycle](#run-lifecycle)),
validates the agent's edits, restores the canonical schema if it was altered,
writes `.code-wiki.json`, and removes the temporary run/prompt files. On
validation failure it returns `ok:false` with a `repairPrompt` and **keeps**
the temp files so the agent can repair and retry.

### abort

Removes the temporary run state and prompt copy only. Never deletes wiki
content. Does not require `--force`. Idempotent (succeeds even with no active
run).

---

## Options

| Option                                               | Default                            | Applies to                          |
| ---------------------------------------------------- | ---------------------------------- | ----------------------------------- |
| `--target <path>`                                    | repo root                          | prepare (all), doctor               |
| `--output <path>`                                    | `docs/code-wiki[/target-basename]` | prepare, finalize, doctor, abort    |
| `--exclude <glob[,glob...]>`                         | (none; extends defaults)           | prepare                             |
| `--no-gitignore`                                     | off (gitignore honored)            | prepare                             |
| `--language <lang>`                                  | `english`                          | prepare (inherited on update/query) |
| `--format standard\|obsidian`                        | `standard`                         | prepare (inherited)                 |
| `--detail-level summary\|standard\|deep\|exhaustive` | `standard`                         | prepare (inherited)                 |
| `--max-size <bytes>`                                 | `100000`                           | prepare (inherited)                 |
| `--question "<text>"`                                | (required)                         | prepare query                       |
| `--force`                                            | off                                | prepare init                        |
| `--lean`                                             | off                                | prepare update/query                |

- Invalid `--format` / `--detail-level` / non-positive `--max-size` fail fast.
- `--exclude` **extends** the built-in defaults; it never replaces them.
- `.gitignore` is **honored by default**: the source map is enumerated via
  `git ls-files --cached --others --exclude-standard`, so ignored files (build
  output, caches, secrets) are omitted. A tracked file that later matches a
  pattern is still included (Git never ignores tracked files). `--no-gitignore`
  switches to a plain tree walk that includes ignored files. This is a
  per-invocation choice; it is **not** inherited from prior metadata.
- On `update`/`query`, `language`, `format`, `detail-level`, and `max-size` are
  inherited from the existing `.code-wiki.json` unless explicitly overridden.
- `--lean` drops the full source orientation map from the `update`/`query`
  prompt (the existing wiki is the orientation); the map is still returned in
  the JSON `fileMap` field. It has no effect on `init`.
- Pass the **same** `--target`/`--output` to `finalize` that you passed to
  `prepare` so it can locate the active run.

---

## JSON output shapes

### doctor

```jsonc
{
  "ok": true,
  "command": "doctor",
  "git": { "repo": true, "root": "/abs/repo", "head": "sha" },
  "wiki": {
    "exists": true,
    "initialized": true,
    "hasMetadata": true,
    "outputDir": "docs/code-wiki",
    "chapters": 3,
    "answers": 1,
  },
  "run": { "active": false, "action": null },
  "options": {
    "format": "standard",
    "detailLevel": "standard",
    "language": "english",
    "maxSize": 100000,
    "exclude": ["..."],
  },
  "recommendation": "update", // init | update | finalize init|update|query | none
}
```

When not in a Git repo: `git.repo:false`, `recommendation:"none"`, plus a note.

#### Multi-wiki (monorepo) detection

When the resolved output is the `docs/code-wiki` **container** and the container
is not itself a wiki, `doctor` looks for per-package wikis in its subdirectories
(`docs/code-wiki/<pkg>`). If it finds any, it does **not** recommend `init`
(which would target the container) — instead it reports them and steers you to
one. The output gains two fields:

```jsonc
{
  "wiki": {
    "exists": true,
    "initialized": false,
    "outputDir": "docs/code-wiki",
    "chapters": 0,
    "answers": 0,
  },
  "recommendation": "none",
  "wikis": [
    {
      "outputDir": "docs/code-wiki/backend",
      "initialized": true,
      "hasMetadata": true,
      "chapters": 12,
      "answers": 3,
    },
    {
      "outputDir": "docs/code-wiki/web",
      "initialized": true,
      "hasMetadata": true,
      "chapters": 7,
      "answers": 1,
    },
  ],
  "note": "docs/code-wiki is a container holding 2 existing wiki(s): docs/code-wiki/backend, docs/code-wiki/web. Re-run doctor with --target <pkg> (or --output docs/code-wiki/<pkg>) ... Do not run 'prepare init' here — it targets the container, not a package.",
}
```

Read `wikis` (when present) to pick the package the user means, then re-run
`doctor`/`prepare` with `--target <pkg>` or `--output docs/code-wiki/<pkg>`.

### prepare (all actions)

```jsonc
{
  "ok": true,
  "command": "prepare init", // prepare update | prepare query
  "action": "init",
  "targetDir": ".", // repo-relative posix
  "outputDir": "docs/code-wiki",
  "options": {
    "format": "standard",
    "detailLevel": "standard",
    "language": "english",
    "maxSize": 100000,
    "exclude": [
      /*defaults+user*/
    ],
    "target": null,
    "output": null,
    "force": false,
    "respectGitignore": true,
  },
  "fileMap": {
    "files": [{ "path": "src/index.js", "bytes": 123, "lang": "javascript" }],
    "included": 42,
    "excludedCount": 7,
    "oversize": { "count": 1, "bytes": 250000 },
    "truncated": false,
    "maxSize": 100000,
    "gitignore": true, // true when the map was filtered through Git
  },
  "changedFiles": [{ "status": "M", "path": "src/index.js" }], // update/query only
  "chapterStaleness": [ // update only; empty until the wiki has per-page history
    { "file": "01_core.md", "lastCommit": "ab12c34", "commitsBehind": 4 },
  ],
  "prompt": "<canonical prompt text to follow>",
  "artifacts": {
    "runState": ".code-wiki-run.json",
    "promptFile": ".code-wiki-prompt.md",
    "schema": ".code-wiki-schema.md",
    "answersDir": "answers",
  },
}
```

### finalize — success

```jsonc
{
  "ok": true,
  "command": "finalize init",
  "action": "init",
  "passed": ["00-index.md present", "exactly one new 'init' log heading"],
  "warnings": [], // e.g. no-content update warning
  "schemaRestored": false,
  "metadata": {
    "version": 1,
    "action": "init",
    "finalizedAt": "ISO",
    "commit": "sha",
    "repoRoot": "/abs/repo",
    "outputDir": "/abs/repo/docs/code-wiki",
    "options": {
      /* effective options */
    },
    "generatedFiles": [
      ".code-wiki-schema.md",
      "00-index.md",
      "01_core.md",
      "log.md",
    ],
    "answers": ["answers/how-add-works.md"],
    "fileCommit": { // per-page last-reviewed commit (chapters + answers);
      "01_core.md": "sha",     // drives update/query staleness detection
      "answers/how-add-works.md": "sha",
    },
    "stats": {
      "chapters": 3,
      "answers": 1,
      "generatedCount": 6,
      "schemaRestored": false,
    },
  },
  "generatedFiles": ["..."],
  "removedArtifacts": [".code-wiki-run.json", ".code-wiki-prompt.md"],
}
```

### finalize — failure

```jsonc
{
  "ok": false,
  "command": "finalize init",
  "error": "validation failed",
  "action": "init",
  "passed": ["..."],
  "warnings": [],
  "schemaRestored": true,
  "repairPrompt": "Finalize for 'init' failed. Fix only the items below, then re-run 'finalize init':\n- ...",
}
```

### abort

```jsonc
{
  "ok": true,
  "command": "abort",
  "removed": [".code-wiki-run.json", ".code-wiki-prompt.md"],
  "wikiPreserved": true,
  "note": "active run cleared; wiki content untouched",
}
```

### generic error

```jsonc
{ "ok": false, "command": "prepare init", "error": "human-readable message" }
```

---

## Path resolution

All paths are resolved relative to the **Git repository root** (the engine runs
`git rev-parse --show-toplevel`). This keeps the wiki at a stable, repo-relative
location regardless of the agent's current directory.

- `--target` (relative) → `<repoRoot>/<target>`; default is the repo root.
- `--output` (relative) → `<repoRoot>/<output>`; default is
  `docs/code-wiki`, or `docs/code-wiki/<target-basename>` when a subdirectory
  target is given (so multiple package wikis coexist).
- Absolute `--target`/`--output` are honored as-is.
- **Path safety:** `target` and `output` must resolve inside the repository;
  otherwise the command fails with `ok:false`. `--force` deletion is performed
  only on the validated output dir.
- **Multiple wikis (monorepo):** with no `--target`/`--output`, the resolved
  output is the `docs/code-wiki` container. If that container is not itself a
  wiki but holds initialized package wikis, `doctor` reports them (see
  [Multi-wiki detection](#multi-wiki-monorepo-detection)) and `prepare init`
  **refuses `--force`** rather than deleting every package wiki — target the
  specific package with `--output docs/code-wiki/<pkg> --force` to replace one.

---

## Wiki layout & file ownership

```text
docs/code-wiki/
├── 00-index.md               agent   — entry point + navigation
├── 01_*.md, 02_*.md, …       agent   — chapter / concept pages (≥1 for init)
├── answers/                  agent   — durable query answer pages
│   └── *.md
├── log.md                    agent   — append-only maintenance history
├── .code-wiki-schema.md      engine  — canonical rules (restored each run)
├── .code-wiki.json           engine  — metadata (written by finalize)
├── .obsidian/app.json        engine  — only when --format obsidian
└── .gitignore                engine  — only when --format obsidian (ignores .obsidian/)
```

Temporary files present only mid-run (never durable intent):

```text
.code-wiki-run.json     active run state
.code-wiki-prompt.md    canonical prompt copy
```

`generatedFiles` (in metadata) lists durable wiki content and **excludes**:
`.code-wiki.json`, `.code-wiki-run.json`, `.code-wiki-prompt.md`, `.gitignore`,
and everything under `.obsidian/`. The schema (`.code-wiki-schema.md`), index,
chapter pages, answers, and `log.md` are included.

Chapter pages are detected as `NN_*.md` or `NN-*.md` with `NN ≥ 01`
(underscore is the canonical form). `00-index.md` is the index, never a chapter.

---

## The source file map

`prepare` enumerates the target directory and produces an **orientation** map
(it is not an allowlist — follow imports and read what matters). By default the
file set comes from `git ls-files --cached --others --exclude-standard`, so
files matched by any `.gitignore` source are omitted (tracked files are never
ignored, so a tracked file a later pattern matches still appears). `--no-gitignore`
instead walks the whole tree, ignored files included. On top of either set,
default excludes then remove `.git`, `node_modules`, `dist`, `build`, `out`,
`coverage`, `.next`, `.nuxt`, `.turbo`, `.cache`, `.vercel`, `.idea`, `.vscode`,
and the wiki output itself. User excludes extend these. Files larger than
`--max-size` are counted under `oversize` but not listed. A pattern matches if
it matches the full relative path, the basename, or any path segment (so
`node_modules` and `dist` "just work" anywhere).

---

## Run lifecycle

`prepare` writes `.code-wiki-run.json` containing the action, effective options,
today's date, the prior set of log headings, a snapshot of existing wiki content,
and the content-baseline commit (the oldest last-reviewed chapter) to diff
against. `finalize` reads this to know what to validate and what counts as "new".
`finalize` locates the active run by:

1. the output dir resolved from `--output`/`--target` (if provided),
2. then `docs/code-wiki` itself,
3. then each subdir of `docs/code-wiki` (for monorepo target wikis).

A successful `finalize` deletes `.code-wiki-run.json` and `.code-wiki-prompt.md`.
A failed `finalize` keeps them so you can repair and retry. `abort` deletes them
without touching content. Two concurrent runs on the same output dir are not
supported — finish or abort one before starting another.

---

## Validation rules

New log headings are computed by diffing the headings present at `finalize`
against those captured at `prepare`.

**init**

- `00-index.md`, `.code-wiki-schema.md`, `log.md` exist
- at least one chapter page (`NN_*.md`, `NN ≥ 01`)
- exactly one new `init` log heading

**update**

- initialized structure exists
- exactly one new `update` log heading
- warns (does **not** fail) when no substantive wiki content (index/chapters/
  answers) changed — the mandatory log line and engine-restored schema are
  ignored for this check

**query**

- initialized structure exists
- exactly one new `query` log heading
- a durable answer page is optional; if present, it is included in metadata

Log heading format (exactly one per operation):

```md
## [YYYY-MM-DD] init | short summary

## [YYYY-MM-DD] update | what changed and why

## [YYYY-MM-DD] query | the question that was asked
```

On any failure, `finalize` returns a `repairPrompt` naming exactly what to fix.

**Warnings (non-blocking).** `finalize` always returns a `warnings` array, on
success or failure, for issues that do not block the run but should be fixed:

- `update` with no substantive content change (index/chapters/answers unchanged
  aside from the mandatory log line and engine-restored schema).
- **Markdown lint** over the durable content files (chapters, answers, index):
  a line ending with a stray `\` (which glues it to the next line when
  rendered) and a line with an odd number of backticks (a likely-unclosed
  inline code span). Lines inside fenced code blocks are skipped. These are
  heuristics, not a full CommonMark parser, and never fail a finalize — but they
  catch the rendering breakage the structural validators miss.

---

## Changed-file detection

For `update` and `query`, the engine reports files changed against the **oldest
last-reviewed commit** among the wiki's chapter and answer pages — not the
single global `commit` in `.code-wiki.json`. The global `commit` advances on
every finalize (a `query` that only wrote an answer page stamps HEAD too), so
trusting it would let a prior `query` hide post-chapter source changes from the
next `update`. Diffing against the oldest chapter instead means a change made
after *any* chapter was last written always surfaces, and a `query` no longer
silently widens the gap between "metadata stamped at HEAD" and "every chapter
reviewed against HEAD."

`finalize` records, in metadata `fileCommit`, the commit at which each chapter
and answer page was last touched:

- a page refreshed (created or byte-changed) this run is stamped at HEAD;
- an untouched page keeps its prior baseline;
- a page with no prior baseline (a wiki finalized before this feature existed)
  inherits the old global `commit` — so the first tracked update after upgrade
  stays honest about stale chapters rather than pretending everything is fresh.

When no per-page history exists at all, the diff falls back to the global
`commit` and the update prompt prints a **transition note** (and, if the diff is
empty, a warning that empty ≠ current).

The comparison is commit → working tree, so it captures committed, uncommitted,
and untracked edits. Changes **inside the wiki output dir** are filtered out —
they are the wiki's own churn, not stale source. For `query`, the same list is
surfaced as a freshness hint so answers don't lean on stale pages. The detection
requires at least one prior commit (which an initialized wiki always has).

`prepare update` also emits `chapterStaleness`: each chapter/answer whose
last-reviewed commit is behind HEAD, with how many commits behind (most-stale
first), so the agent knows which pages to re-read even when the diff looks small
or empty.
