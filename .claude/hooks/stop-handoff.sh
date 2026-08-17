#!/usr/bin/env bash
# Stop hook: fires after every assistant turn (not just at /compact time).
# Keeps .claude/handoff.md continuously up to date with a rolling digest of
# the real conversation — pure text extraction from the transcript, no model
# call, no extra token cost. This is what actually makes /clear safe: by the
# time you type /clear, the turn right before it has already been saved.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
HANDOFF_FILE="$REPO_ROOT/.claude/handoff.md"

INPUT="$(cat)"
TRANSCRIPT="$(echo "$INPUT" | jq -r '.transcript_path // empty' 2>/dev/null || true)"

[ -n "$TRANSCRIPT" ] && [ -f "$TRANSCRIPT" ] || exit 0

DIGEST="$(jq -r '
  select(.type=="user" or .type=="assistant") |
  if .type=="user" and (.message.content|type=="string") then
    "### Du\n" + .message.content + "\n"
  elif .type=="assistant" then
    (.message.content[]? | select(.type=="text") | "### Code\n" + .text + "\n")
  else empty end
' "$TRANSCRIPT" 2>/dev/null | tail -c 6000 || true)"

[ -n "$DIGEST" ] || exit 0

{
  echo "# Handoff (löpande, sparas automatiskt efter varje svar)"
  echo ""
  echo "_Senast uppdaterad: $(date -u +"%Y-%m-%dT%H:%M:%SZ") — täcker även /clear, eftersom detta skrevs innan /clear kördes._"
  echo ""
  echo "$DIGEST"
} > "$HANDOFF_FILE"
