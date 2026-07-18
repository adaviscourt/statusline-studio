## 1. Generation Model

- [x] Confirm how installed Claude Code statusline commands are invoked during fullscreen TUI redraws on macOS/iTerm2.
- [x] Define a shared animation phase model for generated Bash, Python, and Node gradient helpers.
- [x] Keep static gradient helper behavior unchanged when `gradient.animated` is false.

## 2. Bash Output

- [x] Update generated Bash gradient output to emit phase-shifted ANSI truecolor frames for animated gradients.
- [x] Use a portable timestamp strategy with a documented fallback when sub-second time is unavailable.
- [x] Preserve prefix, suffix, emoji icon, background, bold, max-width, separators, rows, and reset behavior.

## 3. Python Output

- [x] Update generated Python gradient output to emit phase-shifted ANSI truecolor frames for animated gradients.
- [x] Preserve prefix, suffix, emoji icon, background, bold, max-width, separators, rows, and reset behavior.

## 4. Node Output

- [x] Update generated Node gradient output to emit phase-shifted ANSI truecolor frames for animated gradients.
- [x] Preserve prefix, suffix, emoji icon, background, bold, max-width, separators, rows, and reset behavior.

## 5. Verification

- [x] Validate the OpenSpec change.
- [x] Verify generated Bash, Python, and Node scripts produce different ANSI frames over time for an animated Rainbow `model` widget.
- [x] Verify generated Bash, Python, and Node scripts keep static gradients unchanged when animation is disabled.
- [x] Verify installed behavior in Claude Code TUI on macOS/iTerm2, or document the exact host refresh limitation if the TUI cannot repaint statusline output continuously.
