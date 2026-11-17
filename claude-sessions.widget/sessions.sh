#!/bin/bash
# Prints a JSON array of live Claude Code sessions, read from Claude Code's own
# registry (~/.claude/sessions/<pid>.json). status is busy | idle | waiting.
PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
CACHE="$HOME/Library/Caches/claude-sessions-widget"
mkdir -p "$CACHE"

for f in "$HOME"/.claude/sessions/*.json; do
  [ -e "$f" ] || continue
  kill -0 "$(basename "$f" .json)" 2>/dev/null || continue   # process has exited
  sid=$(jq -r '.sessionId // empty' "$f")
  [ -n "$sid" ] || continue
  transcript=$(ls "$HOME"/.claude/projects/*/"$sid".jsonl 2>/dev/null | head -1)
  [ -n "$transcript" ] || continue                            # opened but never prompted
  # Transcripts can be 100MB+, so cache the title and rescan at most every 5 min.
  # Untitled sessions aren't cached, so a new session picks up its title promptly.
  cache="$CACHE/$sid"
  if [ -z "$(find "$cache" -mmin -5 2>/dev/null)" ]; then
    t=$(grep -a '"type":"ai-title"' "$transcript" | tail -1 | jq -r '.aiTitle // empty')
    [ -n "$t" ] && printf '%s\n' "$t" > "$cache"
  fi
  title=$(cat "$cache" 2>/dev/null)
  jq -c --arg title "$title" \
    'select(.kind == "interactive") | {id: .sessionId, status, waitingFor, cwd, title: $title, since: .statusUpdatedAt}' "$f"
done | jq -s .
