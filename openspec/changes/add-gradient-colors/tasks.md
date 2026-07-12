## 1. Data Model

- [x] Define named gradient presets with stable ids, labels, and hex stops.
- [x] Add default gradient fields to new segment creation without changing existing fixed-color defaults.
- [x] Ensure saved layouts with and without gradient fields load without migration errors.

## 2. Editor Controls

- [x] Add per-widget gradient enable/disable control.
- [x] Add preset selection for named gradients.
- [x] Add custom hex stop inputs with validation and clear invalid-state feedback.
- [x] Preserve existing foreground/background color controls for non-gradient use.

## 3. Rendering

- [x] Render enabled gradients on canvas chips.
- [x] Render enabled gradients in the live preview.
- [x] Keep hidden, bold, prefix, suffix, icon, separator, and max-width behavior intact.

## 4. Code Generation

- [x] Generate Bash output that applies the selected gradient using ANSI 24-bit color escape codes or a documented fallback.
- [x] Generate Python output that applies the selected gradient using ANSI 24-bit color escape codes or a documented fallback.
- [x] Generate Node output that applies the selected gradient using ANSI 24-bit color escape codes or a documented fallback.
- [x] Prevent color reset leakage across widget boundaries and rows.

## 5. Verification

- [x] Validate the OpenSpec change.
- [x] Manually verify creating widgets with fixed colors, named gradients, and custom gradients.
- [x] Manually verify generated Bash/Python/Node statusline code for at least one named preset and one custom gradient.

## 6. Feedback

- [x] Confirm the Rainbow named preset is available.
- [x] Keep emoji icons outside gradient foreground coloring in canvas, live preview, and generated Bash/Python/Node output.
- [x] Add opt-in animated gradients for editor preview, canvas chips, and live preview.
