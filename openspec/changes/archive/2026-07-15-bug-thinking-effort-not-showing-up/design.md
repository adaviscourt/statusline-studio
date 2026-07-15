## Context

The app stores widgets as segment objects and generates Bash, Python, and Node scripts from `SEGMENT_DEFS`. Thinking Effort already appears in the widget palette, can be saved in layouts, and has a static preview value. The bug is specific to generated runtime output after users download their configuration.

Claude Code statusline input exposes thinking effort as an `effort` object with a `level` value. The existing implementation reads `.session.thinking_effort`, so generated scripts see an empty value and skip output.

## Decisions

### Runtime Source

Read Thinking Effort from `effort.level` in all generated languages:

- Bash: `jq -r '.effort.level // empty'`
- Python: `(data.get("effort") or {}).get("level", "")`
- Node: `data.effort?.level || ''`

### Compatibility Fallback

Implementations may keep a fallback to the older session path if useful, but `effort.level` must be the primary source and must work by itself. A fallback must not mask empty top-level effort data with stale session data.

### Rendering Semantics

Thinking Effort remains optional. If no value exists, generated output should emit nothing for that widget. If a value exists, it should pass through the same `renderBashOut`, `renderPyOut`, and `renderNodeOut` helpers as other widgets so prefixes, suffixes, icons, colors, gradients, bold, max-width, separators, and powerline behavior stay consistent.

## Risks

- Bash, Python, and Node definitions can drift if only one generated language is changed.
- A fallback path could accidentally prefer obsolete data over the current statusline schema.
- Verification needs a realistic statusline input sample, not only the static browser preview.
