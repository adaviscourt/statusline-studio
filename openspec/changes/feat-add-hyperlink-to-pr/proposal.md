## Why

The existing Git PR segment renders the current pull request as plain text, so users cannot open the PR directly from terminals that support clickable statusline hyperlinks. It also always combines the PR number and title, while issue #3 asks for display choices that can show the PR identifier, the title, or both.

## What Changes

- Add hyperlink support to the Git PR segment by retrieving the current PR URL and emitting an OSC 8 hyperlink around the displayed PR text.
- Add a Git PR display mode setting with three options: PR identifier only, title only, or both identifier and title.
- Preserve current Git PR behavior as the default display mode: identifier and title.
- Keep the segment omitted when `gh pr view` cannot resolve a PR or required PR data is unavailable.

## Capabilities

### New Capabilities

- `git-pr-segment`: Defines Git PR segment display behavior, hyperlink output, and display mode options.

### Modified Capabilities

- None.

## Impact

- Affected UI: Git PR segment properties, live preview, and saved segment state defaults.
- Affected code generation: Bash, Python, and Node statusline outputs for the Git PR segment.
- External command usage: `gh pr view` must request `number`, `title`, and `url`; no new runtime dependency is introduced beyond the existing `gh` usage and existing `jq` usage for Bash.
- Compatibility: Terminals without OSC 8 hyperlink support will display the PR text without clickable behavior; generated output must still be readable.
