---
description: "Settings form fields for an outbound HTTP proxy (host, port, username, password) with live install when launch env did not set one."
kind: "package-reference"
---

# @deepseek-ai/dsh-http-proxy-settings

English | [中文](README.zh.md)

## Summary

Owns the volatile Config fields the Settings Network page edits. When the launcher did not install a proxy from `HTTP_PROXY` / `HTTPS_PROXY` / `ALL_PROXY`, this plugin composes those fields into a URL and calls `installProxyPolicy` so cloud model, web, and MCP traffic follow the form without restart. Exported environment variables always win.

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

Mount in the base bundle next to `settings`:

```yaml
- id: http-proxy-settings
  name: '@deepseek-ai/dsh-http-proxy-settings'
```

The client page is `@deepseek-ai/dsh-client-ui-settings-network`. Leave `host` blank to keep traffic direct under the settings source.

-----

<a id="understand-the-implementation"></a>
## Understand the implementation

On mount and on each `loader/volatile-update`, the plugin reads the four fields, skips reinstall when `activeProxySource() === 'env'`, otherwise installs `policyFromSettings(...)`. Password uses `role('secret')` so settings reads redact it. Child tools still receive a composed URL through the http-proxy install path when settings owns the policy — the same credential-in-env seam documented for `HTTPS_PROXY`.

-----

<a id="further-exploration"></a>
## Further Exploration

- [Network proxy guide](../../../docs/user/guide/network-proxy.md)
- [dsh-http-proxy](../../util/http-proxy/README.md)

-----

<a id="model-experience"></a>
## Model Experience

None. Transport only.

#### KV Cache effect

None.

## Known Limitations and Deferred Work

<a id="known-limitations-and-deferred-work"></a>

- Does not override an exported or `$DSH_HOME/.env` proxy URL.
- SOCKS and OS system proxy remain unsupported (same as http-proxy).

<a id="dev-note"></a>
### Dev Note

<details>
<summary>Working context for maintainers — click to expand</summary>

Live apply uses the same undici global dispatcher stack as launch install.

</details>
