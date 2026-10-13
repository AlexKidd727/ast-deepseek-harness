/** The compaction settings page: when automatic compaction summarizes older history. */

import type {} from '@deepseek-ai/dsh-client-ui-plugin-manager/client'
import { SettingsForm, SettingsValueField } from '@deepseek-ai/dsh-client-ui-primitives'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { formLabels } from './locales.ts'
import type { CompactionCardFace } from './compaction-card-controller.ts'

/** Props the renderer binds for the compaction page. */
export type CompactionCardProps =
  PropsRuntime<'plugins.item'>
  & PropsLocale<'settings.compaction'>
  & InjectFace<CompactionCardFace>

/**
 * Render the compaction one-liner or its settings form, as the Plugins page asks.
 * @param props - the view asked for, locale copy, the form snapshot, and its actions.
 * @returns the one-liner, or the form.
 */
export function CompactionCard(props: CompactionCardProps) {
  const { t } = props
  const state = props.useCompactionCard(snapshot => snapshot)
  if (props.view === 'summary') return t('description')
  return (
    <SettingsForm labels={formLabels(t)} state={state} onSave={props.save} onDiscard={props.discard}>
      <SettingsValueField
        id="plugin-config-compaction-threshold"
        label={t('threshold')}
        hint={t('thresholdHint')}
        overriddenLabel={t('overridden')}
        resetLabel={t('reset')}
        invalidLabel={t('invalidNumber')}
        numeric
        disabled={!state.writable}
        {...state.thresholdPercent}
        onEdit={(text) => { props.edit('thresholdPercent', text) }}
        onReset={() => { props.resetField('thresholdPercent') }}
      />
    </SettingsForm>
  )
}
