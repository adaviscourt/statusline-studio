## MODIFIED Requirements

### Requirement: Per-Widget Gradient Styling

Each statusline widget SHALL allow gradient styling to be enabled or disabled independently.

#### Scenario: Widget uses existing fixed color when gradient is disabled

- **GIVEN** a widget has gradient styling disabled or no gradient configuration
- **WHEN** the widget is rendered or exported
- **THEN** the existing foreground and background color settings are used

#### Scenario: Widget uses gradient when enabled

- **GIVEN** a widget has gradient styling enabled with a valid gradient
- **WHEN** the widget is rendered in the canvas, live preview, or generated output
- **THEN** the widget content is styled with the selected gradient instead of the fixed foreground color

#### Scenario: Emoji icon is not gradient-colored

- **GIVEN** a widget has gradient styling enabled and uses an emoji icon
- **WHEN** the widget is rendered in the canvas, live preview, or generated output
- **THEN** the emoji icon is emitted without gradient foreground coloring
- **AND** the widget text remains styled with the selected gradient

#### Scenario: Widget uses animated gradient in browser preview surfaces

- **GIVEN** a widget has gradient styling enabled with animation enabled
- **WHEN** the widget is rendered in the editor preview, canvas, or live preview
- **THEN** the gradient styling sweeps across the widget text

#### Scenario: Widget uses animated gradient in installed statusline output

- **GIVEN** a widget has gradient styling enabled with animation enabled
- **AND** the generated Bash, Python, or Node statusline script has been installed in Claude Code
- **WHEN** Claude Code invokes the installed statusline command repeatedly while the TUI is visible
- **THEN** the generated ANSI colors for that widget vary by time-based animation phase
- **AND** the TUI renders the gradient as animated frames instead of one static rainbow

### Requirement: Generated Statusline Gradient Output

Generated Bash, Python, and Node statusline scripts SHALL preserve gradient styling for widgets with valid gradient configuration.

#### Scenario: Export includes named gradient

- **GIVEN** a widget uses a named gradient preset
- **WHEN** Bash, Python, or Node code is generated
- **THEN** the generated code includes the ANSI color behavior needed to render that widget with the selected gradient
- **AND** the generated code resets color after the widget

#### Scenario: Export includes custom gradient

- **GIVEN** a widget uses valid custom hex stops
- **WHEN** Bash, Python, or Node code is generated
- **THEN** the generated code includes the ANSI color behavior needed to render that widget with those custom stops
- **AND** the generated code resets color after the widget

#### Scenario: Export includes animated gradient frames

- **GIVEN** a widget uses a named or custom gradient with animation enabled
- **WHEN** Bash, Python, or Node code is generated
- **THEN** the generated code includes time-based ANSI gradient frame behavior for that widget
- **AND** consecutive invocations at different animation phases produce different foreground color sequences for the same widget text
- **AND** the generated code resets color after the widget

#### Scenario: Export keeps static gradient when animation is disabled

- **GIVEN** a widget uses a named or custom gradient with animation disabled
- **WHEN** Bash, Python, or Node code is generated
- **THEN** consecutive invocations for the same widget text produce the same ANSI gradient color sequence
- **AND** the generated code resets color after the widget
