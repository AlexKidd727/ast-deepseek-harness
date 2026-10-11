---
description: "Settings Network page: HTTP proxy host, port, username, and password for cloud provider egress."
kind: "package-reference"
---

# @deepseek-ai/dsh-client-ui-settings-network

English | [中文](README.zh.md)

## Summary

Adds a Settings → Network section that edits the `http-proxy-settings` Host namespace. Saving updates the live Cordis Config; the Host plugin reinstalls the process proxy without restart when launch env did not already set one.

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

Mount in the web-app client patch next to other settings pages:

```yaml
- id: ui-settings-network
  name: '@deepseek-ai/dsh-client-ui-settings-network'
```

Requires `@deepseek-ai/dsh-http-proxy-settings` on the Host.

-----

<a id="understand-the-implementation"></a>
## Understand the implementation

Registers `settings.section` id `network` while `configForms.whileServed(['http-proxy-settings'])`. Password uses `SettingsSecretField` and is written through settings mutate; presence comes from `settings.describe` secret markers. A notice states that exported `HTTP_PROXY` / `HTTPS_PROXY` / `ALL_PROXY` take precedence.

-----

<a id="further-exploration"></a>
## Further Exploration

- [Network proxy guide](../../../docs/user/guide/network-proxy.md)
- [http-proxy-settings](../../boot/http-proxy-settings/README.md)

-----

<a id="model-experience"></a>
## Model Experience

None.

#### KV Cache effect

None.

## Known Limitations and Deferred Work

<a id="known-limitations-and-deferred-work"></a>

- The form does not live-detect an active env proxy beyond the static notice; Host skip logic enforces precedence.

<a id="dev-note"></a>
### Dev Note

<details>
<summary>Working context for maintainers — click to expand</summary>

Client package must not import the Host http-proxy-settings package; the namespace id is spelled locally.

</details>
