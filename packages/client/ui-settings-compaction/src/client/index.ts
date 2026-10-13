/**
 * The compaction settings page, browser half: the automatic compaction
 * threshold over the `compaction-settings` namespace the Host entry registers.
 * The page registers into the Plugins page's `plugins.item` slot while the
 * Host serves that namespace, so a deployment without it shows no trace of it.
 */

// Type-only: pulls the locale plugin's Context merge (ctx.locale).
import type {} from '@deepseek-ai/dsh-client-locale/client'
// Type-only: the ctx.configForms Context merge. Cross-plugin collaboration
// goes through the service, never a value import (client bundle purity gate).
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
// Type-only: the Plugins page's SlotMap merge (the 'plugins.item' entry).
import type {} from '@deepseek-ai/dsh-client-ui-plugin-manager/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type { Context as ClientContext } from '@deepseek-ai/cordis'
import { CompactionCard } from './CompactionCard.tsx'
import { COMPACTION_SETTINGS_NS, CompactionCardController } from './compaction-card-controller.ts'
import { en, zh, type CompactionSettingsLocaleKey } from './locales.ts'

export type { CompactionCardProps } from './CompactionCard.tsx'
export type { CompactionCardFace, CompactionCardState, CompactionSettings } from './compaction-card-controller.ts'
export type { CompactionSettingsLocaleKey } from './locales.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** Compaction settings page copy. */
    'settings.compaction': CompactionSettingsLocaleKey
  }
}

/** Dictionary namespace owned by this plugin. */
export const NS = 'settings.compaction'

/** Required services (cordis fiber inject). */
export const inject = ['slots', 'locale', 'configForms']

/**
 * Mount the compaction settings page while the Host serves its namespace.
 * @param ctx - the browser plugin context.
 */
export function apply(ctx: ClientContext): void {
  const t = ctx.locale.bind(NS)
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-settings-compaction: dictionaries')
  const card = new CompactionCardController(ctx.configForms.get(COMPACTION_SETTINGS_NS))
  ctx.effect(() => () => { card.dispose() }, 'ui-settings-compaction: form subscription')
  ctx.effect(() => ctx.configForms.whileServed([COMPACTION_SETTINGS_NS], () => ctx.slots.inject('plugins.item', () => ctx.slots.register({
    name: 'plugins.item', id: 'compaction', order: 35, label: () => t('title'), locale: NS, inject: () => card.inject(),
  }, CompactionCard))), 'ui-settings-compaction: page')
}
