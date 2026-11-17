import { css, run } from "uebersicht";

// Status of live Claude Code sessions, from Claude Code's own registry.
// Fixed-height card (460x98px): a header plus up to three 19px lines.
export const command = "bash claude-sessions.widget/sessions.sh";
export const refreshFrequency = 2000;

export const className = `
  right: 0;
  bottom: 0;
  font-family: -apple-system, system-ui;
  font-size: 15px;
  color: #fff;
  -webkit-font-smoothing: antialiased;
`;

const AMBER = "#f5a623";
const BLUE = "#5aa9f5";
const GREEN = "#7ed07e";

const card = css`
  width: 460px;
  height: 98px;
  box-sizing: border-box;
  padding: 8px 10px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
`;
const line = css`
  line-height: 19px;
  margin-bottom: 2px;
  display: flex;
  gap: 8px;
  white-space: nowrap;
  overflow: hidden;
`;
const grow = css` flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; `;
const clickable = css`
  cursor: pointer;
  &:hover { text-decoration: underline; }
`;
const dim = css` opacity: 0.65; `;

const ago = (ms) => {
  const m = Math.floor((Date.now() - ms) / 60000);
  return m < 1 ? "now" : m < 60 ? `${m}m` : `${Math.floor(m / 60)}h`;
};
const name = (s) => s.title || s.cwd.split("/").pop();
const q = (s) => `'${String(s).replace(/'/g, `'\\''`)}'`;

// Bring VS Code forward and reveal the session's Claude tab. Deliberately no
// `code <cwd>` first: when the cwd isn't an exact workspace root it opens a new window.
const focusSession = (s) =>
  run(`open ${q(`vscode://anthropic.claude-code/open?session=${s.id}`)}`);

const title = (s) => (
  <span className={clickable} onClick={() => focusSession(s)}>{name(s)}</span>
);

export const render = ({ output, error }) => {
  if (error) return <div className={card}>claude-sessions: no data ({String(error).slice(0, 80)})</div>;
  let sessions;
  try {
    sessions = JSON.parse(output);
  } catch (e) {
    return null; // first tick, before the command has produced output
  }

  const waiting = sessions.filter((s) => s.status === "waiting").sort((a, b) => a.since - b.since);
  const working = sessions.filter((s) => s.status === "busy");
  const done = sessions.filter((s) => s.status !== "waiting" && s.status !== "busy");
  const needsYou = waiting.length > 0;
  const active = needsYou || working.length > 0;

  const headline = !sessions.length
    ? "No sessions"
    : !active
      ? "All done"
      : [
          needsYou && (waiting.length === 1 ? "1 session needs your attention" : `${waiting.length} sessions need your attention`),
          working.length && `${working.length} working`,
        ].filter(Boolean).join(" · ");

  // One line per session, three max; each title is clickable to focus it in VS Code.
  // Sessions needing you always come first
  // (oldest wait first), then the most recently active of the rest.
  const recent = working.concat(done).sort((a, b) => b.since - a.since);
  const lines = waiting.slice(0, 3).map((s, i) => (
    <div key={s.id} className={line}>
      <span className={grow}>
        <span style={{ color: AMBER }}>Needs you</span> {title(s)} · {s.waitingFor || "waiting"}
      </span>
      <span className={dim}>
        {i === 2 && waiting.length > 3 ? `+${waiting.length - 3} more · ` : ""}{ago(s.since)}
      </span>
    </div>
  )).concat(recent.slice(0, Math.max(0, 3 - waiting.length)).map((s) => (
    <div key={s.id} className={line}>
      <span className={grow}>
        {s.status === "busy"
          ? <span style={{ color: BLUE }}>Working</span>
          : <span style={{ color: GREEN }}>Finished</span>}{" "}
        {title(s)}
      </span>
      {s.status !== "busy" && (
        <span className={dim}>{ago(s.since) === "now" ? "Just now" : `${ago(s.since)} ago`}</span>
      )}
    </div>
  )));

  return (
    <div className={card}>
      <div className={line} style={{ fontWeight: "bold" }}>
        <span className={grow}>{headline}</span>
      </div>
      {lines}
    </div>
  );
};
