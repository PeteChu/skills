# Agent Skills

A curated collection of reusable skills for AI coding agents. Each skill is a self-contained prompt package that teaches an agent how to perform a specific task consistently and well.

## Installation

```bash
npx skills@latest add petechu/skills
```

## Skills

| Skill                                      | Description                                                                                                       |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| [html-artifacts](./skills/html-artifacts/SKILL.md) | Generate polished, self-contained HTML artifacts for reports, plans, specs, code reviews, PR write-ups, research summaries, and more |

> **Note:** This collection is growing. The skills above are the first of many — additional skills will be added over time.

## What is a skill?

A skill is a markdown file (`SKILL.md`) that an agent loads on demand to gain focused expertise for a particular workflow. Each skill typically includes:

- **Front matter** — metadata such as name, description, and trigger phrases.
- **Workflow** — step-by-step instructions the agent follows.
- **Reference material** — additional detail (e.g., design tokens, code patterns) kept in a companion file.

## Structure

```
skills/
├── html-artifacts/
│   ├── SKILL.md        # Skill definition and workflow
│   └── REFERENCE.md    # Clean design system reference
└── ...                 # More skills coming soon
```

## License

MIT
