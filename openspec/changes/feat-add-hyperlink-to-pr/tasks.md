## 1. Segment Metadata

- [ ] 1.1 Extend the Git PR segment metadata lookup to request pull request `url` in addition to `number` and `title`.
- [ ] 1.2 Add a Git PR segment display mode setting with `both`, `name`, and `title` options, defaulting missing values to `both`.
- [ ] 1.3 Update the Git PR preview text to reflect the selected display mode.

## 2. Hyperlink Formatting

- [ ] 2.1 Implement Git PR visible text formatting for name only, title only, and both display modes.
- [ ] 2.2 Wrap Git PR visible text with an OSC 8 terminal hyperlink when a PR URL is available.
- [ ] 2.3 Preserve empty output when no active PR or URL is available.

## 3. Generated Script Parity

- [ ] 3.1 Update Bash generation for Git PR URL lookup, display modes, and hyperlink output.
- [ ] 3.2 Update Python generation for Git PR URL lookup, display modes, and hyperlink output.
- [ ] 3.3 Update Node generation for Git PR URL lookup, display modes, and hyperlink output.

## 4. Verification

- [ ] 4.1 Verify generated Bash, Python, and Node snippets include equivalent Git PR behavior.
- [ ] 4.2 Verify the Git PR segment editor exposes all three display modes.
- [ ] 4.3 Run available project validation and OpenSpec checks before review.
