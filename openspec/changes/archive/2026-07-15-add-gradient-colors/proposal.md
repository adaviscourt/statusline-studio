## Why

Statusline widgets currently support fixed ANSI foreground/background colors, while context widgets have a limited percentage-based color threshold option. Users need a general per-widget gradient styling feature with reusable named presets and custom hex stops.

## What Changes

- Add per-widget gradient configuration that can be enabled independently from the existing fixed color controls.
- Provide named gradient presets that users can pick from the widget editor.
- Allow custom gradient stops using hex colors, with validation before a custom gradient can be applied.
- Render selected gradients in the canvas chip and live preview.
- Preserve gradient configuration in local state and generated statusline code.

## Impact

- Affected specs: `widget-styling`
- Affected app areas: widget editor controls, canvas chip rendering, preview rendering, state persistence, generated Bash/Python/Node statusline output.
- Compatibility: existing widgets without gradients should keep their current color behavior.
