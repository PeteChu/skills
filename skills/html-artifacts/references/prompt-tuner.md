# Pattern: Prompt tuner

An editable prompt template with highlighted `{{slot}}` variables, shown next to several sample
inputs that re-render the filled prompt live as you type. It ends with Copy template (and Copy filled
per sample).

- **Example:** [`examples/prompt-tuner.html`](../examples/prompt-tuner.html)
- **Source inspiration:** `20-editor-prompt-tuner.html` in
  [ThariqS/html-effectiveness](https://github.com/ThariqS/html-effectiveness)
- **Interactive:** yes (Alpine). Follows the shared editor rules in
  [`triage-board.md` → Interaction](triage-board.md#interaction).

## Use when

- "Help me tune this prompt", "let me iterate on the system prompt", "see how this template looks
  for different inputs", "the bot's output is too X".
- Any string template with variables that is filled per input: LLM prompts, email or notification
  templates, commit/PR/release-note templates.
- Not for comparing whole alternative prompts side by side with no editing (use
  [`code-approaches.md`](code-approaches.md)).

## Reader's job

Edit the wording once and judge it against 2–4 deliberately different inputs at the same time. The
samples are the point: pick inputs that stress different branches of the instructions (easy case,
edge case, breaking or angry case).

## Anatomy

1. **Header**: eyebrow with the template's file path, a title, and a prompt box describing what's
   wrong with the current output.
2. **Sticky toolbar**: `chars · ~tokens`, `N slots used`, problem count, an `edited` chip, Reset,
   and **Copy template**.
3. **Two columns** `lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]`:
   - **Left (sticky)**: the template editor panel, a slot legend (chips with use count; unused ones
     are dashed; click inserts at the cursor), and a checks panel (unknown slot, missing required
     slot, over token budget as errors; unused slot as info).
   - **Right**: one card per sample. The head has a badge, source ref, and kind chip. The body is the
     filled prompt, with filled values in an olive tint and unfilled slots as rust dashed. The footer
     has a token budget bar and Copy filled. A `<details>` edits that sample's inputs.

## Build steps

1. Get the real template and 2–4 real inputs (redact if needed). Pick inputs that differ in the
   dimension the user is worried about.
2. Embed `DEFAULT_TEMPLATE` (template literal), `SLOTS = [{ name, required, hint }]`, `SAMPLES`, and
   a token budget.
3. Write one `split(text, onSlot)` that walks `/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g` and returns
   segments. Use it for the editor backdrop (`slot` / `unknown`) and for each preview (`fill` /
   `missing`).
4. Build the editor as a **textarea over a highlight backdrop** (snippet below). Do not use
   contenteditable: caret save/restore and pasted HTML are where these editors break.
5. Derive `used`, `unknown`, `unused`, `missingRequired`, `overBudget`, and `issues` as getters.

## Key snippet

```html
<div class="grid">
  <div aria-hidden="true" class="ed col-start-1 row-start-1 pointer-events-none"><template x-for="(s, i) in editorSegs" :key="i"><span
    :class="s.kind === 'slot' ? 'bg-[rgba(217,119,87,0.16)] text-clay-dark rounded-[3px]'
          : s.kind === 'unknown' ? 'bg-[rgba(176,74,63,0.12)] text-rust underline decoration-dashed' : ''"
    x-text="s.text"></span></template></div>
  <textarea x-ref="ta" x-model="tpl" spellcheck="false" aria-label="Prompt template"
    class="ed col-start-1 row-start-1 h-full w-full resize-none overflow-hidden bg-transparent text-transparent caret-[#141413] outline-none"></textarea>
</div>
```

```css
/* Both layers share every metric that affects wrapping, or the highlights drift off the text. */
.ed { font: 13px/1.7 ui-monospace, Menlo, monospace; padding: 16px 18px; border: 0; margin: 0;
      white-space: pre-wrap; overflow-wrap: anywhere; letter-spacing: 0; }
```

- Both layers sit in the same grid cell. The backdrop sets the height, and the textarea stretches
  over it, so there is no scroll syncing.
- Append a `' '` segment to the backdrop so a trailing newline still takes up height.
- Keep the `x-for` template on one line inside a `whitespace-pre-wrap` parent, because stray
  whitespace between the tags renders.
- Highlights may change background and color only, never padding, weight, or size.

## Interaction

Follow [`triage-board.md` → Interaction](triage-board.md#interaction). Specific to template tuners:

- **Slot chips insert at the caret** (`selectionStart/End`, then `setSelectionRange` in `$nextTick`).
  Before the textarea has been focused, append at the end.
- **Sample inputs are editable** via `x-model="s.data[slot.name]"`, so the user can add the edge case
  they just thought of.
- **Budget is per filled prompt**, not per template. A long input is what blows the context.
- Exports: Copy template (primary), Copy filled per sample (for pasting into a playground).

## Pitfalls

- Three samples that are all the happy path: nothing to tune against.
- contenteditable + `innerHTML` re-highlighting: the caret jumps and pasted rich text leaks in.
- Silently leaving `{{typo}}` unfilled. Unknown slots must be rust in both the editor and the previews.
- Bold or padded slot highlights in the backdrop, which shift every following character.

## Combines well with

- [`interview.md`](interview.md): ask what "good output" means before tuning.
- [`change-quiz.md`](change-quiz.md): check that the user understands why each instruction exists.
- [`code-approaches.md`](code-approaches.md): compare two structurally different prompts first, then tune the winner.

## Checklist

- [ ] Real template and 2–4 contrasting samples, each with a source ref.
- [ ] Editor highlights align exactly with the text at every width; there is no contenteditable.
- [ ] Unknown, missing-required, over-budget, and unused slots are all reported live.
- [ ] Copy template and Copy filled both work, with the clipboard fallback.
