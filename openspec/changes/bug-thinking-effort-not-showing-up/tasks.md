## 1. Diagnosis

- [x] Confirm the current Thinking Effort widget reads the wrong runtime input path in generated Bash, Python, and Node output.
- [x] Confirm the browser preview still shows the sample Thinking Effort value and does not prove downloaded-script behavior.

## 2. Generated Output

- [x] Update Bash generation so Thinking Effort reads `effort.level` and renders when present.
- [x] Update Python generation so Thinking Effort reads `effort.level` and renders when present.
- [x] Update Node generation so Thinking Effort reads `effort.level` and renders when present.
- [x] Keep the no-value behavior empty for inputs without effort data.

## 3. Compatibility

- [x] Ensure saved configurations containing the `thinking_effort` widget still load without migration.
- [x] Preserve existing Thinking Effort widget styling controls and output helper behavior.

## 4. Verification

- [x] Validate the OpenSpec change.
- [x] Generate Bash, Python, and Node scripts with a Thinking Effort widget in the configuration.
- [x] Run or manually inspect each generated script against input containing `{"effort":{"level":"normal"}}` and confirm `normal` appears.
- [x] Run or manually inspect at least one generated script against input without `effort.level` and confirm the widget stays hidden.
