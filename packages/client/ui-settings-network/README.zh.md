---
description: "设置「网络」页：云端出口 HTTP 代理的主机、端口、用户名与密码。"
kind: "package-reference"
---

# @deepseek-ai/dsh-client-ui-settings-network

[English](README.md) | 中文

## Summary

在 Settings → 网络 中编辑 Host 上的 `http-proxy-settings` 命名空间。保存会更新 live Cordis Config；当启动环境未设置代理时，Host 插件无需重启即可重装进程代理。

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

在 web-app 客户端 patch 中与其他设置页一并挂载：

```yaml
- id: ui-settings-network
  name: '@deepseek-ai/dsh-client-ui-settings-network'
```

Host 侧需要 `@deepseek-ai/dsh-http-proxy-settings`。

-----

<a id="understand-the-implementation"></a>
## Understand the implementation

在 `configForms.whileServed(['http-proxy-settings'])` 期间注册 `settings.section` id `network`。密码使用 `SettingsSecretField`，经 settings mutate 写入；是否已配置由 `settings.describe` 的 secret 标记提供。提示文案说明已导出的 `HTTP_PROXY` / `HTTPS_PROXY` / `ALL_PROXY` 优先。

-----

<a id="further-exploration"></a>
## Further Exploration

- [网络代理指南](../../../docs/user/guide/network-proxy.zh.md)
- [http-proxy-settings](../../boot/http-proxy-settings/README.zh.md)

-----

<a id="model-experience"></a>
## Model Experience

无。

#### KV Cache effect

无。

## Known Limitations and Deferred Work

<a id="known-limitations-and-deferred-work"></a>

- 表单除静态提示外不实时检测 env 代理；优先权由 Host 跳过逻辑保证。

<a id="dev-note"></a>
### Dev Note

<details>
<summary>维护者工作上下文 — 点击展开</summary>

客户端包不得导入 Host 的 http-proxy-settings 包；命名空间 id 在本地写死。

</details>
