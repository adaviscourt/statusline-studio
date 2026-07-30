## 1. Diagnosis

- [ ] Confirm the current Model Name widget can strip model variants such as the `5` in `Claude Opus 5`.
- [ ] Confirm whether an existing Model Name option can be reused or should be renamed/extended for variant display.

## 2. Model Name Option

- [ ] Add or update the Model Name widget editor control so users can opt into showing the model variant.
- [ ] Persist the option with saved layouts while treating missing values as the current base-model-only behavior.
- [ ] Update browser preview text so the option visibly switches between base model and model-plus-variant examples.

## 3. Generated Output

- [ ] Update Bash generation so variant-enabled Model Name output preserves model variant text from `model.display_name`.
- [ ] Update Python generation so variant-enabled Model Name output preserves model variant text from `model.display_name`.
- [ ] Update Node generation so variant-enabled Model Name output preserves model variant text from `model.display_name`.
- [ ] Preserve the current base-model-only output when the option is disabled or absent.

## 4. Verification

- [ ] Validate the OpenSpec change.
- [ ] Generate Bash, Python, and Node scripts with Model Name variant display enabled.
- [ ] Run or manually inspect each generated script against input containing `{"model":{"display_name":"Claude Opus 5"}}` and confirm `Opus 5` appears.
- [ ] Run or manually inspect at least one generated script with the option disabled and confirm `Opus` appears without the variant.
- [ ] Confirm Model Name styling and layout options still apply when variant display is enabled.
