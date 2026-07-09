## ADDED Requirements

### Requirement: Git PR segment hyperlinks to the pull request
The Git PR segment SHALL render the current pull request text as a hyperlink to the pull request URL in generated statusline output when the URL is available.

#### Scenario: Current PR has URL data
- **WHEN** generated Bash, Python, or Node statusline code resolves a current pull request with number, title, and URL data
- **THEN** the Git PR segment output contains the visible PR text wrapped in an OSC 8 hyperlink targeting the resolved PR URL

#### Scenario: Terminal supports OSC 8 hyperlinks
- **WHEN** a user clicks the rendered Git PR segment in a terminal that supports OSC 8 hyperlinks
- **THEN** the terminal opens the pull request URL in the user's default browser

#### Scenario: PR URL is unavailable
- **WHEN** generated statusline code cannot resolve a current pull request URL
- **THEN** the Git PR segment does not render a broken or empty hyperlink

### Requirement: Git PR segment supports display modes
The Git PR segment SHALL allow each segment instance to choose whether the visible PR text shows the PR identifier only, the PR title only, or both the PR identifier and title.

#### Scenario: Identifier-only display mode
- **WHEN** the Git PR segment display mode is set to identifier-only
- **THEN** the visible PR text contains the PR identifier, such as `#123`, and does not include the PR title

#### Scenario: Title-only display mode
- **WHEN** the Git PR segment display mode is set to title-only
- **THEN** the visible PR text contains the PR title and does not include the PR identifier

#### Scenario: Both display mode
- **WHEN** the Git PR segment display mode is set to both
- **THEN** the visible PR text contains the PR identifier followed by the PR title

#### Scenario: Existing segment without display mode
- **WHEN** a saved Git PR segment does not have a display mode value
- **THEN** the segment defaults to both display mode

### Requirement: Git PR preview reflects display mode
The editor preview SHALL show representative Git PR text matching the selected display mode for the Git PR segment.

#### Scenario: Preview for identifier-only mode
- **WHEN** the user selects identifier-only mode for the Git PR segment
- **THEN** the live preview shows only representative PR identifier text

#### Scenario: Preview for title-only mode
- **WHEN** the user selects title-only mode for the Git PR segment
- **THEN** the live preview shows only representative PR title text

#### Scenario: Preview for both mode
- **WHEN** the user selects both mode for the Git PR segment
- **THEN** the live preview shows representative PR identifier and title text

### Requirement: Git PR hyperlink preserves segment styling
The Git PR segment SHALL preserve configured segment styling and surrounding text while adding hyperlink behavior.

#### Scenario: Styled linked PR text
- **WHEN** the Git PR segment has icon, prefix, suffix, color, background color, bold, or max-width settings
- **THEN** the generated output applies those settings to the visible PR segment text while keeping the hyperlink target as the PR URL
