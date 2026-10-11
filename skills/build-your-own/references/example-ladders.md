# Example ladders

Reference for calibrating milestone granularity. Each example shows the full
ladder for a classic build-your-own-X target. Note the shape every rung shares:

- small enough for one sitting after focused reading
- one concept in the "Concept" column, everything else is plumbing
- ends runnable, demoable in one command
- early rungs hardcode what later rungs generalize

Use these as _shape_ references, not content to copy: research the actual topic's
resources, and adjust rung count to the user's language and experience.

Before each rung, introduce its concept and provide focused reading alongside
the build brief. The user reads, writes, then brings code for verification and
review. Useful guiding questions for the first reading include:

- **Git:** Why identify stored content by its bytes rather than its filename?
  What happens to the identifier when only the filename changes?
- **Redis:** How does a request reach the server and a reply reach the client?
  What happens if the request arrives in two pieces?
- **Interpreter:** Why group characters into tokens? How would the grouping
  change if another digit were added to a number?

These guide independent reading, not a mandatory quiz or a reason to delay coding.

---

## Git (in Python)

| #   | Milestone        | Concept                                                                              |
| --- | ---------------- | ------------------------------------------------------------------------------------ |
| 1   | Hash a file      | Content addressing: identity = SHA-1 of `"blob <len>\0" + content`                   |
| 2   | Store the object | The object database: zlib-compress, write to `.toygit/objects/ab/cdef…`              |
| 3   | Read it back     | Round-trip: decompress by hash; corruption is detectable _because_ content-addressed |
| 4   | Tree objects     | Trees are directories: entries of (mode, type, hash, name), pointing by hash         |
| 5   | Commit objects   | Commits are snapshots, not diffs: tree + parent + author + message                   |
| 6   | References       | Branches are files containing a hash — pointers, not copies                          |
| 7   | The index        | Staging: an explicit map of path → blob hash, i.e. the next tree under construction  |
| 8   | `add` + `commit` | The real flow: index → tree object → commit object → move ref                        |
| 9   | `log`            | History is a parent walk from a ref, not a stored list                               |
| 10  | Tree diff        | A diff is computed by comparing two trees — nothing is stored between them           |

Built vs. real git: packfiles, merge commits (DAG joins), rename detection,
remotes and transfer, index performance, gpg, hooks.

---

## Redis clone (in Go or Python)

| #   | Milestone                    | Concept                                                                                 |
| --- | ---------------------------- | --------------------------------------------------------------------------------------- |
| 1   | PONG server                  | It's just a socket protocol: accept one connection, reply `+PONG\r\n` to anything       |
| 2   | Inline commands              | Parse one simple command per line, reply `+OK`; command dispatch exists                 |
| 3   | SET/GET                      | A keyspace: global dict, `SET k v` mutates it, `GET k` reads it                         |
| 4   | RESP arrays                  | Binary-safe framing: `$` bulk strings, `*` arrays — why values with spaces/CRLF survive |
| 5   | Many commands per connection | The protocol is a stream: buffered reads, loop until EOF (pipelining falls out free)    |
| 6   | Expiry                       | TTLs: `SET k v EX 5`, lazily expire on access                                           |
| 7   | Many connections             | Concurrency: thread or selector per client; why redis serializes per-key ops            |
| 8   | INCR, DEL, TTL               | Values are typed; commands assume a type and error otherwise                            |
| 9   | Snapshot persistence         | Save the dict to disk on demand, load at boot (baby RDB)                                |
| 10  | Lists: LPUSH/LRANGE          | New value type = new structure beside the dict, same dispatch                           |

Built vs. real redis: replication, AOF, cluster sharding, LRU eviction, blocking
commands, active expiry, integer-optimized encodings.

---

## Interpreter for an arithmetic language (any language)

| #   | Milestone                | Concept                                                                                      |
| --- | ------------------------ | -------------------------------------------------------------------------------------------- |
| 1   | Tokenize integers        | Source is characters; a lexer turns them into tokens: `"12+3"` → `[NUM 12, PLUS, NUM 3]`     |
| 2   | Full tokenizer           | Lexing rules: numbers, `+ - * /`, parens, whitespace; longest match wins                     |
| 3   | Parse and evaluate       | Precedence lives in the grammar: one function per binding level (recursive descent)          |
| 4   | Build an AST             | Separate parsing from meaning: `Mul(Num 2, Add(Num 3, Num 4))`, then one `eval()` walk       |
| 5   | Variables                | Environments: a dict binding names to values; assignment is `env[name] = eval(rhs)`          |
| 6   | Comparisons + `if`       | Statements vs expressions; truthiness; a block is a list of statements                       |
| 7   | `while` loop             | Control flow: eval the condition, re-eval the body — env mutation makes it observable        |
| 8   | Functions                | A call pushes a new scope: params bind, body evals, call stack is implicit in host recursion |
| 9   | Strings + `print`        | A second value type forces a type tag on every value; builtins are a table                   |
| 10  | Errors with line numbers | Diagnostics are a feature: tokens carry positions; runtime errors report them                |

Built vs. real interpreters: bytecode + VM (why CPython/luajit don't tree-walk),
garbage collection, closures vs scopes subtleties, modules, speed, standard
library.

---

## Anti-patterns to avoid

- **Rung 1 = "set up the project"** — a rung with no runnable outcome. Setup is
  five minutes of plumbing folded into rung 1, not its own rung.
- **"Parsing" as one milestone** — it's four (like above). If the concept column
  needs the word "and", split it.
- **All plumbing first, all fun last** — every rung should demo something visible.
- **Big-bang finale** — if the last rung is twice the size of the others, the
  ladder is misbalanced; pull concepts forward.
