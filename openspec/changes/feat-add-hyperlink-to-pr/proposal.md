## Why

The Git PR statusline segment currently emits plain pull request text, so users cannot open the active pull request directly from terminals that support hyperlinks. Users also need control over whether the segment emphasizes the pull request number, title, or both.

## What Changes

- Make the Git PR segment able to render as a terminal hyperlink that opens the pull request URL in the user's default browser when clicked.
- Add a Git PR display mode setting with options for name only, title only, or both.
- Preserve graceful empty output when no pull request is available or GitHub CLI data cannot be read.

## Capabilities

### New Capabilities

- `git-pr-presentation`: Covers how the Git PR segment resolves pull request metadata, formats visible text, and emits clickable links.

### Modified Capabilities

- None.

## Impact

- Affects the Git PR segment definition and generated shell/Python/Node statusline output.
- Affects the segment settings UI/state for Git PR-specific display options.
- Uses existing GitHub CLI pull request lookup behavior and must include the pull request URL in retrieved metadata.
