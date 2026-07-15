## Why

Users can add the Thinking Effort widget to a configuration and download a generated statusline script, but the widget does not render at runtime. The current widget definition reads a session-scoped `thinking_effort` value, while Claude Code statusline input now exposes the thinking effort under the top-level `effort` object.

## What Changes

- Update the Thinking Effort widget runtime data lookup for generated Bash, Python, and Node statusline output.
- Preserve the existing widget label, icon, preview value, style options, ordering, persistence, and download flow.
- Add verification that a generated downloaded script emits Thinking Effort when the input contains effort data.
- Keep behavior quiet when no effort data is present, matching the current optional-widget pattern.

## Impact

- Affected specs: `statusline-field-rendering`
- Affected app areas: Thinking Effort segment definition and generated Bash/Python/Node statusline output.
- Compatibility: saved configurations containing `thinking_effort` widgets should continue to load and render without migration.
