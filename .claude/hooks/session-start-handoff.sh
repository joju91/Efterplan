#!/usr/bin/env bash
# SessionStart hook: automatically feeds the last saved handoff (if any) into
# a fresh session's context — regardless of whether the session started via
# /clear, /compact, /resume, or a brand new device (mobile/desktop/web).
# No manual "read handoff.md" step required.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
HANDOFF_FILE="$REPO_ROOT/.claude/handoff.md"

if [ -f "$HANDOFF_FILE" ] && [ -s "$HANDOFF_FILE" ]; then
  CONTENT="$(cat "$HANDOFF_FILE")"
  jq -n --arg ctx "Tidigare sessionsstatus (auto-sparad i .claude/handoff.md, laddas alltid in automatiskt vid ny session/enhet):

$CONTENT" \
    '{hookSpecificOutput: {hookEventName: "SessionStart", additionalContext: $ctx}}'
fi
