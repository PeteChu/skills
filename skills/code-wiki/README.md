# code-wiki

An **Agent Skill** that lets any Agent Skills-compatible coding agent (Claude
Code, OpenCode, Codex, Pi, and others) build, update, query, and maintain a
**persistent code wiki** for a repository — a set of Markdown pages under
`docs/code-wiki/` that explain how the code works, grounded in real source with
citations and diagrams.

The skill bundles a small, transparent, **dependency-free Node.js engine**
(`scripts/code-wiki`) that handles the deterministic bookkeeping — path
resolution, scaffolding, validation, and metadata. The coding agent does the
reading, reasoning, and writing. The engine never calls an LLM and never decides
content.

## Requirements

- **Node.js 18 or newer**
- **Git** — the engine requires a Git repository (it uses the repo root, commit
  metadata, and changed-file diffs)
- **No npm dependencies** — the engine uses Node built-ins only

## What it does

Say something natural to your coding agent:

- _"Create a code wiki for this repo."_
- _"Update the code wiki to the latest changes."_
- _"Ask the code wiki how authentication works."_

The agent detects the intent, drives the engine through a deterministic loop,
writes the wiki content, and validates it:

```
prepare → follow the returned canonical prompt → finalize → (repair if needed)
```

## The engine

```bash
node scripts/code-wiki doctor                  # inspect state, recommend next action
node scripts/code-wiki prepare init            # scaffold a new wiki + emit the prompt
node scripts/code-wiki prepare update          # refresh an existing wiki
node scripts/code-wiki prepare query --question "..."
node scripts/code-wiki finalize init|update|query
node scripts/code-wiki abort                   # clear an abandoned run (keeps content)
node scripts/code-wiki --help
```

Every command prints JSON. `ok:true` exits 0; `ok:false` exits nonzero; `doctor`
exits 0 whenever inspection succeeds (even with no wiki). See
[`references/contract.md`](./references/contract.md) for the full command,
option, and JSON reference.

### Options

```text
--target <path>                 source dir to document (default: repo root)
--output <path>                 wiki output dir (default: docs/code-wiki[/target-basename])
--format standard|obsidian      obsidian adds vault scaffolding + wikilink/callout conventions
--language <lang>               prose language (default: english)
--detail-level summary|standard|deep|exhaustive   (default: standard)
--exclude <glob[,glob...]>      extra source excludes; extend the defaults
--max-size <bytes>              skip source files larger than this (default: 100000)
--question "<text>"             required for prepare query
--force                         let init replace a non-empty wiki
```

## Wiki layout

```text
docs/code-wiki/
├── 00-index.md            entry point + navigation
├── 01_*.md, 02_*.md …     chapter / concept pages
├── answers/               durable query answer pages
├── log.md                 append-only maintenance history
├── .code-wiki-schema.md   engine-owned canonical rules
└── .code-wiki.json        engine-written metadata
```

The agent owns the content (index, chapters, answers, log prose). The engine
owns the schema, run state, validation, and metadata. Every successful operation
appends exactly one dated, parseable heading to `log.md`.

For a **monorepo** or multi-package repo, pass `--target <pkg>` and each package
gets its own wiki under `docs/code-wiki/<pkg>/`. When several package wikis
exist, `doctor` lists them in a `wikis` array (rather than recommending `init`
against the container), and `prepare init --force` on the container is refused so
package wikis are never accidentally deleted.

## Tests

The engine is tested as a black-box CLI against temporary Git repositories using
Node's built-in test runner:

```bash
npm test
```

## Structure

```text
code-wiki/
├── SKILL.md                skill instructions loaded by the agent
├── README.md               this file
├── package.json            test script + metadata (no runtime deps)
├── scripts/
│   └── code-wiki           the dependency-free Node.js engine
├── references/
│   └── contract.md         full engine contract (commands, options, JSON)
└── tests/
    └── code-wiki.test.js   black-box CLI tests
```

## License

MIT
