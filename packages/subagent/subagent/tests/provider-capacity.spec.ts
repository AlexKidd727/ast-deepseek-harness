import { describe, expect, it } from 'vitest'
import { ProviderCapacity } from '../src/provider-capacity.ts'

describe('ProviderCapacity', () => {
  it('admits without counting when the route declares no cap', () => {
    const capacity = new ProviderCapacity()
    const releases = Array.from({ length: 3 }, () => capacity.reserve('free', undefined))
    for (const release of releases) release()
    expect(() => capacity.reserve('free', 1)).not.toThrow()
  })

  it('refuses a zero-cap route and counts each route separately', () => {
    const capacity = new ProviderCapacity()
    expect(() => capacity.reserve('off', 0)).toThrow(expect.objectContaining({
      name: 'SubagentError',
      code: 'ACTIVATION_LIMIT_REACHED',
      message: expect.stringContaining('subagents are disabled for LLM provider "off"') as string,
    }))
    capacity.reserve('a', 1)
    expect(() => capacity.reserve('b', 1)).not.toThrow()
    expect(() => capacity.reserve('a', 1)).toThrow(expect.objectContaining({
      code: 'ACTIVATION_LIMIT_REACHED',
      message: expect.stringContaining('subagent limit reached for LLM provider "a" (provider maxSubagents: 1)') as string,
    }))
  })

  it('applies a lowered cap to later reservations and frees slots idempotently', () => {
    const capacity = new ProviderCapacity()
    const first = capacity.reserve('route', 2)
    const second = capacity.reserve('route', 2)
    expect(() => capacity.reserve('route', 1)).toThrow(expect.objectContaining({ code: 'ACTIVATION_LIMIT_REACHED' }))
    first()
    first()
    expect(() => capacity.reserve('route', 1)).toThrow(expect.objectContaining({ code: 'ACTIVATION_LIMIT_REACHED' }))
    second()
    const third = capacity.reserve('route', 1)
    // A stale release from an emptied slot set must not drop the route's newer set.
    second()
    expect(() => capacity.reserve('route', 1)).toThrow(expect.objectContaining({ code: 'ACTIVATION_LIMIT_REACHED' }))
    third()
    expect(() => capacity.reserve('route', 1)).not.toThrow()
  })
})
