/**
 * User-owned automatic compaction threshold edited on the Settings page.
 *
 * Agent presets mount their compaction backend inside preset-local plugin
 * lists that Settings cannot address, so this Host entry owns the one
 * user-editable pressure threshold and backends read it at each check.
 *
 * @module @deepseek-ai/dsh-compaction-settings
 */

import { Context, Service, type Volatile } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import type {} from '@deepseek-ai/dsh-settings'

declare module '@deepseek-ai/cordis' {
  interface Context {
    /** Live user-owned compaction threshold. */
    compactionSettings: CompactionSettings
  }
}

/** Threshold percent applied when the user has not saved one. */
export const DEFAULT_THRESHOLD_PERCENT = 80

/** Lowest accepted threshold percent; stays above the default `0.16` retained-tail ratio. */
export const MIN_THRESHOLD_PERCENT = 20

/** Highest accepted threshold percent. */
export const MAX_THRESHOLD_PERCENT = 100

/** Live fields presented on the Settings page. */
export interface Config {
  /** Context-window percent at which automatic compaction summarizes older history. */
  thresholdPercent: Volatile<number>
}

/** Serve the user-owned compaction threshold to compaction backends. */
export class CompactionSettings extends Service {
  static Config: z<{ thresholdPercent?: number }, Config> = z.object({
    thresholdPercent: z.number().step(1).min(MIN_THRESHOLD_PERCENT).max(MAX_THRESHOLD_PERCENT)
      .default(DEFAULT_THRESHOLD_PERCENT).volatile(),
  })

  constructor(ctx: Context, private readonly config: Config) {
    super(ctx, 'compactionSettings')
    ctx.inject(['settings'], (child) => { child.effect(() => child.settings.configure({ auto: false }, ctx.fiber)) })
  }

  /**
   * Read the accepted threshold as a context-window fraction.
   * @returns the current saved percent divided by 100, in `[0.2, 1]`.
   */
  thresholdRatio(): number {
    return this.config.thresholdPercent.get() / 100
  }
}

export default CompactionSettings
