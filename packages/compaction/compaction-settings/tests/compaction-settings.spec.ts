import { describe, expect, it, vi } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import CompactionSettings, {
  DEFAULT_THRESHOLD_PERCENT,
  MAX_THRESHOLD_PERCENT,
  MIN_THRESHOLD_PERCENT,
  type Config,
} from '../src/index.ts'

/** Mount the service beside a stub Settings service. */
function mount(config: Config): { ctx: Context; settings: CompactionSettings; configure: ReturnType<typeof vi.fn> } {
  const ctx = new Context()
  const configure = vi.fn(() => () => {})
  ctx.provide('settings', { configure } as never)
  const settings = new CompactionSettings(ctx, config)
  return { ctx, settings, configure }
}

describe('compaction-settings', () => {
  it('defaults the threshold to 80% of the context window', () => {
    const { settings } = mount(CompactionSettings.Config({}))

    expect(DEFAULT_THRESHOLD_PERCENT).toBe(80)
    expect(settings.thresholdRatio()).toBe(0.8)
  })

  it('serves a saved percent as a context-window fraction', () => {
    const { settings } = mount(CompactionSettings.Config({ thresholdPercent: 90 }))

    expect(settings.thresholdRatio()).toBe(0.9)
  })

  it('reads the live value at each call', () => {
    let current = 80
    const { settings } = mount({ thresholdPercent: { get: () => current } })
    expect(settings.thresholdRatio()).toBe(0.8)

    current = 60

    expect(settings.thresholdRatio()).toBe(0.6)
  })

  it('rejects percents outside the accepted whole-number range', () => {
    expect(() => CompactionSettings.Config({ thresholdPercent: MIN_THRESHOLD_PERCENT - 1 })).toThrow()
    expect(() => CompactionSettings.Config({ thresholdPercent: MAX_THRESHOLD_PERCENT + 1 })).toThrow()
    expect(() => CompactionSettings.Config({ thresholdPercent: 80.5 })).toThrow()
    expect(CompactionSettings.Config({ thresholdPercent: MIN_THRESHOLD_PERCENT }).thresholdPercent.get()).toBe(20)
    expect(CompactionSettings.Config({ thresholdPercent: MAX_THRESHOLD_PERCENT }).thresholdPercent.get()).toBe(100)
  })

  it('registers the ctx.compactionSettings service and hands its page to the client', async () => {
    const { ctx, configure } = mount(CompactionSettings.Config({ thresholdPercent: 70 }))
    await vi.waitFor(() => { expect(configure).toHaveBeenCalledWith({ auto: false }, ctx.fiber) })

    expect(ctx.get('compactionSettings')?.thresholdRatio()).toBe(0.7)
  })
})
