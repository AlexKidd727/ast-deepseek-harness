---
description: "User-owned automatic compaction threshold for the Settings page, read live by compaction backends."
kind: "package-reference"
---

# @deepseek-ai/dsh-compaction-settings

English | [中文](README.zh.md)

## Summary

Owns the one user-editable compaction setting: the share of the model context window at which automatic compaction summarizes older history. The default is 80%. Agent presets mount their compaction backend inside preset-local plugin lists that Settings cannot address, so this Host entry holds the value and serves it as `ctx.compactionSettings`; [compaction-basic](../compaction-basic/README.md) reads it at each check, so a saved value applies without a restart.

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

The base bundle mounts one entry; its id is the Settings namespace the [compaction settings page](../../client/ui-settings-compaction/README.md) edits.

```yaml
- id: compaction-settings
  name: '@deepseek-ai/dsh-compaction-settings'
  config:
    thresholdPercent: 80
```

| Setting | Default | Meaning |
|---|---|---|
| `thresholdPercent` | `80` | Whole-number percent of the context window, from `20` to `100`, used as the compaction-basic `thresholdRatio` when that backend's configuration names none. |

The field is volatile: Settings writes it into the profile patch and consumers observe the new value on their next read. A `thresholdRatio` set in compaction-basic configuration or in one of its `modelPolicies` takes precedence over this value.

-----

<a id="understand-the-implementation"></a>
## Understand the implementation

<details>
<summary>Implementation internals — click to expand</summary>

`CompactionSettings` is a Cordis service named `compactionSettings`. Its `thresholdRatio()` reads the volatile `thresholdPercent` and divides it by 100. It registers `configure({ auto: false })` with the optional Settings service because the browser package ships its own page. The service name is not isolated by preset groups, so preset-local compaction backends reach the Host instance through `ctx.get('compactionSettings')`.

</details>

-----

<a id="further-exploration"></a>
## Further Exploration

- [compaction-basic](../compaction-basic/README.md) — threshold resolution order and pressure formula.
- [ui-settings-compaction](../../client/ui-settings-compaction/README.md) — the Settings page for this value.
- [Settings](../../settings/settings/README.md) — volatile fields and profile persistence.

-----

<a id="model-experience"></a>
## Model Experience

Indirectly, through `dsh-compaction-basic`, which reads the threshold to decide when older history is replaced with a summary checkpoint.

#### KV Cache effect

A lower threshold makes compaction rewrite the request prefix sooner and more often; compaction-basic owns each rewrite.

## Known Limitations and Deferred Work

<a id="known-limitations-and-deferred-work"></a>

- **One value for every model** — per-model thresholds remain compaction-basic `modelPolicies` configuration and have no Settings field.

<a id="dev-note"></a>
### Dev Note

<details>
<summary>Working context for maintainers — click to expand</summary>

None.

</details>
