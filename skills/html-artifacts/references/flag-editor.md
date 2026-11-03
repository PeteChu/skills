# Pattern: Structured-config editor (feature flags)

A form over a config file: keys grouped by area, each with the right control (toggle, rollout
slider, enum segmented control), with live dependency and conflict warnings. It ends with a diff of
only the keys that changed.

- **Example:** [`examples/flag-editor.html`](../examples/flag-editor.html)
- **Source inspiration:** `19-editor-feature-flags.html` in
  [ThariqS/html-effectiveness](https://github.com/ThariqS/html-effectiveness)
- **Interactive:** yes (Alpine). Follows the shared editor rules in
  [`triage-board.md` → Interaction](triage-board.md#interaction).

## Use when

- "Give me a UI to flip these flags", "edit this config without hand-editing JSON", "which flags do I
  need for launch X".
- The file is a flat or shallow key → value map (flags, remote config, env toggles, plan limits) with
  rules between keys (requires, conflicts, locked).
- Not for free-text documents (use [`prompt-tuner.md`](prompt-tuner.md)) or for ordering items (use
  [`triage-board.md`](triage-board.md)).

## Reader's job

Change a handful of values safely and hand back a minimal patch. The page must make three things
obvious at all times: what changed, what is broken, and what will be copied.

## Anatomy

1. **Header**: eyebrow with the file path (`Editor · <app> · config/remote/prod.json`), a title
   naming the release or goal, a prompt box, and a mono line with key count, areas, last deploy, and
   locked keys.
2. **Sticky toolbar**: `N changed`, warning count, a "changed only" checkbox, a key filter input,
   Reset, and **Copy diff** (disabled when nothing changed).
3. **Two-column layout** `lg:grid-cols-[1fr_340px]`:
   - **Groups** (one white panel per area): a `bg-[#f0eee6]` head with serif label, mono owner team,
     and `5 keys · 3 on · 1 changed`. Rows are `grid-cols-[auto_1fr]`: control on the left, then the
     mono key, description, `needs …`/`exclusive with …` meta, and an inline warning with a fix button.
   - **Sticky sidebar** (`lg:sticky lg:top-20`): the pending diff as foundations diff rows, secondary
     exports (changed keys as JSON, full file), and a "Fix before deploying" list.
4. **Dependency map** (optional, recommended when there are 3+ rules): an inline SVG of the requires
   chains and exclusive pairs. Nodes are colored live: olive on, gray off, rust broken.

## Build steps

1. Read the real config and its schema/docs. Record each key's type, default, description, owner,
   and rules (`requires`, `conflicts`, `locked` with a reason).
2. Embed it as `GROUPS = [{ id, label, owner, flags: [{ key, type, value, desc, requires? }] }]`.
   Derive `FLAGS` (lookup) and `INITIAL` (frozen values) once.
3. Choose controls by type: `bool` → `role="switch"` button; `percent` → range `step=5` plus a
   badge; `enum` → segmented `role="radio"` buttons. Locked keys get `disabled` and a 🔒 chip.
4. Write `active(key)` (bool true, percent > 0) and `warning(key)`, which returns
   `{ msg, fix, apply }`. Everything else (row tint, counts, sidebar list, SVG colors) reads it.
5. Export the diff in file order, using JSON-literal values (`"onfido"` keeps its quotes).

## Key snippet

```html
<div class="grid grid-cols-[auto_1fr] gap-x-4 px-5 py-4 border-l-4"
  :class="warning(f.key) ? 'border-l-rust bg-[rgba(176,74,63,0.05)]'
        : changed(f.key) ? 'border-l-clay bg-[rgba(217,119,87,0.05)]' : 'border-l-transparent'">
  <button type="button" role="switch" :aria-checked="values[f.key].toString()" :aria-label="f.key"
    @click="values[f.key] = !values[f.key]" :disabled="!!f.locked"
    class="relative w-10 h-[22px] rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-clay"
    :class="values[f.key] ? 'bg-olive' : 'bg-[#d1cfc5]'">
    <span class="absolute top-[3px] left-[3px] w-4 h-4 rounded-full bg-white shadow transition-transform"
      :class="values[f.key] ? 'translate-x-[18px]' : ''"></span>
  </button>
  <div>…key, desc, "was false" chip + revert, inline warning + fix button…</div>
</div>
```

```js
warning(key) {
  const f = FLAGS[key];
  if (f.requires && this.active(key) && !this.active(f.requires))
    return { msg: 'requires ' + f.requires + ', which is off', fix: 'Enable ' + f.requires, apply: () => this.turnOn(f.requires) };
  if (f.conflicts && this.active(key) && this.active(f.conflicts))
    return { msg: 'conflicts with ' + f.conflicts, fix: 'Turn this off', apply: () => this.turnOff(key) };
  return null;
},
get diffText() { return this.changes.map(c => `- "${c.key}": ${fmt(c.from)}\n+ "${c.key}": ${fmt(c.to)}`).join('\n'); }
```

## Interaction

Follow [`triage-board.md` → Interaction](triage-board.md#interaction) (embed data, render from data,
sticky toolbar, validate inline and in aggregate, always export). Specific to config editors:

- **The diff is the primary export**, not the full file. Offer the full file and the changed keys as
  JSON as secondary buttons.
- **Fixes point to the prerequisite.** "Enable nfc_sdk_v3" beats "turn this off" unless the
  prerequisite is locked.
- **Seed one real warning** from the current file if one exists. It shows that validation works
  before the user touches anything.
- Use `x-model.number` on ranges so `0` and `25` diff as numbers, not strings.

## Pitfalls

- Generic checkboxes for every type: rollouts and enums become JSON-editing in disguise.
- Warnings that only appear on submit. They must update on every change, on the row itself.
- Diffing the whole file, so reviewers hunt for the two real changes among 200 lines.
- Hiding locked keys. Show them disabled with who owns them, because they explain conflicts.

## Combines well with

- [`pr-writeup.md`](pr-writeup.md): paste the copied diff into a PR description with context.
- [`implementation-notes.md`](implementation-notes.md): document why a rule (requires/conflicts) exists.
- [`flowchart.md`](flowchart.md): when the dependency graph is deep, give it its own diagram.

## Checklist

- [ ] Keys, types, rules, and owners come from the real config, grouped by area.
- [ ] Each changed row shows "was …" and a revert; the toolbar count matches the diff.
- [ ] Every requires/conflict violation is shown on the row, in the sidebar, and in the count, with a fix.
- [ ] Copy diff contains only changed keys, in file order, with JSON-literal values.
