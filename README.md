# ubersicht-widgets

My collection of [Übersicht](http://tracesof.net/uebersicht/) widgets.

| Widget | What it does |
|---|---|
| [claude-sessions.widget](claude-sessions.widget) | Live status of your Claude Code sessions: which need your attention, which are working, which have finished. |

### claude-sessions.widget

<img src="examples/needs-attention.png" alt="claude-sessions widget showing two sessions that need attention and one working" width="480">

More states (working, all done, overflow) are in [examples/](examples).

## Install a widget

Symlink it into your Übersicht widgets folder (Übersicht menu → *Open Widgets Folder* shows where that is):

```bash
ln -s "$PWD/claude-sessions.widget" "<your widgets folder>/claude-sessions.widget"
```

A symlink keeps the widget tied to this checkout, so `git pull` picks up changes.
