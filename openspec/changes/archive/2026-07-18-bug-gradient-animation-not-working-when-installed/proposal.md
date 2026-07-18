## Why

Gradient animation works in browser-rendered surfaces because CSS can continuously animate background position. Installed statusline scripts currently emit one static ANSI gradient frame, so Claude Code TUI shows a fixed rainbow after install.

## What Changes

- Update the generated Bash, Python, and Node statusline output so widgets with `gradient.animated` enabled emit time-phased ANSI gradient frames instead of one fixed gradient.
- Keep non-animated gradients static and preserve existing fixed-color behavior when gradients are disabled.
- Preserve browser preview animation behavior while aligning installed output with the same animated-gradient setting.
- Verify the installed script behavior in Claude Code TUI on macOS/iTerm2, and document any host refresh limitation found during implementation.

## Non-Goals

- No new gradient presets or editor controls beyond the existing animated-gradient toggle.
- No changes to Claude Code itself or terminal emulator behavior.
- No animation for static gradients where `gradient.animated` is disabled.

## Impact

- Affected specs: `widget-styling`
- Affected app areas: generated Bash/Python/Node helpers, export/install output, gradient preview parity, installed TUI verification.
