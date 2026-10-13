/**
 * Process-wide subagent slots per LLM provider route, bounded by the cap the
 * route's adapter declares through `ctx.llm.providerSubagentLimit`.
 *
 * @module @deepseek-ai/dsh-subagent/provider-capacity
 */

import { SubagentError } from './error.ts'

/** Live subagent slots keyed by the LLM provider route each child runs on. */
export class ProviderCapacity {
  private readonly slots = new Map<string, Set<symbol>>()

  /**
   * Reserve one slot on `provider` before the child is reconstructed.
   * @param provider - LLM provider route the child's model runs on.
   * @param limit - the route's current cap; `undefined` admits without counting, `0` refuses.
   * @returns an idempotent slot release.
   * @throws SubagentError with code `ACTIVATION_LIMIT_REACHED` when the route refuses or is full.
   */
  reserve(provider: string, limit: number | undefined): () => void {
    if (limit === undefined) return () => {}
    if (limit === 0) {
      throw new SubagentError(
        `subagents are disabled for LLM provider "${provider}" (provider maxSubagents: 0); `
        + 'choose a model on another provider or complete this work with the current agents',
        'ACTIVATION_LIMIT_REACHED',
      )
    }
    let held = this.slots.get(provider)
    if (held !== undefined && held.size >= limit) {
      throw new SubagentError(
        `subagent limit reached for LLM provider "${provider}" (provider maxSubagents: ${limit}); `
        + 'wait for an existing child on that provider to finish, choose a model on another provider, '
        + 'or complete this work with the current agents',
        'ACTIVATION_LIMIT_REACHED',
      )
    }
    if (held === undefined) {
      held = new Set()
      this.slots.set(provider, held)
    }
    const slot = Symbol()
    const route = held
    route.add(slot)
    return () => {
      route.delete(slot)
      if (route.size === 0 && this.slots.get(provider) === route) this.slots.delete(provider)
    }
  }
}
