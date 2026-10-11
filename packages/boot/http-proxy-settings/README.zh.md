---
description: "设置页中的出站 HTTP 代理字段（主机、端口、用户名、密码）；在启动环境未设置代理时支持即时安装。"
kind: "package-reference"
---

# @deepseek-ai/dsh-http-proxy-settings

[English](README.md) | 中文

## Summary

持有 Settings「网络」页编辑的 volatile Config 字段。当启动器未从 `HTTP_PROXY` / `HTTPS_PROXY` / `ALL_PROXY` 安装代理时，本插件将这些字段拼成 URL 并调用 `installProxyPolicy`，使云端模型、web 与 MCP 流量无需重启即可走代理。已导出的环境变量始终优先。

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

在 base bundle 中与 `settings` 一并挂载：

```yaml
- id: http-proxy-settings
  name: '@deepseek-ai/dsh-http-proxy-settings'
```

客户端页面为 `@deepseek-ai/dsh-client-ui-settings-network`。将 `host` 留空则在 settings 源下保持直连。

-----

<a id="understand-the-implementation"></a>
## Understand the implementation

在挂载时以及每次 `loader/volatile-update` 时读取四个字段；若 `activeProxySource() === 'env'` 则跳过重装，否则安装 `policyFromSettings(...)`。密码使用 `role('secret')`，设置读取会脱敏。当 settings 拥有策略时，子进程仍通过 http-proxy 安装路径收到拼好的 URL——与 `HTTPS_PROXY` 文档中的凭据进环境缝相同。

-----

<a id="further-exploration"></a>
## Further Exploration

- [网络代理指南](../../../docs/user/guide/network-proxy.zh.md)
- [dsh-http-proxy](../../util/http-proxy/README.zh.md)

-----

<a id="model-experience"></a>
## Model Experience

无。仅传输层。

#### KV Cache effect

无。

## Known Limitations and Deferred Work

<a id="known-limitations-and-deferred-work"></a>

- 不会覆盖已导出或 `$DSH_HOME/.env` 中的代理 URL。
- 仍不支持 SOCKS 与操作系统系统代理（与 http-proxy 相同）。

<a id="dev-note"></a>
### Dev Note

<details>
<summary>维护者工作上下文 — 点击展开</summary>

即时应用使用与启动安装相同的 undici 全局 dispatcher 栈。

</details>
