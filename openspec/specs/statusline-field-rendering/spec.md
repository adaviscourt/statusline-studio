# statusline-field-rendering Specification

## Purpose
TBD - created by archiving change bug-thinking-effort-not-showing-up. Update Purpose after archive.
## Requirements
### Requirement: Thinking Effort Runtime Rendering

Generated statusline scripts SHALL render the Thinking Effort widget from the current Claude Code statusline effort data when that widget is present in the saved configuration.

#### Scenario: Thinking Effort renders from effort level

- **GIVEN** a saved configuration includes the Thinking Effort widget
- **AND** the statusline input contains `effort.level` with a non-empty value
- **WHEN** Bash, Python, or Node generated statusline code runs with that input
- **THEN** the generated statusline output includes that effort level value
- **AND** the widget uses the configured prefix, suffix, icon, color, background, bold, gradient, max-width, separator, and powerline behavior

#### Scenario: Thinking Effort stays hidden when absent

- **GIVEN** a saved configuration includes the Thinking Effort widget
- **AND** the statusline input does not contain a non-empty effort level
- **WHEN** Bash, Python, or Node generated statusline code runs with that input
- **THEN** the generated statusline output omits the Thinking Effort widget
- **AND** surrounding widgets still render normally

#### Scenario: Saved Thinking Effort widgets remain compatible

- **GIVEN** a layout saved before this fix contains a `thinking_effort` widget
- **WHEN** the layout is loaded and downloaded again
- **THEN** the widget remains in the configuration without migration
- **AND** the newly generated statusline code reads Thinking Effort from the current effort data

### Requirement: Model Variant Runtime Rendering

Generated statusline scripts SHALL allow the Model Name widget to display either the base model label or the model-and-variant label.

#### Scenario: Model Name shows variant when enabled

- **GIVEN** a saved configuration includes the Model Name widget with variant display enabled
- **AND** the statusline input contains `model.display_name` with `Claude Opus 5`
- **WHEN** Bash, Python, or Node generated statusline code runs with that input
- **THEN** the generated statusline output includes `Opus 5`
- **AND** the output does not include the leading `Claude` brand prefix
- **AND** the widget uses the configured prefix, suffix, icon, color, background, bold, gradient, max-width, separator, and powerline behavior

#### Scenario: Model Name keeps base label when variant disabled

- **GIVEN** a saved configuration includes the Model Name widget with variant display disabled or unset
- **AND** the statusline input contains `model.display_name` with `Claude Opus 5`
- **WHEN** Bash, Python, or Node generated statusline code runs with that input
- **THEN** the generated statusline output includes `Opus`
- **AND** the generated statusline output does not include `Opus 5`

#### Scenario: Saved Model Name widgets remain compatible

- **GIVEN** a layout saved before this change contains a `model` widget
- **WHEN** the layout is loaded and downloaded again without changing the new variant option
- **THEN** the widget remains in the configuration without migration
- **AND** the generated statusline code keeps the current base-model-only behavior

