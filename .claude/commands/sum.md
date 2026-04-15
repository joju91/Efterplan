Generate a minimal session summary for continuing work in a new Claude Code session.

Run these commands silently and use the output to build the summary:
- git log --oneline -10
- git status
- git branch --show-current
- cat efterplan-plan.md 2>/dev/null || true

Output ONLY the following block, nothing else — no intro, no explanation:

---
## Session-summering

**Repo:** [repo name] · **Branch:** [current branch]

### Gjort denna session
[Bullet list of commits made this session — one line each, focus on what changed and why]

### Aktuellt läge
[2–4 meningar: vad är live, vad är deployat, vad väntar på åtgärd]

### Nästa steg
[Bullet list of concrete next actions, max 5]

### Viktigt att veta
[Any gotchas, blockers, or context that must not be forgotten — max 3 bullets]
---
