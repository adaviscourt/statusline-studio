## Context

The app defines the Model Name widget in `SEGMENT_DEFS` and generates Bash, Python, and Node statusline scripts from that definition. Runtime output currently derives the model label from `model.display_name`, removes a leading `Claude`, and can strip numeric suffixes to keep only the base family. That behavior turns labels such as `Claude Opus 5` into `Opus`.

The issue requests an option to show the model variant. The only concrete accepted behavior is optional display of the model-and-variant combo, such as `Opus 5`.

## Decisions

### Variant Source

Use `model.display_name` as the canonical source for the composed model label. The variant-enabled path should strip only the leading `Claude` brand prefix, preserving the remaining display name exactly enough to keep variant text such as `5`, `4.6`, or other future model suffixes.

Do not invent variants from model ids or hard-code known model names. If Claude Code later exposes a separate variant field, that can be considered in a future change.

### Option Semantics

The Model Name widget should have an explicit persisted option for showing the variant. When disabled or absent, output remains compatible with the current base-model-only behavior. When enabled, browser preview and generated Bash, Python, and Node output use the full model-and-variant label.

If the existing `showVersion` field is reused internally, user-facing copy and code should still make the behavior clear as showing the model variant, not only a numeric software version.

### Rendering Semantics

The option affects only the source text passed into the existing Model Name rendering helpers. Styling and layout behavior remain unchanged: prefix, suffix, icon, color, background, bold, gradient, max-width, separators, and powerline settings still apply through the normal output helpers.

## Risks

- Bash, Python, and Node generation can drift if the parsing rule changes in only one language.
- The current option name may imply version-specific behavior; implementation should avoid confusing UI copy.
- Verification needs generated-script checks, because the browser preview alone does not prove installed statusline behavior.
