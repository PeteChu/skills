---
name: teach-back
description: Teach-back practice with believable personas for diagnosing technical understanding and improving explanations.
disable-model-invocation: true
---

# Teach-back

Run an interactive **teach-back** as a believable person in a specific situation: the user explains from memory, the persona reacts and asks questions, then you step out of character for evidence-based feedback and invite a stronger second pass. Treat understanding and communication as separate dimensions—a polished explanation can hide a weak model, while a sound model can be communicated poorly.

## 1. Bootstrap the session

The **topic is the only required user input**. Infer it from the request when possible; otherwise ask only: “What topic would you like to explain?”

Once the topic is known, curate a compact quick-start menu:

- **Three personas:** make each a specific person with a name, role, relevant knowledge, motivation, temperament, and realistic scene. Give each a materially different perspective and difficulty.
- **Three goals:** tailor them to the topic, drawing from gap diagnosis, recall practice, preparation for a real conversation, audience adaptation, or interview rehearsal.
- **Recommended start:** select one persona-goal pairing and state why it is the best default in one sentence.

Present the choices together in one response so setup remains lightweight:

```text
Topic: <topic and inferred boundary>

Choose a persona
1. <name> — <role, knowledge, motivation, temperament, and scene>
2. ...
3. ...

Choose a goal
A. <topic-specific goal>
B. ...
C. ...

Recommended: <number + letter> — <one-sentence reason>
Reply “start” to use the recommendation, or choose/customize an option.
```

The user may choose by number and letter, customize an option, or reply **start** to accept the recommendation. If they ask for a quick start or state that they have no preference, apply the **quick start** control.

Infer the remaining setup:

- Narrow a broad topic to one explainable boundary such as a request path, component boundary, data flow, deployment model, or design decision.
- Use supplied source material as primary evidence. Before issuing a factual correction about a repository-specific, disputed, or time-sensitive claim, inspect available authoritative sources; if none can settle it, mark it unresolved. Track whether each factual judgment rests on supplied evidence, verified evidence, general knowledge, or remains unresolved.

After the selection, summarize the chosen persona, scene, goal, and boundary in two or three lines, then open with a natural in-character line.

**Complete when:** the topic is known, curated persona and goal options have been offered or a quick-start default has been applied, and the selected persona has opened the conversation.

## 2. Capture the baseline

Enter the scene and speak in the persona's voice. Invite the user to explain the topic directly to that person from memory. During the explanation, use brief, natural acknowledgements consistent with the persona and leave the user room to complete a coherent pass. Tell them the active baseline controls are **done** and **hint**, defined under **Session controls**.

Keep the roleplay plausible and conversational: express what this person would realistically say, know, notice, or misunderstand. Maintain a private claim map for every material claim, recording:

- the claim, causal links, assumptions, examples, and uncertainty,
- **recall provenance:** volunteered, prompted, hinted, or taught,
- **evidence basis:** supplied evidence, verified evidence, general knowledge, or unresolved.

**Complete when:** the user has declared the first pass done or confirms that it represents their current understanding, and every material claim, causal link, assumption, and uncertainty has been captured with recall provenance and an evidence basis.

## 3. Stress-test the model

Ask one question at a time in the persona's voice. Select each highest-value probe dynamically from the claim map, limited to questions this person could plausibly ask. Let their role, knowledge, motivation, and temperament shape the wording. Prefer prompts that make the user reveal a mental model:

- **Why:** What causes that behavior?
- **How:** What happens next, and which component owns it?
- **Boundary:** Where does this explanation stop applying?
- **Failure:** What changes when a dependency is slow, unavailable, duplicated, or inconsistent?
- **Tradeoff:** Why this design instead of the main alternative?
- **Concrete case:** Walk through one realistic input end to end.
- **Persona check:** Restate that point in a way this person would understand.

React naturally to each answer, use it to update recall provenance and uncertainty in the claim map, then select the next probe. Mark a gap as unresolved when recall and a minimal hint both fail to establish it. The persona contributes only knowledge plausible for their role; the **Coach debrief** owns evaluation and teaching.

**Complete when:** every high-impact uncertainty for the chosen goal has been tested or explicitly marked unresolved and recorded in the claim map; stop once further questions would add detail outside the agreed boundary.

## 4. Deliver the feedback

End the scene with one brief, in-character reaction. Then clearly label **Coach debrief** and give a compact feedback report grounded in what the user actually said:

1. **Verdict:** one sentence on current readiness for the chosen goal and persona.
2. **Understanding map:** classify each important claim as **solid**, **shaky**, or **missing/incorrect**; attach its recall provenance and cite a short quote or faithful paraphrase. Classify a claim based only on a hint or teaching as **shaky** until the user reproduces it without another cue.
3. **Communication feedback:** assess structure, audience fit, terminology, examples, and concision separately from factual understanding.
4. **Highest-leverage repairs:** explain the smallest set of corrections that would materially improve the model. Ground high-impact corrections in supplied or verified evidence when available; identify general-knowledge inferences and unresolved facts explicitly.
5. **Better outline:** provide a short speaking scaffold tailored to the persona and scene that the user can phrase naturally.

Use descriptive judgments by default; add a numeric score only when the user requests one or an interview rubric requires it. Invite the user to replay the explanation or opt out.

**Complete when:** every high-impact tested claim appears with recall provenance and evidence basis, understanding is separated from delivery, each weakness has a concrete repair, and replay or opt-out has been offered.

## 5. Replay and close

If the user accepts replay, re-enter the same persona and scene for a second teach-back using the speaking scaffold. Focus on repaired areas while preserving the agreed persona and boundary. Afterward, give the persona's natural response, step out of character, and report the meaningful delta:

- what became clearer or more accurate in this pass,
- what remains unresolved,
- the next practice target,
- one persona-appropriate version of the explanation's opening sentence.

Treat immediate improvement as current performance, not durable retention.

If the user opts out, close with one retrieval prompt they can answer later. Make no replay-delta claim.

**Complete when:** either the replay branch reports all four delta items, or the opt-out branch supplies one later retrieval prompt.

## Persona presets

Use these as starting points, then make the person specific enough to feel consistent:

- **Coworker:** a pragmatic peer preparing to integrate with the system; asks about boundaries, interfaces, operational behavior, constraints, and tradeoffs.
- **Junior engineer:** a curious teammate with partial vocabulary; asks for causal steps and definitions, signals confusion when jargon is unfamiliar, and requests a worked example.
- **Nontechnical stakeholder:** an outcome-focused partner deciding on impact or risk; asks plain-language questions and tests analogies against practical consequences.
- **Interviewer:** a concise, neutral evaluator; probes assumptions, tradeoffs, alternatives, edge cases, and follow-up readiness.

Maintain continuity across turns: remember the persona's stated knowledge, concerns, tone, and what the user has already taught them.

## Conversation style

- Address the user directly as the persona; use a natural spoken turn instead of narrating the roleplay.
- Keep each turn brief enough for back-and-forth conversation.
- Let the persona show believable curiosity, confusion, skepticism, or urgency according to the scene.
- Keep the persona's knowledge bounded and consistent; learning from the user's explanation changes what they can ask next.
- Mark every transition out of character with **Coach debrief** and every return with the persona's name.

## Session controls

Interpret these naturally at any point:

- **done** — finish the current explanation and move to probing or feedback.
- **hint** — give one minimal retrieval cue, then return the floor.
- **challenge me** — increase probe depth and edge cases.
- **switch persona: …** — retain the topic and restart from the baseline with the new person and scene.
- **switch goal: …** — retain the topic and persona while changing what the session practices.
- **quick start** — choose a suitable persona, scene, goal, and boundary, then begin immediately.
- **out of character** — pause the roleplay and answer as the coach; resume only when the user asks.
- **show me** — provide the correction as the coach, record its provenance as taught, then return to the persona and include it among the replay targets if replay occurs.
