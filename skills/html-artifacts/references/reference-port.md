# Pattern: Reference port (semantics map)

Before porting a reference implementation to another language or stack, prove you understood it:
plain-language behaviors, matched code excerpts side by side with numbered gotcha notes, a
preserved/changed/dropped ledger, an edge-case table, and a sign-off the user copies back.

- **Example:** [`examples/reference-port.html`](../examples/reference-port.html)
- **Source inspiration:** `unknowns/07-reference-port.html` in
  [ThariqS/html-effectiveness](https://github.com/ThariqS/html-effectiveness)
- **Interactive:** yes (light: hover-linked excerpt regions and notes; copy sign-off and correction
  template)

## Use when

- "This library / crate / module does exactly what I want, port it to our stack", "reimplement X's
  behavior in TypeScript", "match the semantics of the reference", "rewrite this service in Go".
- Behavior is subtle (time, money, concurrency, parsing, rounding) and a literal translation could
  silently change results.
- The user asked to confirm understanding *before* code. If they want a plan for a new feature, use
  [`implementation-plan.md`](implementation-plan.md); if they want to learn the concept itself, use
  [`concept-explainer.md`](concept-explainer.md).

## Reader's job

Audit the agent's understanding row by row and reply with either "semantics confirmed" or a
precise correction ("note 6 is wrong"). Every claim must be checkable against a cited line or test.

## Anatomy

1. **Header**: eyebrow (`<target project> · semantics map · before porting`), title
   `source (lang) → target path (lang)`, an **awaiting confirmation** clay chip, prompt box, a
   one-line promise ("nothing gets implemented until you sign off"), and mono chips: source path +
   language + LOC, target path + key dependency, files and tests read, and real usage count.
2. **01 What it actually does**: 4–6 bullets, each a bold behavior + the module it lives in. Include
   one bullet on what the reference does **not** do (the boundary the port keeps).
3. **02 Side by side**: 2–4 **pairs**. Each pair: `PAIR A / 3` label + serif title naming the trap,
   two dark code panels (`lg:grid-cols-2`) with a header strip (path:line, language chip; target
   marked "(proposed)"), and a row of 3 numbered notes below. Corresponding regions are `<mark>`s
   with matching ids and superscript numbers; notes are numbered continuously across pairs (1–9).
4. **03 Preserved / deliberately changed / dropped**: three cards with olive / clay / gray top
   borders. "Changed" items name the reason; "Dropped" items cite the evidence (zero callers, flag
   off).
5. **04 Edge cases**: table of case (input + one-line description), source behavior, port
   behavior, and a match pill: `identical` (olive), `equivalent*` (clay), `differs` (rust).
   Footnote defines "equivalent". Use concrete dates, inputs, and test names.
6. **05 Sign-off**: slate-bordered panel stating exactly what happens after confirmation (tests
   first), how to correct ("quote the note number"), any open question, and two buttons: Copy
   "semantics confirmed" and Copy correction template.

## Build steps

1. Read the whole reference, including its tests. Tests are the spec; note their names for later.
2. List behaviors in plain language. For each, find the 3–8 lines that implement it.
3. Draft the target code for those lines only. Wherever the languages differ (integer vs float,
   inclusive ranges, weekday numbering, time zones, threads vs event loop, exceptions vs return
   values, library defaults), mark both regions and write a note.
4. Sort every difference into preserved / changed / dropped. Anything "changed" that a user could
   observe must also appear in the edge-case table.
5. Choose edge cases from the reference's tests plus the traps found in step 3. Fill both columns
   before choosing pills.

## Key snippets

```html
<pre class="m-0 px-5 py-4 overflow-x-auto text-[#e8e6de] font-mono text-[12.5px] leading-relaxed">…
    <span class="kw">return</span> <mark class="lk" :class="on('a3')" @mouseenter="p='a3'" @mouseleave="p=null">dom_ok <span class="kw">or</span> dow_ok<sup>3</sup></mark></pre>
…
<div class="border border-[#d1cfc5] bg-white rounded-xl p-4 flex gap-3 text-[13.5px] transition-colors"
  :style="note('a3')" @mouseenter="p='a3'" @mouseleave="p=null">
  <span class="nmark">3</span><span><strong class="text-[#141413]">OR, not AND.</strong> Why it matters…</span>
</div>
```

```css
mark.lk { background: rgba(217,119,87,.20); color: inherit; border-radius: 3px; padding: 0 2px; cursor: help; }
mark.lk.on { background: rgba(217,119,87,.55); outline: 1px solid #d97757; }
mark.lk sup { font-family: ui-monospace, monospace; font-size: 9.5px; color: #e8a58c; }
.nmark { display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 999px; background: #e3dacc; color: #141413; font-size: 11px; flex: none; }
```

## Interaction

- One `x-data="portMap()"` on `<main>` holding `p` (hovered pair id). `on(id)` returns
  `{ on: p === id }` for marks; notes bind `:style="note(id)"`, which returns
  `'border-color:#d97757;background:rgba(217,119,87,0.08)'` when active. Give notes a static
  `border-[#d1cfc5] bg-white` (Tailwind v4's bare `border` is currentColor); an inline style
  overrides it without class-order fights.
- Marks and notes both set `p` on hover, so the link works in either direction.
- `copy(text, key)` writes to the clipboard and flips `copied` to that key for 1.6 s; the
  correction template lives in a hidden `<pre x-ref="tpl">`.

## Pitfalls

- Translating everything. Show only the lines where semantics could drift; link the rest.
- Notes that describe the code instead of the *difference* ("this loops over parts").
- Trusting a target library's default (DST handling, rounding mode, sort stability) without a test.
- "Equivalent" used to hide a behavior change. If a user could notice it, it is "differs" or needs
  sign-off.
- Note numbers that restart per pair, so "note 3" is ambiguous in the user's reply.

## Combines well with

- [`implementation-plan.md`](implementation-plan.md): after sign-off, plan the port tests-first.
- [`blindspot-pass.md`](blindspot-pass.md): when the reference is large, find unknowns before mapping.

## Checklist

- [ ] Every pair's marks share ids across columns and match a numbered note.
- [ ] Each note names a concrete language/library difference and how the port handles it.
- [ ] Every user-visible change appears in both the ledger and the edge-case table.
- [ ] Sign-off says what happens next and offers both copy buttons.
