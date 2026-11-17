# claude-sessions.widget

A compact desktop card, bottom-right, showing the status of your running Claude Code sessions:

- **Header** — how many sessions need your attention and how many are working, or "All done".
- **Up to three session lines** — sessions that need you always come first (amber **Needs you**, oldest wait first), then your most recently active sessions (blue **Working**, green **Finished**).
- **Click a session title** to switch VS Code to that session's Claude tab.

Refreshes every 2 seconds.

## Requirements

- macOS with [Übersicht](http://tracesof.net/uebersicht/)
- [`jq`](https://jqlang.github.io/jq/) (`brew install jq`)
- [Claude Code](https://claude.com/product/claude-code), with the VS Code extension if you want click-to-focus
- For clicking to work, Übersicht's interaction must be enabled in its preferences

## How it works

`sessions.sh` reads Claude Code's own per-process session registry (`~/.claude/sessions/<pid>.json`), which records each session's status as `busy`, `idle` or `waiting`. Sessions whose process has exited, or that were opened but never prompted, are skipped. Session titles come from the `ai-title` records in each transcript and are cached in `~/Library/Caches/claude-sessions-widget/` for 5 minutes, because transcripts can be very large.

Clicking a title opens `vscode://anthropic.claude-code/open?session=<id>`, which the Claude Code extension handles by revealing the session's existing tab.

Nothing leaves your machine: no network calls, no tokens, no telemetry.

## Caveats

- **Relies on undocumented Claude Code internals** — the session registry format, the `ai-title` transcript records and the extension's URI handler. A Claude Code update could change any of them.
- **Multiple VS Code windows** — the link is handled by the most recently focused window. Clicking a session that lives in a different window may open a copy of it there instead of switching windows.
- **Privacy on screen** — session titles are generated from your conversations, so they're visible on your desktop during screen shares.
