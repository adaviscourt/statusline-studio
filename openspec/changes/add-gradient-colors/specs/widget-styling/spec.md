## ADDED Requirements

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
- **AND** the generated Bash, Python, and Node output remains a static ANSI gradient

### Requirement: Named Gradient Presets

The widget editor SHALL provide named gradient presets that can be applied to an individual widget.

#### Scenario: User selects a preset

- **GIVEN** gradient styling is enabled for a widget
- **WHEN** the user selects a named gradient preset
- **THEN** the widget stores the preset id and uses that preset's stops for rendering and export

#### Scenario: Preset names are reusable

- **GIVEN** named gradient presets exist
- **WHEN** multiple widgets select the same preset
- **THEN** each widget renders with the same preset stops while keeping independent widget settings

#### Scenario: Rainbow preset is available

- **GIVEN** gradient styling is enabled for a widget
- **WHEN** the user opens the named preset selector
- **THEN** a Rainbow preset is available for selection

### Requirement: Custom Hex Gradient Stops

The widget editor SHALL allow custom gradient stops using hex color values.

#### Scenario: User applies valid custom stops

- **GIVEN** gradient styling is enabled for a widget
- **WHEN** the user enters at least two valid hex color stops
- **THEN** the widget stores and uses those custom stops for rendering and export

#### Scenario: User enters invalid custom stops

- **GIVEN** gradient styling is enabled for a widget
- **WHEN** one or more custom stop values are not valid hex colors
- **THEN** the editor prevents applying the invalid custom gradient
- **AND** the existing valid widget styling remains unchanged

### Requirement: Gradient Persistence

Gradient styling configuration SHALL persist with the saved layout.

#### Scenario: Saved layout contains gradients

- **GIVEN** a user saves or reloads a layout containing widgets with gradient configuration
- **WHEN** the layout is loaded
- **THEN** each widget retains its gradient enabled state, preset id, and custom stops

#### Scenario: Existing saved layout has no gradients

- **GIVEN** a saved layout was created before gradient configuration existed
- **WHEN** the layout is loaded
- **THEN** the layout loads successfully
- **AND** widgets continue to use their fixed-color styling

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
