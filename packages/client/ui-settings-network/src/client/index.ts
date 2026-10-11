/**
 * Network settings section, browser half: HTTP proxy host / port / username /
 * password over the `http-proxy-settings` namespace.
 */

// Type-only: pulls the locale plugin's Context merge (ctx.locale).
import type {} from '@deepseek-ai/dsh-client-locale/client'
// Type-only: the ctx.configForms Context merge.
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-api-remotes/client'
import type { Context as ClientContext } from '@deepseek-ai/cordis'
import { NetworkCard } from './NetworkCard.tsx'
import { HTTP_PROXY_SETTINGS_NS, NetworkCardController } from './network-card-controller.ts'
import { en, zh, type NetworkSettingsLocaleKey } from './locales.ts'

export type { NetworkCardProps } from './NetworkCard.tsx'
export type { NetworkCardFace, NetworkCardState, NetworkSettings } from './network-card-controller.ts'
export type { NetworkSettingsLocaleKey } from './locales.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** Network / HTTP proxy settings page copy. */
    'settings.network': NetworkSettingsLocaleKey
  }
}

/** Dictionary namespace owned by this plugin. */
export const NS = 'settings.network'

/** Required services (cordis fiber inject). */
export const inject = ['slots', 'locale', 'remote', 'configForms']

/**
 * Mount the Network settings section while the Host serves its namespace.
 * @param ctx - the browser plugin context.
 */
export function apply(ctx: ClientContext): void {
  const t = ctx.locale.bind(NS)
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-settings-network: dictionaries')
  const card = new NetworkCardController(ctx.configForms.get(HTTP_PROXY_SETTINGS_NS), ctx)
  ctx.effect(() => () => { card.dispose() }, 'ui-settings-network: form subscription')
  ctx.effect(() => ctx.configForms.whileServed([HTTP_PROXY_SETTINGS_NS], () => ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'network',
    order: 12,
    label: () => t('nav'),
    locale: NS,
    inject: () => card.inject(),
  }, NetworkCard))), 'ui-settings-network: section')
}
