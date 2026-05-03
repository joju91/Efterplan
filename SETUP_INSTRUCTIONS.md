# Claude Folder Setup — Instructions

## Efterplan repo (joju91/efterplan)

1. Ladda ner `efterplan_claude.zip`
2. Gå till repo-mappen:
   ```
   cd C:\Users\joju9\OneDrive\Dokument\GitHub\Efterplan
   ```
3. Unzipp filen (innehållet går direkt till repo-roten):
   ```
   unzip efterplan_claude.zip
   ```
4. Committa:
   ```
   git add .
   git commit -m "Add Claude workspace structure"
   git push
   ```

---

## Kalkyra repo (joju91/kalkyra)

1. Ladda ner `kalkyra_claude.zip`
2. Gå till repo-mappen:
   ```
   cd C:\Users\joju9\OneDrive\Dokument\GitHub\kalkyra
   ```
3. Unzipp filen (innehållet går direkt till repo-roten):
   ```
   unzip kalkyra_claude.zip
   ```
4. Committa:
   ```
   git add .
   git commit -m "Add Claude workspace structure"
   git push
   ```

---

## Vad du får

Både repos får nu:
- `README.md` — master index
- `GLOBAL_INSTRUCTIONS/system.md` — shared rules
- `ABOUT ME/` — din identitet + style guide
- `PROJECTS/[projekt]/` — brief.md, references/, drafts/
- `CLAUDE_OUTPUTS/[projekt]/` — genererad kod

Nästa gång du startar en Claude-session läser du bara `README.md` → `brief.md` → igång.

Done!
