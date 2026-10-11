/** Locale bundles for the Network / HTTP proxy settings page. */

import type { SettingsFormLabels } from '@deepseek-ai/dsh-client-ui-primitives'

/** Locale keys the page renders. */
export type NetworkSettingsLocaleKey =
  | 'nav' | 'title' | 'description' | 'envNotice'
  | 'host' | 'hostHint' | 'port' | 'portHint'
  | 'username' | 'usernameHint' | 'password' | 'passwordHint'
  | 'passwordSet' | 'passwordUnset'
  | 'overridden' | 'reset' | 'readOnly' | 'unavailable'
  | 'save' | 'saving' | 'saveFailed' | 'invalidNumber'

/** English copy. */
export const en: Record<NetworkSettingsLocaleKey, string> = {
  nav: 'Network',
  title: 'HTTP proxy',
  description: 'Route cloud model and web traffic through an HTTP proxy.',
  envNotice: 'If HTTP_PROXY, HTTPS_PROXY, or ALL_PROXY is set in the environment or $DSH_HOME/.env, those values take precedence over this form until you clear them and restart.',
  host: 'Host',
  hostHint: 'Proxy hostname or IP. Leave blank to connect directly.',
  port: 'Port',
  portHint: 'TCP port (1–65535). Default 8080.',
  username: 'Username',
  usernameHint: 'Optional. Leave blank for a credential-free proxy.',
  password: 'Password',
  passwordHint: 'Optional. Stored redacted in settings; leave blank to keep the current password.',
  passwordSet: 'A password is configured.',
  passwordUnset: 'No password is configured.',
  overridden: 'Overridden',
  reset: 'Reset to default',
  readOnly: 'This deployment stores settings read-only.',
  unavailable: 'Proxy settings are not loaded, so they cannot be configured right now.',
  save: 'Save',
  saving: 'Saving…',
  saveFailed: 'The deployment did not accept these values; they were left for you to correct.',
  invalidNumber: 'Enter a port number from 1 to 65535, or leave blank to use the default.',
}

/** Simplified Chinese copy. */
export const zh: Record<NetworkSettingsLocaleKey, string> = {
  nav: '网络',
  title: 'HTTP 代理',
  description: '通过 HTTP 代理访问云端模型与网页流量。',
  envNotice: '若环境变量或 $DSH_HOME/.env 中已设置 HTTP_PROXY、HTTPS_PROXY 或 ALL_PROXY，它们优先于本表单；清除后需重启才会改用此处配置。',
  host: '主机',
  hostHint: '代理主机名或 IP。留空表示直连。',
  port: '端口',
  portHint: 'TCP 端口（1–65535）。默认 8080。',
  username: '用户名',
  usernameHint: '可选。留空表示无凭据代理。',
  password: '密码',
  passwordHint: '可选。在设置中脱敏存储；留空表示保持当前密码。',
  passwordSet: '已配置密码。',
  passwordUnset: '未配置密码。',
  overridden: '已覆盖',
  reset: '恢复默认',
  readOnly: '本部署的设置为只读。',
  unavailable: '代理设置当前未加载，暂时无法配置。',
  save: '保存',
  saving: '保存中…',
  saveFailed: '本部署没有接受这些值，已保留供你修改。',
  invalidNumber: '请填写 1 到 65535 的端口；留空表示使用默认值。',
}

/**
 * The form frame's copy, read from this page's dictionary.
 * @param t - the page's locale reader.
 * @returns the labels the shared settings form renders.
 */
export function formLabels(t: (key: NetworkSettingsLocaleKey) => string): SettingsFormLabels {
  return { unavailable: t('unavailable'), readOnly: t('readOnly'), saveFailed: t('saveFailed'), save: t('save'), saving: t('saving') }
}
