---
description: "设置页上由用户掌控的自动压缩阈值，压缩后端实时读取。"
kind: "package-reference"
---

# @deepseek-ai/dsh-compaction-settings

[English](README.md) | 中文

## 概述

承载唯一一项可由用户编辑的压缩设置：对话占模型上下文窗口达到多大比例时，自动压缩摘要较早的历史。默认值为 80%。Agent 预设把压缩后端挂在设置无法寻址的预设内插件列表里，因此由这个 Host 条目保存该值，并以 `ctx.compactionSettings` 提供服务；[compaction-basic](../compaction-basic/README.zh.md) 在每次检查时读取它，保存后无需重启即可生效。

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

base 组合包挂载一个条目；它的 id 就是[压缩设置页](../../client/ui-settings-compaction/README.zh.md)编辑的设置命名空间。

```yaml
- id: compaction-settings
  name: '@deepseek-ai/dsh-compaction-settings'
  config:
    thresholdPercent: 80
```

| 设置 | 默认值 | 含义 |
|---|---|---|
| `thresholdPercent` | `80` | 上下文窗口的整数百分比，取值 `20` 到 `100`；当 compaction-basic 配置未指定时，作为该后端的 `thresholdRatio`。 |

该字段是 volatile 的：设置把它写入 profile patch，消费方在下一次读取时看到新值。compaction-basic 配置或其某条 `modelPolicies` 里设置的 `thresholdRatio` 优先于此值。

-----

<a id="understand-the-implementation"></a>
## 理解实现

<details>
<summary>实现细节——点击展开</summary>

`CompactionSettings` 是名为 `compactionSettings` 的 Cordis 服务。它的 `thresholdRatio()` 读取 volatile 字段 `thresholdPercent` 并除以 100。由于浏览器包自带页面，它向可选的设置服务注册 `configure({ auto: false })`。预设分组不隔离这个服务名，因此预设内的压缩后端通过 `ctx.get('compactionSettings')` 访问 Host 实例。

</details>

-----

<a id="further-exploration"></a>
## 进一步探索

- [compaction-basic](../compaction-basic/README.zh.md)——阈值解析顺序与压力公式。
- [ui-settings-compaction](../../client/ui-settings-compaction/README.zh.md)——该值的设置页。
- [设置](../../settings/settings/README.zh.md)——volatile 字段与 profile 持久化。

-----

<a id="model-experience"></a>
## 模型体验

间接地，通过 `dsh-compaction-basic`；它读取该阈值来决定何时用摘要检查点替换较早的历史。

#### KV 缓存影响

阈值越低，压缩越早、越频繁地改写请求前缀；每次改写由 compaction-basic 负责。

## 已知限制与延期工作

<a id="known-limitations-and-deferred-work"></a>

- **所有模型共用一个值**——按模型设置的阈值仍属于 compaction-basic 的 `modelPolicies` 配置，设置页没有对应字段。

<a id="dev-note"></a>
### 开发备注

<details>
<summary>维护者工作上下文——点击展开</summary>

无。

</details>
