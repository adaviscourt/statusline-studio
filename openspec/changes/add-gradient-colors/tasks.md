## 1. Data Model

- [ ] Define named gradient presets with stable ids, labels, and hex stops.
- [ ] Add default gradient fields to new segment creation without changing existing fixed-color defaults.
- [ ] Ensure saved layouts with and without gradient fields load without migration errors.

## 2. Editor Controls

- [ ] Add per-widget gradient enable/disable control.
- [ ] Add preset selection for named gradients.
- [ ] Add custom hex stop inputs with validation and clear invalid-state feedback.
- [ ] Preserve existing foreground/background color controls for non-gradient use.

## 3. Rendering

- [ ] Render enabled gradients on canvas chips.
- [ ] Render enabled gradients in the live preview.
- [ ] Keep hidden, bold, prefix, suffix, icon, separator, and max-width behavior intact.

## 4. Code Generation

- [ ] Generate Bash output that applies the selected gradient using ANSI 24-bit color escape codes or a documented fallback.
- [ ] Generate Python output that applies the selected gradient using ANSI 24-bit color escape codes or a documented fallback.
- [ ] Generate Node output that applies the selected gradient using ANSI 24-bit color escape codes or a documented fallback.
- [ ] Prevent color reset leakage across widget boundaries and rows.

## 5. Verification

- [ ] Validate the OpenSpec change.
- [ ] Manually verify creating widgets with fixed colors, named gradients, and custom gradients.
- [ ] Manually verify generated Bash/Python/Node statusline code for at least one named preset and one custom gradient.
