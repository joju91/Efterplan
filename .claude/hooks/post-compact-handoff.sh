#!/usr/bin/env bash
# PostCompact hook: after Claude Code compacts context (manual /compact or
# automatic when the context window fills up), grab the summary it already
# generated and persist it to .claude/handoff.md. No extra model call, no
# extra token cost — we're just saving output the compaction step produced
# anyway. SessionStart then auto-injects this file into the next session,
# on any device.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
HANDOFF_FILE="$REPO_ROOT/.claude/handoff.md"
DEBUG_FILE="$REPO_ROOT/.claude/hooks/.last-postcompact-input.json"

INPUT="$(cat)"

# Keep the raw hook payload around so the summary-field name can be
# confirmed/fixed after the first real compaction (see .gitignore).
echo "$INPUT" > "$DEBUG_FILE" 2>/dev/null || true

# Try the plausible field names for the generated summary, in order.
SUMMARY="$(echo "$INPUT" | jq -r '
  .summary // .compact_summary // .compaction_summary // .message // .content // empty
' 2>/dev/null || true)"

# Fallback: if no summary field was found but a transcript path was given,
# grab its tail so we still save *something* rather than nothing.
if [ -z "$SUMMARY" ]; then
  TRANSCRIPT="$(echo "$INPUT" | jq -r '.transcript_path // empty' 2>/dev/null || true)"
  if [ -n "$TRANSCRIPT" ] && [ -f "$TRANSCRIPT" ]; then
    SUMMARY="(Ingen strukturerad sammanfattning hittades i hook-datan — sparade svansen av transcripten istället. Se $DEBUG_FILE för att justera fältnamnet.)

$(tail -c 4000 "$TRANSCRIPT")"
  fi
fi

if [ -n "$SUMMARY" ]; then
  {
    echo "# Handoff"
    echo ""
    echo "_Senast uppdaterad automatiskt av PostCompact-hooken: $(date -u +"%Y-%m-%dT%H:%M:%SZ")_"
    echo ""
    echo "$SUMMARY"
  } > "$HANDOFF_FILE"
fi
