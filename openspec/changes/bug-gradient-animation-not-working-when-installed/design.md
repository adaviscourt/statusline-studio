## Context

The app already stores animated gradients on each segment as `segment.gradient.animated`. Browser surfaces use CSS animation, but generated Bash, Python, and Node scripts render a statusline by printing ANSI escape sequences once per invocation. A terminal cannot keep animating a printed string after the statusline process exits.

## Decision

Generated statusline scripts should render animated gradients as deterministic time-phased ANSI frames. When `gradient.animated` is true, the generated helper computes a phase from wall-clock time and offsets gradient interpolation across the widget text. Each statusline command invocation can then produce a different frame while using the same configured stops.

Static gradients remain unchanged when `gradient.animated` is false.

## Host Refresh Constraint

The implementation must verify how the current Claude Code TUI refreshes installed statusline commands. If Claude Code invokes the command repeatedly while the fullscreen TUI is visible, the statusline should visibly animate. If Claude Code only invokes the command on state changes, the generated output can only advance frames on those invocations; that limitation must be documented in verification notes and surfaced without implying the script can animate independently after exit.

## Runtime Shape

- Reuse existing gradient stop validation and per-character ANSI truecolor rendering.
- Add an animated path that accepts or derives a phase value without changing saved layout shape.
- Use portable time sources for each generated language.
- Keep emoji icon handling, prefix/suffix handling, max-width truncation, bold/background styling, and reset behavior consistent with current gradient output.

## Risks

- Shell portability varies for sub-second timestamps; Bash output may need a robust fallback to seconds when higher precision is unavailable.
- Different language generators must produce comparable frames for the same stops.
- Claude Code refresh frequency may cap perceived animation smoothness even when generated frames vary correctly.
