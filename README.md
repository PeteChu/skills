# Agent Skills

A curated collection of reusable skills for AI coding agents. Each skill is a self-contained prompt package that teaches an agent how to perform a specific task consistently and well.

## Installation

```bash
npx skills@latest add petechu/skills
```

## Skills

| Skill                                              | Description                                                                                                                                     |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| [html-artifacts](./skills/html-artifacts/SKILL.md) | Generate polished, self-contained HTML artifacts for reports, plans, specs, code reviews, PR write-ups, research summaries, and more            |
| [code-wiki](./skills/code-wiki/SKILL.md)           | Build, update, and query a persistent, source-cited code wiki for a repository through a bundled, deterministic, dependency-free Node.js engine |
| [teach-back](./skills/teach-back/SKILL.md)         | Practice technical explanations with a believable persona, adaptive questions, coaching feedback, and replay                                    |
| [session-cost](./skills/session-cost/SKILL.md)     | Analyze one session's cost and tool trajectory to find expensive workflow habits and concrete improvements                                      |
| [eli5](./skills/eli5/SKILL.md)                     | Explain any topic like I'm 5 — a picture-heavy HTML artifact with one consistent metaphor, few words, a story arc, and a live demo              |

> **Note:** This collection is growing. The skills above are the first of many — additional skills will be added over time.

## What is a skill?

A skill is a markdown file (`SKILL.md`) that an agent loads on demand to gain focused expertise for a particular workflow. Each skill typically includes:

- **Front matter** — metadata such as name, description, and trigger phrases.
- **Workflow** — step-by-step instructions the agent follows.
- **Reference material** — additional detail (e.g., design tokens, code patterns) kept in a companion file.

## Structure

```text
skills/
├── html-artifacts/
│   ├── SKILL.md        # Skill definition and workflow
│   └── REFERENCE.md    # Clean design system reference
├── code-wiki/
│   ├── SKILL.md        # Skill definition and workflow
│   ├── scripts/code-wiki  # Bundled deterministic Node.js engine
│   ├── references/contract.md  # Full engine contract
│   └── tests/          # Black-box engine tests
├── teach-back/
│   └── SKILL.md        # Interactive explanation practice and feedback
├── session-cost/
│   ├── SKILL.md        # Break a session's cost down by process
│   └── scripts/session-cost  # Deterministic per-turn token/cost extractor
└── ...                 # More skills coming soon
```

## License

MIT
