# ubersicht-widgets

My collection of [Übersicht](http://tracesof.net/uebersicht/) widgets.

| Widget | What it does |
|---|---|
| [claude-sessions.widget](claude-sessions.widget) | Live status of your Claude Code sessions: which need your attention, which are working, which have finished. |

## Install a widget

Symlink it into your Übersicht widgets folder (Übersicht menu → *Open Widgets Folder* shows where that is):

```bash
ln -s "$PWD/claude-sessions.widget" "<your widgets folder>/claude-sessions.widget"
```

A symlink keeps the widget tied to this checkout, so `git pull` picks up changes.
