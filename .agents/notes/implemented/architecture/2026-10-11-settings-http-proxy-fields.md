# Agent Note: Settings fields for outbound HTTP proxy with live install

Status: implemented

English | [中文](2026-10-11-settings-http-proxy-fields.zh.md)

## Problem

Operators behind a corporate proxy often have host, port, username, and password as separate facts (as in deepagents' `[proxy]` config), not a single `HTTPS_PROXY` URL. Desktop and Web users also need a Settings surface; exporting shell variables is awkward on Windows GUI launches. The existing [outbound proxy policy](2026-08-27-outbound-proxy-policy.md) correctly installs once from the launch environment and rejects making transport a swappable plugin — but left no product form for decomposed fields or live reinstall.

## Decision

**Keep transport in `@deepseek-ai/dsh-http-proxy`.** Add `composeProxyUrl` / `policyFromSettings` and export `installProxyPolicy` / `activeProxySource` so a second owner can reinstall without owning undici.

**Host plugin `@deepseek-ai/dsh-http-proxy-settings` owns volatile Config** (`host`, `port`, `username`, `password` with `role('secret')`). On mount and `loader/volatile-update`, if `activeProxySource() !== 'env'`, compose and `installProxyPolicy`. Exported / `$DSH_HOME/.env` URL variables still win; Settings never overrides them.

**Client `@deepseek-ai/dsh-client-ui-settings-network`** registers Settings → Network and edits that namespace through `configForms`. Password presence uses settings secret markers; the literal never rides a describe value.

## Consequences

Live apply matches Settings' `applies: 'live'` expectation without restart when env is empty. Child tools still inherit a composed URL (with credentials) through the existing install env publish — same seam as documenting a password inside `HTTPS_PROXY`. SOCKS, OS system proxy, and private-LAN auto-bypass remain out of scope.
