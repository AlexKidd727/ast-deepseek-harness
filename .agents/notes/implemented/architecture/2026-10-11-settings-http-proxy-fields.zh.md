# Agent Note: 设置页出站 HTTP 代理字段与即时安装

Status: implemented

[English](2026-10-11-settings-http-proxy-fields.md) | 中文

## Problem

处于公司代理后的操作者往往分别持有主机、端口、用户名与密码（如 deepagents 的 `[proxy]` 配置），而不是单一的 `HTTPS_PROXY` URL。Desktop / Web 用户也需要 Settings 界面；在 Windows GUI 启动时导出 shell 变量不便。既有[出站代理策略](2026-08-27-outbound-proxy-policy.zh.md)正确地在启动时从环境安装一次，并拒绝把传输做成可替换插件——但没有为分解字段或即时重装提供产品表单。

## Decision

**传输仍留在 `@deepseek-ai/dsh-http-proxy`。** 增加 `composeProxyUrl` / `policyFromSettings`，并导出 `installProxyPolicy` / `activeProxySource`，使第二所有者可重装而不持有 undici。

**Host 插件 `@deepseek-ai/dsh-http-proxy-settings` 持有 volatile Config**（`host`、`port`、`username`、带 `role('secret')` 的 `password`）。在挂载与 `loader/volatile-update` 时，若 `activeProxySource() !== 'env'`，则拼装并 `installProxyPolicy`。已导出 / `$DSH_HOME/.env` 的 URL 变量仍优先；Settings 永不覆盖它们。

**客户端 `@deepseek-ai/dsh-client-ui-settings-network`** 注册 Settings → 网络，并通过 `configForms` 编辑该命名空间。密码是否存在用 settings 的 secret 标记；字面量不进入 describe 的值。

## Consequences

当环境为空时，即时应用符合 Settings 的 `applies: 'live'`，无需重启。子工具仍通过既有安装路径的环境发布继承拼好的 URL（可含凭据）——与在 `HTTPS_PROXY` 中写入密码的文档缝相同。SOCKS、操作系统系统代理与私网 LAN 自动旁路仍不在范围内。
