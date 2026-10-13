---
description: "dsh Web 客户端插件页上的上下文压缩设置页：compaction-settings 命名空间的自动压缩阈值。"
kind: "package-reference"
---

# @deepseek-ai/dsh-client-ui-settings-compaction

[English](README.md) | 中文

## 概述

在侧栏打开**插件**，在官方分组里选择**上下文压缩**，即可设置对话占模型上下文窗口达到多大比例时 Agent 摘要较早的历史。页面暂存输入、只在保存时写入，标明用户覆盖过的值，并允许把它重置回默认值 80%。页面只在 Host 服务 `compaction-settings` 命名空间期间存在。

## 目录

- [使用本包](#use-this-package)
- [理解实现](#understand-the-implementation)
- [进一步探索](#further-exploration)
- [模型体验](#model-experience)
- [已知限制与延期工作](#known-limitations-and-deferred-work)
- [开发备注](#dev-note)

-----

<a id="use-this-package"></a>
## 使用本包

官方分组里的**上下文压缩**卡片打开这一页。**压缩阈值（%）**接受 20 到 100 的整数；字段显示生效值，一旦被覆盖就带**已覆盖**标签，旁边是**恢复默认**。点击**保存**之前不会写入任何内容；离开页面即丢弃草稿，清空字段并保存等于重置，填了不是数字的文本则保存被阻止，并在字段下说明原因。保存的值无需重启，在下一次压缩检查时生效。

-----

<a id="understand-the-implementation"></a>
## 理解实现

<details>
<summary>实现细节——点击展开</summary>

宿主半侧是一个空的 `apply`，只为让本包占一条 Loader 行，客户端模块系统据此送出浏览器半侧。浏览器半侧通过 `ctx.configForms.get` 绑定 `compaction-settings` 命名空间，用 `ui-primitives` 的共享 `SettingsFormModel` 在 `CompactionCardController` 里维护暂存表单，并通过 `ctx.configForms.whileServed` 把 `CompactionCard` 注册进插件页的 `plugins.item` slot。页面文案在本包的 `settings.compaction` 字典里。

</details>

-----

<a id="further-exploration"></a>
## 进一步探索

- [compaction-settings](../../compaction/compaction-settings/README.zh.md)——注册 `compaction-settings` 命名空间的 Host 条目。
- [compaction-basic](../../compaction/compaction-basic/README.zh.md)——读取该阈值的压缩后端。
- [ui-plugin-manager](../ui-plugin-manager/README.zh.md)——插件页以及本页注册进去的 `plugins.item` slot。
- [ui-settings](../ui-settings/README.zh.md)——本页依赖的设置 scope 与"命名空间被服务期间"的监视。

-----

<a id="model-experience"></a>
## 模型体验

无，本包是浏览器侧的设置界面，不注册任何模型面。

#### KV 缓存影响

无；本包既不组装也不发送提供方请求。

## 已知限制与延期工作

<a id="known-limitations-and-deferred-work"></a>

- **部署配置优先**——写在预设 `compaction-basic` 配置或其 `modelPolicies` 里的 `thresholdRatio` 优先生效，本页不会提示该值已被遮蔽。

<a id="dev-note"></a>
### 开发备注

<details>
<summary>维护者工作上下文——点击展开</summary>

无。

</details>
