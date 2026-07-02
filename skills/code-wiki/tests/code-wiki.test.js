"use strict";

/*
 * Black-box tests for the bundled code-wiki engine.
 *
 * The engine is exercised as a CLI against temporary Git repositories, exactly
 * as an agent would invoke it. We assert on JSON output, exit status, and
 * filesystem effects — not on private helpers or exact prompt prose.
 */

const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");
const os = require("os");
const cp = require("child_process");

const ENGINE = path.resolve(__dirname, "..", "scripts", "code-wiki");
const NODE = process.execPath;

/* ------------------------------------------------------------------ *
 * Harness helpers
 * ------------------------------------------------------------------ */

const trash = [];

function makeRepo() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "cw-"));
  trash.push(dir);
  cp.execFileSync("git", ["init", "-q"], { cwd: dir, stdio: "ignore" });
  cp.execFileSync("git", ["config", "user.email", "t@t.t"], {
    cwd: dir,
    stdio: "ignore",
  });
  cp.execFileSync("git", ["config", "user.name", "tester"], {
    cwd: dir,
    stdio: "ignore",
  });
  return dir;
}

function write(repo, rel, content) {
  const full = path.join(repo, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, "utf8");
}

function commitAll(repo, msg) {
  cp.execFileSync("git", ["add", "-A"], { cwd: repo, stdio: "ignore" });
  cp.execFileSync("git", ["commit", "-qm", msg || "commit"], {
    cwd: repo,
    stdio: "ignore",
  });
}

function seedSource(repo) {
  write(repo, "src/math.js", "export const add=(a,b)=>a+b;\n");
  write(repo, "README.md", "# Project\nA tiny demo repo.\n");
  write(repo, "dist/built.js", "/* generated */\n"); // excluded by default
  commitAll(repo, "init");
}

// Run the engine; never throw on nonzero exit — return status + parsed JSON.
function run(repo, args) {
  const r = cp.spawnSync(NODE, [ENGINE, ...args], {
    cwd: repo,
    encoding: "utf8",
  });
  let json = null;
  try {
    json = JSON.parse(r.stdout);
  } catch (_) {
    /* command may print non-JSON only on catastrophic failure */
  }
  return { status: r.status, stdout: r.stdout, stderr: r.stderr, json };
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

// Act as the agent would: write the minimal wiki content finalize requires.
function authorInitWiki(
  repo,
  outRel = "docs/code-wiki",
  summary = "first wiki",
) {
  const base = path.join(repo, outRel);
  write(repo, `${outRel}/00-index.md`, "# Project Wiki\n\nEntry point.\n");
  write(repo, `${outRel}/01_core.md`, "# Core\n\n`add` adds. src/math.js:1\n");
  const log = path.join(base, "log.md");
  fs.mkdirSync(base, { recursive: true });
  fs.writeFileSync(log, `# Log\n\n## [${today()}] init | ${summary}\n`, "utf8");
}

function appendHeading(repo, rel, verb, summary) {
  const full = path.join(repo, rel);
  fs.appendFileSync(full, `## [${today()}] ${verb} | ${summary}\n`, "utf8");
}

/* ------------------------------------------------------------------ *
 * Cleanup
 * ------------------------------------------------------------------ */

test.after(() => {
  for (const d of trash) {
    try {
      fs.rmSync(d, { recursive: true, force: true });
    } catch (_) {}
  }
});

/* ------------------------------------------------------------------ *
 * doctor
 * ------------------------------------------------------------------ */

test("doctor with no wiki succeeds and recommends init", () => {
  const repo = makeRepo();
  seedSource(repo);
  const r = run(repo, ["doctor"]);
  assert.strictEqual(r.status, 0);
  assert.strictEqual(r.json.ok, true);
  assert.strictEqual(r.json.git.repo, true);
  assert.strictEqual(r.json.wiki.exists, false);
  assert.strictEqual(r.json.wiki.initialized, false);
  assert.strictEqual(r.json.recommendation, "init");
});

test("doctor exits 0 even outside a git repo", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "nogit-"));
  trash.push(dir);
  const r = run(dir, ["doctor"]);
  assert.strictEqual(r.status, 0);
  assert.strictEqual(r.json.ok, true);
  assert.strictEqual(r.json.git.repo, false);
});

/* ------------------------------------------------------------------ *
 * prepare init scaffolding
 * ------------------------------------------------------------------ */

test("prepare init creates schema, run state, prompt, and answers dir", () => {
  const repo = makeRepo();
  seedSource(repo);
  const r = run(repo, ["prepare", "init"]);
  assert.strictEqual(r.status, 0);
  assert.strictEqual(r.json.ok, true);
  assert.strictEqual(r.json.action, "init");

  const base = path.join(repo, "docs", "code-wiki");
  for (const f of [
    ".code-wiki-schema.md",
    ".code-wiki-run.json",
    ".code-wiki-prompt.md",
  ]) {
    assert.ok(fs.existsSync(path.join(base, f)), `${f} should exist`);
  }
  assert.ok(fs.existsSync(path.join(base, "answers")), "answers/ should exist");
  assert.ok(
    typeof r.json.prompt === "string" && r.json.prompt.length > 0,
    "prompt emitted inline",
  );

  // Source map excludes generated/dist and includes real source.
  const paths = r.json.fileMap.files.map((f) => f.path);
  assert.ok(paths.includes("src/math.js"), "source file mapped");
  assert.ok(
    !paths.some((p) => p.startsWith("dist/")),
    "dist excluded by default",
  );
});

test("prepare init blocks a non-empty output without --force", () => {
  const repo = makeRepo();
  seedSource(repo);
  write(repo, "docs/code-wiki/leftover.md", "# old\n");
  const r = run(repo, ["prepare", "init"]);
  assert.notStrictEqual(r.status, 0);
  assert.strictEqual(r.json.ok, false);
  assert.match(r.json.error, /not empty/);
});

test("prepare init --force safely clears and recreates the output", () => {
  const repo = makeRepo();
  seedSource(repo);
  write(repo, "docs/code-wiki/old.md", "# old\n");
  const r = run(repo, ["prepare", "init", "--force"]);
  assert.strictEqual(r.status, 0);
  assert.strictEqual(r.json.ok, true);
  // The old content is gone, scaffolding is fresh.
  assert.ok(!fs.existsSync(path.join(repo, "docs/code-wiki/old.md")));
  assert.ok(fs.existsSync(path.join(repo, "docs/code-wiki/answers")));
});

/* ------------------------------------------------------------------ *
 * finalize init
 * ------------------------------------------------------------------ */

test("finalize init fails with a repairPrompt when required content is missing", () => {
  const repo = makeRepo();
  seedSource(repo);
  run(repo, ["prepare", "init"]);
  const r = run(repo, ["finalize", "init"]);
  assert.notStrictEqual(r.status, 0);
  assert.strictEqual(r.json.ok, false);
  assert.ok(r.json.repairPrompt, "repairPrompt returned");
  assert.match(r.json.repairPrompt, /chapter page/);
});

test("successful finalize init writes metadata and removes temp artifacts", () => {
  const repo = makeRepo();
  seedSource(repo);
  run(repo, ["prepare", "init"]);
  authorInitWiki(repo);

  const r = run(repo, ["finalize", "init"]);
  assert.strictEqual(r.status, 0);
  assert.strictEqual(r.json.ok, true);

  const base = path.join(repo, "docs", "code-wiki");
  assert.ok(
    fs.existsSync(path.join(base, ".code-wiki.json")),
    "metadata written",
  );
  assert.ok(
    !fs.existsSync(path.join(base, ".code-wiki-run.json")),
    "run state removed",
  );
  assert.ok(
    !fs.existsSync(path.join(base, ".code-wiki-prompt.md")),
    "prompt removed",
  );

  const meta = JSON.parse(
    fs.readFileSync(path.join(base, ".code-wiki.json"), "utf8"),
  );
  assert.ok(
    Array.isArray(meta.generatedFiles) && meta.generatedFiles.length > 0,
  );
  assert.ok(meta.generatedFiles.includes("00-index.md"));
  assert.ok(meta.generatedFiles.includes("01_core.md"));
});

test("finalize init rejects two new init headings (exactly one required)", () => {
  const repo = makeRepo();
  seedSource(repo);
  run(repo, ["prepare", "init"]);
  authorInitWiki(repo, "docs/code-wiki", "first");
  appendHeading(repo, "docs/code-wiki/log.md", "init", "second");
  const r = run(repo, ["finalize", "init"]);
  assert.notStrictEqual(r.status, 0);
  assert.match(r.json.repairPrompt, /exactly ONE new/);
});

/* ------------------------------------------------------------------ *
 * update / query require an initialized wiki
 * ------------------------------------------------------------------ */

test("prepare update fails when no wiki is initialized", () => {
  const repo = makeRepo();
  seedSource(repo);
  const r = run(repo, ["prepare", "update"]);
  assert.notStrictEqual(r.status, 0);
  assert.strictEqual(r.json.ok, false);
});

test("prepare query fails when no wiki is initialized", () => {
  const repo = makeRepo();
  seedSource(repo);
  const r = run(repo, ["prepare", "query", "--question", "what?"]);
  assert.notStrictEqual(r.status, 0);
  assert.strictEqual(r.json.ok, false);
});

test("prepare query requires --question", () => {
  const repo = makeRepo();
  seedSource(repo);
  run(repo, ["prepare", "init"]);
  authorInitWiki(repo);
  run(repo, ["finalize", "init"]);
  const r = run(repo, ["prepare", "query"]);
  assert.notStrictEqual(r.status, 0);
  assert.match(r.json.error, /question/);
});

test("full update cycle: prepare update, edit, finalize update", () => {
  const repo = makeRepo();
  seedSource(repo);
  run(repo, ["prepare", "init"]);
  authorInitWiki(repo);
  run(repo, ["finalize", "init"]);

  // Change source and commit so changed-files detection has something.
  write(
    repo,
    "src/math.js",
    "export const add=(a,b)=>a+b;\nexport const sub=(a,b)=>a-b;\n",
  );
  commitAll(repo, "add sub");

  const prep = run(repo, ["prepare", "update"]);
  assert.strictEqual(prep.status, 0);
  assert.ok(prep.json.changedFiles.some((c) => c.path === "src/math.js"));
  // Wiki churn is filtered out of changed files.
  assert.ok(
    !prep.json.changedFiles.some((c) => c.path.startsWith("docs/code-wiki/")),
  );

  appendHeading(repo, "docs/code-wiki/log.md", "update", "added sub");
  const fin = run(repo, ["finalize", "update"]);
  assert.strictEqual(fin.status, 0);
  assert.strictEqual(fin.json.ok, true);
});

test("update warns (does not fail) when no wiki content changed", () => {
  const repo = makeRepo();
  seedSource(repo);
  run(repo, ["prepare", "init"]);
  authorInitWiki(repo);
  run(repo, ["finalize", "init"]);

  assert.strictEqual(run(repo, ["prepare", "update"]).status, 0);
  appendHeading(repo, "docs/code-wiki/log.md", "update", "nothing");
  const fin = run(repo, ["finalize", "update"]);
  assert.strictEqual(fin.status, 0, "no-content update must not fail");
  assert.ok(fin.json.warnings.some((w) => /no wiki content changed/.test(w)));
});

test("query cycle files a durable answer page into metadata", () => {
  const repo = makeRepo();
  seedSource(repo);
  run(repo, ["prepare", "init"]);
  authorInitWiki(repo);
  run(repo, ["finalize", "init"]);

  assert.strictEqual(
    run(repo, ["prepare", "query", "--question", "How does add work?"]).status,
    0,
  );
  write(
    repo,
    "docs/code-wiki/answers/how-add-works.md",
    "# How does add work?\n\na+b. src/math.js:1\n",
  );
  appendHeading(repo, "docs/code-wiki/log.md", "query", "How does add work?");
  const fin = run(repo, ["finalize", "query"]);
  assert.strictEqual(fin.status, 0);
  assert.deepEqual(fin.json.metadata.answers, ["answers/how-add-works.md"]);
});

/* ------------------------------------------------------------------ *
 * abort
 * ------------------------------------------------------------------ */

test("abort removes run state only and preserves wiki content", () => {
  const repo = makeRepo();
  seedSource(repo);
  run(repo, ["prepare", "init"]);
  authorInitWiki(repo); // some content
  const r = run(repo, ["abort"]);
  assert.strictEqual(r.status, 0);
  assert.strictEqual(r.json.ok, true);
  assert.strictEqual(r.json.wikiPreserved, true);

  const base = path.join(repo, "docs", "code-wiki");
  assert.ok(
    !fs.existsSync(path.join(base, ".code-wiki-run.json")),
    "run state removed",
  );
  assert.ok(
    !fs.existsSync(path.join(base, ".code-wiki-prompt.md")),
    "prompt removed",
  );
  assert.ok(
    fs.existsSync(path.join(base, "00-index.md")),
    "agent content preserved",
  );
});

/* ------------------------------------------------------------------ *
 * generated-file scanning exclusions
 * ------------------------------------------------------------------ */

test("generatedFiles excludes metadata, temp, .obsidian, and .gitignore", () => {
  const repo = makeRepo();
  seedSource(repo);
  run(repo, ["prepare", "init", "--format", "obsidian"]);
  authorInitWiki(repo);
  const r = run(repo, ["finalize", "init"]);
  assert.strictEqual(r.status, 0);
  const gen = r.json.generatedFiles;
  const banned = [
    ".code-wiki.json",
    ".code-wiki-run.json",
    ".code-wiki-prompt.md",
    ".gitignore",
  ];
  for (const b of banned) assert.ok(!gen.includes(b), `${b} must be excluded`);
  assert.ok(!gen.some((p) => p.startsWith(".obsidian/")), ".obsidian excluded");
});

/* ------------------------------------------------------------------ *
 * obsidian scaffolding
 * ------------------------------------------------------------------ */

test("obsidian format creates vault scaffolding", () => {
  const repo = makeRepo();
  seedSource(repo);
  const r = run(repo, ["prepare", "init", "--format", "obsidian"]);
  assert.strictEqual(r.status, 0);
  const base = path.join(repo, "docs", "code-wiki");
  assert.ok(fs.existsSync(path.join(base, ".obsidian", "app.json")));
  const gi = fs.readFileSync(path.join(base, ".gitignore"), "utf8");
  assert.match(gi, /\.obsidian/);
});

test("invalid format fails fast", () => {
  const repo = makeRepo();
  seedSource(repo);
  const r = run(repo, ["prepare", "init", "--format", "latex"]);
  assert.notStrictEqual(r.status, 0);
  assert.match(r.json.error, /format/);
});

/* ------------------------------------------------------------------ *
 * path safety + monorepo target
 * ------------------------------------------------------------------ */

test("prepare init refuses an output outside the repository", () => {
  const repo = makeRepo();
  seedSource(repo);
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), "out-"));
  trash.push(outside);
  const r = run(repo, ["prepare", "init", "--output", outside]);
  assert.notStrictEqual(r.status, 0);
  assert.strictEqual(r.json.ok, false);
});

test("monorepo --target writes to docs/code-wiki/<basename> and finalize finds it", () => {
  const repo = makeRepo();
  write(repo, "packages/web/index.js", "console.log('web');\n");
  write(repo, "packages/api/index.js", "console.log('api');\n");
  commitAll(repo, "monorepo");

  const prep = run(repo, ["prepare", "init", "--target", "packages/web"]);
  assert.strictEqual(prep.status, 0);
  assert.ok(
    prep.json.outputDir.endsWith("docs/code-wiki/web"),
    prep.json.outputDir,
  );
  assert.ok(prep.json.fileMap.files.some((f) => f.path === "index.js"));

  authorInitWiki(repo, "docs/code-wiki/web");
  const fin = run(repo, ["finalize", "init", "--target", "packages/web"]);
  assert.strictEqual(fin.status, 0, "finalize locates the target-scoped run");
  assert.ok(
    fs.existsSync(path.join(repo, "docs/code-wiki/web/.code-wiki.json")),
  );
});

/* ------------------------------------------------------------------ *
 * multi-wiki / monorepo detection
 * ------------------------------------------------------------------ */

// Seed a fully-initialized package wiki directly (without running the engine),
// so we can test how doctor/prepare behave when several package wikis exist.
function seedPackageWiki(repo, outRel, name) {
  write(repo, `${outRel}/00-index.md`, `# ${name} Wiki\n`);
  write(repo, `${outRel}/01_core.md`, `# Core\nsee source\n`);
  write(repo, `${outRel}/.code-wiki-schema.md`, "schema\n");
  const base = path.join(repo, outRel);
  fs.mkdirSync(base, { recursive: true });
  fs.writeFileSync(
    path.join(base, "log.md"),
    `# Log\n\n## [${today()}] init | ${name} wiki\n`,
    "utf8",
  );
}

test("doctor surfaces existing package wikis instead of recommending init on the container", () => {
  const repo = makeRepo();
  seedSource(repo);
  seedPackageWiki(repo, "docs/code-wiki/backend", "Backend");
  seedPackageWiki(repo, "docs/code-wiki/web", "Web");
  commitAll(repo, "package wikis");

  const r = run(repo, ["doctor"]);
  assert.strictEqual(r.status, 0);
  // The container itself is not a wiki.
  assert.strictEqual(r.json.wiki.initialized, false);
  assert.strictEqual(r.json.wiki.chapters, 0);
  // It must NOT recommend init against the container.
  assert.strictEqual(r.json.recommendation, "none");
  // It lists the package wikis it found.
  assert.ok(Array.isArray(r.json.wikis) && r.json.wikis.length === 2);
  const dirs = r.json.wikis.map((w) => w.outputDir).sort();
  assert.deepStrictEqual(dirs, [
    "docs/code-wiki/backend",
    "docs/code-wiki/web",
  ]);
  assert.ok(r.json.note && /container/.test(r.json.note));
});

test("doctor --target detects the dedicated package wiki", () => {
  const repo = makeRepo();
  seedSource(repo);
  seedPackageWiki(repo, "docs/code-wiki/backend", "Backend");
  commitAll(repo, "package wiki");

  const r = run(repo, ["doctor", "--target", "backend"]);
  assert.strictEqual(r.status, 0);
  assert.strictEqual(r.json.wiki.outputDir, "docs/code-wiki/backend");
  assert.strictEqual(r.json.wiki.initialized, true);
  assert.ok(r.json.wiki.chapters >= 1);
  assert.strictEqual(r.json.recommendation, "update");
  // No multi-wiki envelope when targeting a specific package.
  assert.strictEqual(r.json.wikis, undefined);
});

test("prepare query with no target names the existing package wikis", () => {
  const repo = makeRepo();
  seedSource(repo);
  seedPackageWiki(repo, "docs/code-wiki/backend", "Backend");
  commitAll(repo, "package wiki");

  const r = run(repo, ["prepare", "query", "--question", "how does it work?"]);
  assert.notStrictEqual(r.status, 0);
  assert.strictEqual(r.json.ok, false);
  assert.match(r.json.error, /docs\/code-wiki\/backend/);
  assert.match(r.json.error, /--target/);
});

test("prepare init --force is refused on a container holding package wikis", () => {
  const repo = makeRepo();
  seedSource(repo);
  seedPackageWiki(repo, "docs/code-wiki/backend", "Backend");
  commitAll(repo, "package wiki");

  const r = run(repo, ["prepare", "init", "--force"]);
  assert.notStrictEqual(r.status, 0);
  assert.strictEqual(r.json.ok, false);
  assert.match(r.json.error, /refusing --force/);
  // The package wiki must survive untouched.
  assert.ok(
    fs.existsSync(path.join(repo, "docs/code-wiki/backend/00-index.md")),
    "package wiki preserved",
  );
});

test("prepare init --force still clears a plain (non-package) non-empty output", () => {
  const repo = makeRepo();
  seedSource(repo);
  write(repo, "docs/code-wiki/old.md", "# old\n"); // a loose file, not a package wiki
  const r = run(repo, ["prepare", "init", "--force"]);
  assert.strictEqual(r.status, 0, "force clears a non-package output");
  assert.ok(!fs.existsSync(path.join(repo, "docs/code-wiki/old.md")));
});

/* ------------------------------------------------------------------ *
 * options inheritance
 * ------------------------------------------------------------------ */

test("update inherits format/language/detail from metadata", () => {
  const repo = makeRepo();
  seedSource(repo);
  run(repo, [
    "prepare",
    "init",
    "--format",
    "obsidian",
    "--language",
    "french",
    "--detail-level",
    "deep",
  ]);
  authorInitWiki(repo);
  run(repo, ["finalize", "init"]);

  const prep = run(repo, ["prepare", "update"]);
  assert.strictEqual(prep.status, 0);
  assert.strictEqual(prep.json.options.format, "obsidian");
  assert.strictEqual(prep.json.options.language, "french");
  assert.strictEqual(prep.json.options.detailLevel, "deep");
});

test("user excludes extend (not replace) the defaults", () => {
  const repo = makeRepo();
  seedSource(repo);
  write(repo, "secrets/keys.json", "{}\n");
  const r = run(repo, ["prepare", "init", "--exclude", "secrets"]);
  assert.strictEqual(r.status, 0);
  const paths = r.json.fileMap.files.map((f) => f.path);
  assert.ok(
    !paths.some((p) => p.startsWith("secrets/")),
    "user exclude honored",
  );
  assert.ok(
    !paths.some((p) => p.startsWith("dist/")),
    "default exclude still present",
  );
});
