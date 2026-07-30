## Why

The Model Name widget can render only the base model family in common configurations. Users expect an opt-in setting that keeps the model variant in the displayed label, for example showing `Opus 5` instead of only `Opus`.

## What Changes

- Add a Model Name widget option that renders the full model-and-variant label when enabled.
- Keep the existing base-model-only output available when the option is disabled.
- Apply the option consistently to the browser preview and generated Bash, Python, and Node statusline output.
- Preserve existing Model Name widget styling, icon, prefix, suffix, max-width, separators, powerline behavior, persistence, and saved layouts.

## Impact

- Affected specs: `statusline-field-rendering`
- Affected app areas: Model Name widget editor controls, preview rendering, state persistence, and generated Bash/Python/Node statusline output.
- Compatibility: saved configurations without the new option continue to display the current base model label.
