---
name: session-cost
disable-model-invocation: true
description: Analyze one Claude Code session's Anthropic cost and tool trajectory to find expensive workflow habits and concrete improvements; delegated work is included and non-Anthropic proxy turns are excluded.
---

# session-cost

`ccusage` says what a session _cost_. This skill explains **where the cost landed and which workflow behavior caused it**. It carves a session into processes (Q&A, implementation, debugging, …), reviews the tool trajectory inside each process, follows delegated work, and excludes non-Anthropic proxy turns such as `glm-*`.

Keep two layers separate:

- **Cost shape** is billing evidence: fresh input, cache build, context carry, or generation. Shares are computed from USD contribution, not raw token counts; cached tokens are much cheaper than output tokens.
- **Workflow cause** is trajectory evidence: task mixing, excess turns, broad or repeated reads, rework loops, oversized outputs, or delegation overhead.

Cache-read tokens normally dominate a long session because every model call carries prior context. That fact alone is not a diagnosis. Recommend a change only after the trajectory identifies why the session made those calls or retained that context.

## Who owns what

- **The engine owns the numbers.** `scripts/session-cost` (next to this file) parses the session JSONL, attributes tokens and cost to every assistant turn, and does all the arithmetic. Run it with `python3`; never sum costs by hand.
- **You own the intent.** Grouping turns into processes, picking the label, and turning the table into a recommendation are judgment — that's you, not the engine.

## Analyze a live or finished session

This skill is normally run near the end of the current session. The engine freezes the parent and subagent files together at extraction, so later turns cannot change the report. Analysis performed by a non-Anthropic proxy model such as `glm-*` is excluded from turns, tokens, and cost. A live report remains a snapshot; Anthropic turns added after extraction are outside it. `--list` marks still-growing sessions `LIVE` and sessions with subagents `+SUB`.

## Workflow

```text
1. pick a session          → resolve a .jsonl (current/live is expected near session end)
2. freeze + read the ledger → python3 scripts/session-cost <session> > ledger.json   # incl. delegated cost
                              python3 scripts/session-cost <session> --compact   # cheap to read
3. segment + label          → write range shorthand to ranges.txt, then
                              python3 scripts/session-cost --label ledger.json ranges.txt
                              > labels.json   (engine validates full coverage)
4. aggregate                → python3 scripts/session-cost --aggregate
                              --ledger ledger.json --labels labels.json
                              [--reconcile <ccusage_cost[:tokens]>]
5. diagnose + report        → inspect the costly trajectories, name the workflow cause,
                              give one evidence-backed behavior change; if the session
                              delegated, weigh total_incl_subagents; reconcile ccusage
                              for Claude-only sessions
```

Three things keep this trustworthy:

- **Aggregate reads the frozen ledger, never the live JSONL again** — the turn count and totals stay identical between steps 2 and 4 even if the session keeps growing. Non-Anthropic turns are excluded before the ledger is written.
- **A turn is one Anthropic assistant message** (`message.id`). Claude Code may write it across several JSONL lines; the engine merges them and counts usage once. Non-Anthropic messages never become ledger turns.
- **Delegated cost is folded in.** Anthropic `Agent`/`Task` transcripts are priced with the parent and rolled back to the spawning turn, so `total_incl_subagents` is the full Anthropic cost.

Run the engine with the absolute path to the script in this folder. `<session>` is a `.jsonl` path, a session uuid, a project-dir substring, or empty (newest session for the current directory). Session lookup follows `CLAUDE_CONFIG_DIR` (default `~/.claude`), so running this skill inside a profile — personal or work — resolves that profile's sessions, not the default's. To analyze one profile's sessions without spending that profile's quota, run this skill under the profile whose quota should pay and prefix the engine command with the other profile's dir: `CLAUDE_CONFIG_DIR=~/.claude-work python3 scripts/session-cost <work-session> --compact` (reading JSONL is free local I/O; only this agent's reasoning is billed, to the running profile). The prefix drives `--list` and every `<session>` form except an explicit `.jsonl` path; once the ledger is frozen, `--label` and `--aggregate` read only that local file.

### 1. Pick a session

Use the session the user named. Otherwise, an empty argument resolves to the newest session for the current directory, usually the live session being reviewed near its end. Use `--list` when the target is ambiguous; the first-prompt column identifies opaque uuids.
_Done when:_ one `.jsonl` path is chosen.

### 2. Freeze and read the ledger

`python3 scripts/session-cost <session> > ledger.json` writes a snapshot of every Anthropic assistant turn (one per `message.id`, usage counted once). Non-Anthropic turns are recorded only in the ledger's `excluded` summary. Each included turn carries its token and USD bucket split, `signals`, a short `preview`, and bounded tool arguments. Delegated Anthropic work is rolled up at turn and session level.

**Then read it with `--compact`**, not the raw JSON: `python3 scripts/session-cost <session> --compact` prints one line per turn, grouped whenever the user's ask changes, with compact tool targets such as paths, grep patterns, and shell commands. `[+sub $X.XX, N agent]` appears under delegated turns. **Read every turn**; the sequence and arguments are the workflow evidence.
_Done when:_ you've read all turns in the ledger, not skimmed the first few.

### 3. Segment and label

Group **consecutive** turns that serve the same user goal into one segment. Label any turns spent running this skill `EXCLUDE session-cost analysis`; the aggregate engine removes every label beginning with `EXCLUDE` from totals, percentages, and sink ranking. Express the partition as range shorthand:

```text
1-12: Exploration
13-70: Implementation
71-96: Verification
97-101: EXCLUDE session-cost analysis
```

Then `python3 scripts/session-cost --label ledger.json ranges.txt > labels.json`. The engine expands the ranges into one label per turn and **validates coverage**: every turn 1..N covered, no gaps, no overlaps, in bounds. If anything's off it prints the exact problem and exits non-zero — fix the ranges and rerun. This is what makes "no unlabeled" a guarantee rather than a hope.
_Done when:_ `--label` exits zero with one label per turn.

### 4. Aggregate

`python3 scripts/session-cost --aggregate --ledger ledger.json --labels labels.json` prints the ranked table from the **frozen ledger**. Labels beginning with `EXCLUDE` are omitted before totals, percentages, and sink ranking; the header reports how many turns were removed. The engine never re-reads the session file.
_Done when:_ the table has no unlabeled warning and session-cost analysis is absent from the ranked processes.

### 5. Diagnose and report

Start with the processes that cumulatively account for at least 80% of parent cost. Review their compact trajectories for:

1. **Task boundaries** — an unrelated ask continued after a large context had accumulated.
2. **Turn amplification** — many small model/tool rounds, serial reads that could have been targeted or parallel, or repeated tool sequences without new evidence.
3. **Exploration quality** — broad reads before locating symbols, re-reading the same target, or continued discovery after enough evidence existed to act.
4. **Rework** — edit/check/edit loops. Name the earliest avoidable miss; one edit plus one verification is normal, not churn.
5. **Payload** — whole-file or verbose outputs retained where a path, symbol, bounded slice, or terse result would carry the same evidence.
6. **Delegation** — compare parent and delegated cost; offloading is useful only if it improves focus or outcome without merely duplicating discovery.

Report the ranked table, then at most three findings in this form:

`evidence → workflow cause → behavior change → expected effect`

Treat cost shape as supporting evidence, not the cause. For example, `context-carry` strengthens a task-mixing or turn-amplification finding, but does not create one. State "no clear avoidable pattern" rather than inventing a diagnosis from cache-read share.

**Cross-check ccusage only when nothing was excluded**: run `bunx ccusage claude session --mode calculate --breakdown` and feed its total to `--aggregate --reconcile <cost[:tokens]>`. The engine skips reconciliation when model- or label-based exclusions make the scopes differ.
_Done when:_ every process in the 80% set was trajectory-reviewed, each finding cites turn ranges or tool evidence, and any delegation recommendation uses total cost including subagents.

## The analysis costs tokens too

Reading the ledger is itself context-read. Keep it cheap with `--compact` and range labels. Non-Anthropic analysis turns are filtered automatically; label any remaining analysis turns `EXCLUDE session-cost analysis` so the measurement never ranks itself as a sink.

## Process taxonomy

Default labels. Map each segment to the best fit; you may merge or rename to fit the session, but keep labels consistent within one report.

| Process                    | Typical signals in the ledger                                              |
| -------------------------- | -------------------------------------------------------------------------- |
| **Q&A / explanation**      | `ask_question: true`, few or no tools, text-only replies ("how/why/what")  |
| **Implementation**         | `Edit`/`Write`/`MultiEdit`/`NotebookEdit`, or large output with `has_code` |
| **Debugging**              | `Read`/`Grep`/`Bash` iterating on an error; test runs after a failure      |
| **Exploration / research** | many `Read`/`Glob`/`Grep`/`WebSearch`, read-only fan-out                   |
| **Planning**               | plan mode, `TodoWrite`, proposing an approach before doing                 |
| **Review / verification**  | running tests, reading a diff, check/tooling that confirms work            |
| **Tooling / environment**  | `Bash` for install/git/scaffolding, MCP/environment setup                  |
| **Talking / meta**         | short back-and-forth, acknowledgements, clarifications, chitchat           |
| **Other**                  | genuinely none of the above                                                |

## Reading cost shape

The engine prices each bucket first, then names a shape only when one bucket contributes at least 55% of process cost:

- **`fresh-input`** — uncached input dominates. Look for large new prompts or uncached references.
- **`cache-build`** — creating reusable prompt cache dominates. A cold start may be expected; repeated builds may indicate unstable prefixes.
- **`context-carry`** — reading cached history dominates cost. Check for unrelated task continuation, avoidable turn count, or stale payload before recommending `/clear`, a new session, compaction, or just-in-time file reads.
- **`generation`** — output dominates cost. Check for verbose prose, whole-file rewrites, repeated dumps, or oversized delegated reports.
- **`mixed`** — no bucket reaches 55%; use the largest shares only as supporting evidence.

The CACHE-R and OUTPUT columns are shares of **cost**, not shares of tokens. This prevents cheap cached tokens from drowning out expensive generation.

## Delegated cost

Work an `Agent`/`Task` call offloads runs in a separate transcript the parent never sees the tokens of. The engine follows it there: it parses each `<session>/subagents/agent-*.jsonl`, prices it, and rolls the cost back to the parent turn that spawned it (matched by the tool_use id). So:

- `total_incl_subagents` is the full **Anthropic** session cost; the parent-only `total` understates any session that delegates.
- The **DELEG** column is a process's delegated spend; `+DELEG` marks a process whose delegated cost tops its parent cost — _looks cheap here because the work was offloaded._

This closes the skill's worst blind spot. Delegation shrinks the parent's context-read tax — the very thing this skill measures — so a parent-only read is biased toward "move exploration into subagents." That lever is real for the parent window, but the skill can now see whether it saved money **overall**: weigh `total_incl_subagents` before recommending it. An Explore agent that re-reads the whole codebase may cost more in total while the parent looks lean. (Nested agents — an agent spawning an agent — are counted in `total_incl_subagents` but show up as `unattached`, not pinned to a parent turn; they are rare.)

## Pricing

The engine counts only Claude models and prices common Opus/Sonnet/Haiku families. Non-Anthropic models such as `glm-*` are excluded rather than treated as session cost. An unknown future Claude model remains included and falls back to token ranking; add its rate with `--rates '{"<prefix>":{"in":<per-1M>,"out":<per-1M>}}'`.

The FAMILY table is a prefix match and can go stale. When no turns were excluded, `--aggregate --reconcile <ccusage_cost[:tokens]>` exposes rate differences.

## When NOT to use

- The user wants a quick session total or cross-session spend trends — that's `ccusage` already.
- The session has only a handful of turns — there's nothing to carve up.
- The user wants to reduce cost across _many_ sessions — `ccusage` daily/blocks views first, this skill second on the worst offender.
