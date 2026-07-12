## Context

The app models each statusline widget as a segment object with fields such as `color`, `bgColor`, `bold`, `hide`, `prefix`, and `suffix`. Rendering is split across the canvas, preview, and generated Bash/Python/Node outputs. The issue asks for "per-widget gradients with named presets and custom hex stops", which requires a reusable segment-level style model instead of extending only the current context-widget threshold gradient.

## Decisions

### Segment Gradient Shape

Use a segment-local gradient object so each widget can opt in independently:

```js
gradient: {
  enabled: true,
  preset: "sunset",
  stops: ["#f06a6a", "#f0b429"]
}
```

When `gradient.enabled` is false or absent, existing `color` and `bgColor` fields remain authoritative.

### Presets

Named presets should be centralized in the color/style data module so the editor, preview, canvas, and code generation use the same names and stop values. Presets should have stable ids, labels, and at least two hex stops.

### Custom Stops

Custom stops should accept hex colors only. The editor should reject invalid stop values and require at least two valid stops before applying a custom gradient. Two-stop gradients are sufficient for the initial implementation, but the data model can support more stops if the UI chooses to expose that later.

### Generated Terminal Output

Terminals do not have a native gradient text primitive. Generated Bash, Python, and Node output should approximate the configured gradient by assigning ANSI 24-bit foreground color escape codes across the rendered widget text. Prefix, icon, widget value, and suffix should all remain present, and reset behavior must prevent color leakage.

Generated output may fall back to the first valid stop if per-character coloring would be unsafe for a widget-specific output path, but that fallback should be explicit in code and covered by tests or manual verification notes.

### Existing Context Threshold Gradient

The existing context widget percentage threshold option is separate from this feature. Implementation may keep it as-is, but the new general per-widget gradient controls should not break that behavior. If both are enabled on the same context widget, the general per-widget gradient should have a deterministic precedence documented in implementation notes.

## Risks

- Per-character ANSI gradients can complicate max-width truncation and generated code escaping.
- Hex validation must be consistent across editor controls and generated output paths.
- Preview and generated output can diverge if they use different gradient interpolation logic.
