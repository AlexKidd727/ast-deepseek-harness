---
kind: upgrade-guide
description: "pi-ai 提供方路由除非在配置中设置 maxSubagents，否则拒绝子智能体。"
---

# pi-ai 路由需要 `maxSubagents` 才能运行子智能体

[English](guide.md) | 中文

## 变更

此前子智能体可以在任何 `llm-pi-ai` 提供方路由上运行，只受 `subagent` 条目按智能体树计算的 `maxActiveSubagents` 限制。现在每个 `llm-pi-ai` 配置都有 `maxSubagents`，默认值为 `0`。取值为 `0` 时，模型运行在该路由上的每个新建、分叉或恢复的子智能体都会以 `ACTIVATION_LIMIT_REACHED` 失败，消息为 `subagents are disabled for LLM provider "<route>"`。正值表示整个进程中同时最多允许这么多此类子智能体。在自定义或目录内 pi-ai 路由（例如本地 OpenAI 兼容服务器）上委派工作的部署会受此影响；原生 DeepSeek 路由不受影响。

## 迁移

1. 对每个需要运行子智能体的路由，在 profile 的 `cordis.patch.yml` 或用户设置文档中 `llm-pi-ai` 条目下的该路由配置里设置 `maxSubagents`：

   ```yaml
   - id: llm-pi-ai
     config:
       providers:
         my-gateway:
           maxSubagents: 2
   ```

2. 重启或等待设置变更生效，然后让智能体在该路由上委派任务。确认子智能体能够启动，并且超过上限的启动以 `provider maxSubagents: <N>` 失败。
