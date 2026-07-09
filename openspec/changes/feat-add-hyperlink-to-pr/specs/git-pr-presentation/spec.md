## ADDED Requirements

### Requirement: Git PR segment emits clickable pull request text

The system SHALL render Git PR segment output as a terminal hyperlink when an active pull request URL is available.

#### Scenario: Active pull request has URL

- **WHEN** the Git PR segment resolves an active pull request with number, title, and URL
- **THEN** the generated statusline output includes visible Git PR text linked to the pull request URL

#### Scenario: No active pull request is available

- **WHEN** the Git PR segment cannot resolve an active pull request
- **THEN** the generated statusline output omits the Git PR segment

#### Scenario: Terminal does not support hyperlinks

- **WHEN** the generated statusline output is shown in a terminal that does not support terminal hyperlinks
- **THEN** the visible Git PR text remains readable without exposing raw escape text as user-facing content

### Requirement: Git PR segment supports display modes

The system SHALL allow each Git PR segment instance to choose whether visible pull request text shows the pull request name, the pull request title, or both.

#### Scenario: Name only display

- **WHEN** a Git PR segment is configured for name only display
- **THEN** the visible Git PR text contains the pull request name and excludes the pull request title

#### Scenario: Title only display

- **WHEN** a Git PR segment is configured for title only display
- **THEN** the visible Git PR text contains the pull request title and excludes the pull request name

#### Scenario: Both display

- **WHEN** a Git PR segment is configured for both display
- **THEN** the visible Git PR text contains both the pull request name and the pull request title

#### Scenario: Existing segment defaults

- **WHEN** a Git PR segment has no explicit display mode stored
- **THEN** the visible Git PR text uses the current combined name and title format

### Requirement: Git PR presentation is consistent across generated languages

The system SHALL generate equivalent Git PR hyperlink and display mode behavior for Bash, Python, and Node statusline scripts.

#### Scenario: Bash output

- **WHEN** the user generates a Bash statusline containing a Git PR segment
- **THEN** the Bash script resolves PR number, title, and URL and applies the configured display mode and hyperlink formatting

#### Scenario: Python output

- **WHEN** the user generates a Python statusline containing a Git PR segment
- **THEN** the Python script resolves PR number, title, and URL and applies the configured display mode and hyperlink formatting

#### Scenario: Node output

- **WHEN** the user generates a Node statusline containing a Git PR segment
- **THEN** the Node script resolves PR number, title, and URL and applies the configured display mode and hyperlink formatting
