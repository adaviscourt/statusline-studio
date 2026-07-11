## 1. Segment Data and Editor Options

- [x] 1.1 Add a Git PR display mode editor field with identifier-only, title-only, and both options.
- [x] 1.2 Add a saved segment default for the Git PR display mode that preserves current identifier-and-title output.
- [x] 1.3 Update Git PR preview output so each display mode is represented in the live preview.

## 2. Runtime PR Data

- [x] 2.1 Update Bash Git PR data retrieval to request `number`, `title`, and `url` from `gh pr view`.
- [x] 2.2 Update Python Git PR data retrieval to request and store PR number, title, and URL.
- [x] 2.3 Update Node Git PR data retrieval to request and store PR number, title, and URL.
- [x] 2.4 Preserve current omission behavior when the current PR cannot be resolved.

## 3. Hyperlink Output

- [x] 3.1 Generate Git PR visible text according to the selected display mode in Bash, Python, and Node.
- [x] 3.2 Wrap Git PR visible text in an OSC 8 hyperlink targeting the PR URL when URL data is available.
- [x] 3.3 Ensure existing styling controls, prefix, suffix, icon, and max-width behavior still apply to the visible Git PR segment text.

## 4. Verification

- [x] 4.1 Verify generated Bash, Python, and Node snippets include URL retrieval and OSC 8 hyperlink output for the Git PR segment.
- [x] 4.2 Verify the Git PR display mode option changes live preview text for identifier-only, title-only, and both modes.
- [x] 4.3 Run OpenSpec validation for `feat-add-hyperlink-to-pr`.
