---
description: "The context compaction settings page on the dsh web client's Plugins page: the automatic compaction threshold of the compaction-settings namespace."
kind: "package-reference"
---

# @deepseek-ai/dsh-client-ui-settings-compaction

English | [中文](README.zh.md)

## Summary

Open **Plugins** in the sidebar and select **Context compaction** in the Official group to set the share of the model context window at which the Agent summarizes older history. The page stages what is typed and writes it only on save, marks a value the user overrode, and offers to reset it to the default of 80%. The page exists while the Host serves the `compaction-settings` namespace.

## Table of Contents

- [Use this package](#use-this-package)
- [Understand the implementation](#understand-the-implementation)
- [Further Exploration](#further-exploration)
- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)
- [Dev Note](#dev-note)

-----

<a id="use-this-package"></a>
## Use this package

The **Context compaction** card in the Official group opens the page. **Compaction threshold, %** accepts a whole number from 20 to 100; the field renders the effective value, and once overridden carries an **Overridden** badge with **Reset to default** beside it. Nothing is written until **Save**; leaving the page drops the draft, an empty field saves as a reset, and text that is not a number blocks the save and says so under the field. A saved value applies at the next compaction check without a restart.

-----

<a id="understand-the-implementation"></a>
## Understand the implementation

<details>
<summary>Implementation internals — click to expand</summary>

The Host half is an empty `apply`, present only so the package holds a Loader row the client module system serves the browser half for. The browser half binds the `compaction-settings` namespace through `ctx.configForms.get`, keeps the staged form in `CompactionCardController` over the shared `SettingsFormModel` of `ui-primitives`, and registers `CompactionCard` into the Plugins page's `plugins.item` slot through `ctx.configForms.whileServed`. The page's copy lives in this package's `settings.compaction` dictionary.

</details>

-----

<a id="further-exploration"></a>
## Further Exploration

- [compaction-settings](../../compaction/compaction-settings/README.md) — the Host entry that registers the `compaction-settings` namespace.
- [compaction-basic](../../compaction/compaction-basic/README.md) — the backend that reads the threshold.
- [ui-plugin-manager](../ui-plugin-manager/README.md) — the Plugins page and the `plugins.item` slot the page registers into.
- [ui-settings](../ui-settings/README.md) — the settings scope and the served-namespace watch the page rides.

-----

<a id="model-experience"></a>
## Model Experience

None, as the package is a browser-side settings surface that registers no model surface.

#### KV Cache effect

None; this package neither assembles nor sends a provider request.

## Known Limitations and Deferred Work

<a id="known-limitations-and-deferred-work"></a>

- **Deployment configuration wins** — a `thresholdRatio` written in a preset's `compaction-basic` configuration or in its `modelPolicies` takes precedence, and the page does not show that it is shadowed.

<a id="dev-note"></a>
### Dev Note

<details>
<summary>Working context for maintainers — click to expand</summary>

None.

</details>
