/**
 * Settings-owned HTTP proxy fields. When launch env did not install a proxy,
 * compose host/port/user/password into a policy and live-reinstall the global
 * dispatcher so cloud LLM / web / MCP traffic follows the form without restart.
 * @module @deepseek-ai/dsh-http-proxy-settings
 */
import type { Volatile } from '@deepseek-ai/cordis'
import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import type {} from '@deepseek-ai/dsh-settings'
// Merges `loader/volatile-update` into Events for typed live Config writes.
import type {} from '@deepseek-ai/cordis-plugin-loader'
import {
  activeProxySource,
  installProxyPolicy,
  policyFromSettings,
} from '@deepseek-ai/dsh-http-proxy'

/** Cordis plugin name used by loader diagnostics. */
export const name = 'http-proxy-settings'

/** Default TCP port when the form omits one (matches deepagents). */
export const DEFAULT_PROXY_PORT = 8080

/** Settings namespace / profile entry id the Network page edits. */
export const HTTP_PROXY_SETTINGS_NAMESPACE = 'http-proxy-settings'

/** Plugin config: decomposed proxy fields for the Settings Network page. */
export interface Config {
  /** Proxy hostname or IP; blank disables the settings proxy. */
  host: Volatile<string | undefined>
  /** TCP port in `1..65535`; defaults to {@link DEFAULT_PROXY_PORT}. */
  port: Volatile<number>
  /** Optional proxy username. */
  username: Volatile<string | undefined>
  /** Optional proxy password; redacted from settings reads. */
  password: Volatile<string | undefined>
}

export const Config = z.object({
  host: z.string().volatile(),
  port: z.number().step(1).min(1).max(65_535).default(DEFAULT_PROXY_PORT).volatile(),
  username: z.string().volatile(),
  password: z.string().role('secret').volatile(),
})

/**
 * Install or clear the settings proxy when env is not already owning the policy.
 * @param config - live volatile fields from the profile entry.
 */
async function syncFromConfig(config: Config): Promise<() => Promise<void>> {
  // NOTE: exported HTTP_PROXY / HTTPS_PROXY / ALL_PROXY win; do not layer settings over them.
  if (activeProxySource() === 'env') {
    return async () => {}
  }
  const policy = policyFromSettings({
    host: config.host.get(),
    port: config.port.get(),
    username: config.username.get(),
    password: config.password.get(),
  })
  return await installProxyPolicy(policy)
}

/**
 * Mount settings-backed proxy install. Reacts to volatile form writes live.
 * @param ctx - plugin context.
 * @param config - validated live proxy fields.
 */
export function apply(ctx: Context, config: Config): void {
  ctx.inject(['settings'], (child) => {
    child.effect(() => child.settings.configure({ auto: false }, ctx.fiber))
  })

  let disposeInstall: (() => Promise<void>) | undefined
  let syncGeneration = 0

  const runSync = (): void => {
    const generation = ++syncGeneration
    void (async () => {
      const previous = disposeInstall
      disposeInstall = undefined
      if (previous !== undefined) await previous()
      if (generation !== syncGeneration) return
      disposeInstall = await syncFromConfig(config)
    })()
  }

  // NOTE: initial install after launch env policy is already in place.
  runSync()
  ctx.on('loader/volatile-update', () => { runSync() })
  ctx.effect(() => () => {
    syncGeneration += 1
    const previous = disposeInstall
    disposeInstall = undefined
    if (previous !== undefined) void previous()
  }, 'http-proxy-settings: dispose install')
}
