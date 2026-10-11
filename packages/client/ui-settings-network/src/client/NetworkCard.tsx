/**
 * Settings Network section: HTTP proxy host, port, username, and password.
 */

import { SettingsForm, SettingsSecretField, SettingsValueField } from '@deepseek-ai/dsh-client-ui-primitives'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { formLabels } from './locales.ts'
import type { NetworkCardFace } from './network-card-controller.ts'
import css from './NetworkCard.module.css'

/** Props the renderer binds for the Network settings section. */
export type NetworkCardProps =
  PropsRuntime<'settings.section'>
  & PropsLocale<'settings.network'>
  & InjectFace<NetworkCardFace>

/**
 * Render the HTTP proxy settings form.
 * @param props - locale copy, form snapshot, and actions.
 * @returns the Network settings section body.
 */
export function NetworkCard(props: NetworkCardProps) {
  const { t } = props
  const state = props.useNetworkCard(snapshot => snapshot)
  if (!state.available) return t('unavailable')
  const disabled = !state.writable
  return (
    <div>
      <h2 className={css.heading}>{t('title')}</h2>
      <p className={css.notice}>{t('envNotice')}</p>
      <SettingsForm labels={formLabels(t)} state={state} onSave={props.save} onDiscard={props.discard}>
        <SettingsValueField
          id="settings-network-proxy-host"
          label={t('host')}
          hint={t('hostHint')}
          overriddenLabel={t('overridden')}
          resetLabel={t('reset')}
          invalidLabel={t('invalidNumber')}
          disabled={disabled}
          {...state.host}
          onEdit={(text) => { props.edit('host', text) }}
          onReset={() => { props.resetField('host') }}
        />
        <SettingsValueField
          id="settings-network-proxy-port"
          label={t('port')}
          hint={t('portHint')}
          overriddenLabel={t('overridden')}
          resetLabel={t('reset')}
          invalidLabel={t('invalidNumber')}
          numeric
          disabled={disabled}
          {...state.port}
          onEdit={(text) => { props.edit('port', text) }}
          onReset={() => { props.resetField('port') }}
        />
        <SettingsValueField
          id="settings-network-proxy-username"
          label={t('username')}
          hint={t('usernameHint')}
          overriddenLabel={t('overridden')}
          resetLabel={t('reset')}
          invalidLabel={t('invalidNumber')}
          disabled={disabled}
          {...state.username}
          onEdit={(text) => { props.edit('username', text) }}
          onReset={() => { props.resetField('username') }}
        />
        <SettingsSecretField
          id="settings-network-proxy-password"
          label={t('password')}
          hint={t('passwordHint')}
          disabled={disabled}
          text={state.password.text}
          configured={state.passwordConfigured}
          stateLabel={state.passwordConfigured ? t('passwordSet') : t('passwordUnset')}
          onEdit={(text) => { props.edit('password', text) }}
        />
      </SettingsForm>
    </div>
  )
}
