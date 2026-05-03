# Claude Folder — Jonas' Workspace

Your complete context folder for all Claude projects. Read this first, then dive into specific projects.

---

## Folder structure

```
claude/
├── ABOUT ME/                    # Who Jonas is, how he works
│   ├── about-me.md              # Core identity + values
│   └── anti-ai-writing-style.md # What NOT to do
│
├── PROJECTS/                    # Live work. One subfolder per project.
│   ├── efterplan/
│   │   ├── brief.md             # Current phase + priorities
│   │   ├── references/          # Research, GA4, competitor data
│   │   └── drafts/              # WIP code, copy, ideas
│   │
│   ├── kalkyra/
│   │   ├── brief.md             # Current phase + priorities
│   │   ├── references/          # Forum research, SEO data, market analysis
│   │   └── drafts/              # WIP forum posts, copy, code
│   │
│   └── [new_project]/           # Copy from TEMPLATES when starting something new
│
├── TEMPLATES/                   # Reusable patterns
│   ├── project_brief_template.md # Copy this for new projects
│   └── README.md                # This folder
│
├── GLOBAL_INSTRUCTIONS/         # Set once in Cowork
│   └── system.md                # Models, work style, quality standards
│
└── CLAUDE_OUTPUTS/              # Generated code, deliverables
    ├── efterplan/               # One subfolder per project
    ├── kalkyra/                 # Mirrors PROJECTS/ structure
    └── [new_project]/
```

---

## How to use this folder

### Before every session

1. **Read ABOUT ME** — who Jonas is, his voice, what he won't accept
2. **Read GLOBAL_INSTRUCTIONS** — how to work (Sonnet default, short plans, checkpoint questions)
3. **Read the relevant brief.md** — current priorities, blockers, metrics
4. **Skim references/** — recent data, competitor moves, user feedback

### During a session

1. **Ask one checkpoint question** before starting code work
2. **Work file-by-file** — don't scan entire projects unless asked
3. **Keep plans to 2-3 steps max** — fast iteration, no multi-week strategies
4. **Search/verify current data** before suggesting changes
5. **Test with users** before shipping big features

### After delivering work

- Output goes to **CLAUDE_OUTPUTS/[project]/**
- Draft versions stay in **PROJECTS/[project]/drafts/**
- Update **brief.md** with new blockers / next steps
- Leave a quick note in references if new data came in

---

## Project status at a glance

| Project | Phase | Status | Next priority |
|---------|-------|--------|---------------|
| **Efterplan** | SEO + conversion | Live on Vercel | Fix H1 + robots.txt + Stripe |
| **Kalkyra** | Distribution + polish | v1.0 shipped | J6 forum traction + SEO |
| **[New]** | [Phase] | [Status] | [Next] |

---

## Golden rules

✅ **Do this:**
- Read the briefs every session
- Ask before assuming
- Test with real users
- Keep context tight
- Work small + iterate fast

❌ **Don't do this:**
- Auto-read entire projects (only when asked)
- Write long multi-stage plans
- Suggest features without user validation
- Post to forums without approval
- Forget Swedish context (taxes, culture, market)

---

## Quick reference

**Models to use:**
- Sonnet (default code)
- Opus (only if Jonas asks or task needs long reasoning)
- Haiku (simple clarifications)

**Tools to use:**
- Claude Code (all coding)
- Chat (questions, planning)
- Cowork (multi-agent if needed)

**Approval gates:**
- Forum posts: get Jonas's explicit OK first
- Payment features: test in dev only
- User data: never store in code

---

## Questions?

Start by reading **ABOUT ME** + **brief.md** for the project. If still unclear, ask Jonas in chat.

---

**Last updated:** 2026-05-03
