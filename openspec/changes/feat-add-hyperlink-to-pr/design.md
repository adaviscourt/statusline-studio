## Context

Statusline Maker defines segment behavior in `js/data.js`, segment defaults in `js/canvas.js`, and shared rendering/code-generation helpers in `js/codegen.js` and the segment output helpers. The existing `git_pr` segment already depends on `gh pr view` and renders `#<number> <title>` as plain text for Bash, Python, and Node.

The app also has a custom Link segment that emits OSC 8 hyperlinks. The Git PR enhancement should reuse that terminal hyperlink convention without introducing a new browser-opening dependency. In terminals that support OSC 8, clicking the linked PR text opens the PR URL in the user's default browser.

## Goals / Non-Goals

**Goals:**

- Fetch the current PR URL together with the PR number and title.
- Render the Git PR segment as an OSC 8 hyperlink when a URL is available.
- Let users choose whether the visible PR text is the PR identifier, the title, or both.
- Keep generated Bash, Python, and Node outputs behaviorally aligned.
- Preserve the existing default visible text shape unless users change the new option.

**Non-Goals:**

- Do not implement a custom browser opener or click handler in generated statusline scripts.
- Do not add support for non-GitHub providers.
- Do not change other Git remote segments.
- Do not change the generic Link segment.

## Decisions

1. Use OSC 8 terminal hyperlinks for Git PR output.

   Rationale: The app already emits OSC 8 for the custom Link segment, and OSC 8 is the terminal-native way to make generated command output clickable. Alternative considered: open the browser from the generated statusline script, but that would be surprising, platform-specific, and would trigger browser opens during statusline rendering rather than on user click.

2. Request `number,title,url` from `gh pr view`.

   Rationale: The current implementation already relies on `gh pr view`; adding the `url` field keeps the data source consistent. Alternative considered: derive the URL from remotes and PR number, but that is less reliable for forks and enterprise hosts.

3. Model display choice as a segment option with values `both`, `name`, and `title`.

   Rationale: A segment option matches existing property editing patterns and keeps the choice saved with each Git PR segment instance. `both` preserves the current `#<number> <title>` output as the default. In this context, `name` means the PR identifier visible to users, formatted as `#<number>`.

4. Apply existing color, background, bold, prefix, suffix, icon, and max-width behavior to the visible PR text before or while wrapping it as a hyperlink.

   Rationale: Users expect the Git PR segment to keep normal styling controls. The implementation should avoid letting OSC 8 control sequences count as visible text for truncation.

## Risks / Trade-offs

- OSC 8 support varies by terminal -> The linked text remains readable when OSC 8 is ignored.
- Shell escaping around URLs and titles can be error-prone -> Keep URL and display text in runtime variables where possible and escape generated string literals carefully for Python and Node.
- The word "name" in the issue could be interpreted differently -> Treat "name" as the existing PR identifier because the acceptance criterion clarifies it as "no title"; expose user-facing copy clearly enough to distinguish identifier-only from title-only.

## Migration Plan

Existing saved Git PR segments should default to `both` when the new option is missing, preserving current visible output. Rollback is limited to reverting the generated OpenSpec implementation change before archive; no data migration is required beyond the default fallback.

## Open Questions

None for planning. The requested scope is narrow enough to implement without adding provider support or changing unrelated Git segments.
