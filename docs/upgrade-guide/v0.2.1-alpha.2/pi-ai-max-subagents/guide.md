---
kind: upgrade-guide
description: "pi-ai provider routes refuse subagents unless their profile sets maxSubagents."
---

# pi-ai routes require `maxSubagents` for subagents

English | [中文](guide.zh.md)

## Change

A subagent previously ran on any `llm-pi-ai` provider route, limited only by the `subagent` entry's `maxActiveSubagents` per agent tree. Each `llm-pi-ai` profile now has `maxSubagents`, which defaults to `0`. With `0`, every spawned, forked, or resumed subagent whose model runs on that route fails with `ACTIVATION_LIMIT_REACHED` and the message `subagents are disabled for LLM provider "<route>"`. A positive value admits at most that many such subagents at once across the whole process. Deployments that delegate work on custom or catalog pi-ai routes, such as local OpenAI-compatible servers, observe this change; the native DeepSeek routes do not.

## Migration

1. For each route that should run subagents, set `maxSubagents` in its profile under the `llm-pi-ai` entry in the profile's `cordis.patch.yml` or the user settings document:

   ```yaml
   - id: llm-pi-ai
     config:
       providers:
         my-gateway:
           maxSubagents: 2
   ```

2. Restart or let the settings change apply, then ask the agent to delegate a task on that route. Confirm the subagent starts and that a start beyond the cap fails with `provider maxSubagents: <N>`.
