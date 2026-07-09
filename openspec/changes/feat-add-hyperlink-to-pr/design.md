## Context

The existing `git_pr` segment uses `gh pr view --json number,title` and renders plain text in the generated Bash, Python, and Node statusline scripts. Segment-specific options already exist through `editorFields`, so the display mode can follow the current segment settings pattern.

Terminals commonly support clickable links through OSC 8 escape sequences. The generated scripts should emit a hyperlink only when both visible pull request text and a pull request URL are available, and otherwise keep the current empty-output behavior.

## Goals / Non-Goals

**Goals:**

- Retrieve the active pull request number, title, and URL for the Git PR segment.
- Format visible PR text using a segment-level display mode: name, title, or both.
- Wrap the visible PR text in a terminal hyperlink so supported terminals open the PR URL when clicked.
- Keep generated Bash, Python, and Node output behavior aligned.

**Non-Goals:**

- Add a browser-opening command to the statusline script.
- Change how `gh pr view` selects the active pull request.
- Add provider support beyond GitHub CLI.
- Implement application code during this planning change.

## Decisions

- Use OSC 8 terminal hyperlinks around the rendered Git PR text.
  - Rationale: OSC 8 is the standard terminal mechanism for clickable links and delegates opening behavior to the terminal/default browser.
  - Alternative considered: print the raw URL next to the PR text. That would be less ergonomic and would not satisfy the request for the Git PR text itself to be clickable.

- Extend the existing GitHub CLI JSON query to include `url`.
  - Rationale: `gh pr view --json number,title,url` provides all required metadata without new dependencies.
  - Alternative considered: derive the URL from remote metadata and PR number. That would add parsing complexity and fail more often for nonstandard remotes.

- Store display mode as a segment-specific setting on the Git PR segment.
  - Rationale: Other segment variants already use `editorFields` for per-segment controls, and display mode belongs to the segment instance rather than global settings.
  - Alternative considered: make it a global Git PR setting. That would be inconsistent with per-segment customization and less flexible.

## Risks / Trade-offs

- Some terminals may not support OSC 8 hyperlinks -> The visible PR text still renders normally, so the output remains useful.
- The `url` field may be unavailable if `gh` fails or no PR exists -> Preserve empty Git PR output in that case.
- Escape sequence handling differs across generated languages -> Keep equivalent helper logic or localized formatting in Bash, Python, and Node and verify generated output for all three.
