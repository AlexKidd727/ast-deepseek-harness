/** Locale bundles for the compaction settings page. */

import type { SettingsFormLabels } from '@deepseek-ai/dsh-client-ui-primitives'

/** Locale keys the page renders. */
export type CompactionSettingsLocaleKey =
  | 'title' | 'description' | 'threshold' | 'thresholdHint'
  | 'overridden' | 'reset' | 'readOnly' | 'unavailable'
  | 'save' | 'saving' | 'saveFailed' | 'invalidNumber'

/** English copy. */
export const en: Record<CompactionSettingsLocaleKey, string> = {
  title: 'Context compaction',
  description: 'Control when the Agent summarizes older conversation history.',
  threshold: 'Compaction threshold, %',
  thresholdHint: 'Share of the model context window at which older history is summarized: 20–100, default 80. Applies to the next check without a restart.',
  overridden: 'Overridden',
  reset: 'Reset to default',
  readOnly: 'This deployment stores settings read-only.',
  unavailable: 'This plugin is not loaded, so it cannot be configured right now.',
  save: 'Save',
  saving: 'Saving…',
  saveFailed: 'The deployment did not accept these values; they were left for you to correct.',
  invalidNumber: 'Enter a whole number from 20 to 100, or leave blank to use the default.',
}

/** Simplified Chinese copy. */
export const zh: Record<CompactionSettingsLocaleKey, string> = {
  title: '上下文压缩',
  description: '控制 Agent 何时摘要较早的对话历史。',
  threshold: '压缩阈值（%）',
  thresholdHint: '对话占模型上下文窗口达到该比例时摘要较早的历史：20–100，默认 80。无需重启，下次检查即生效。',
  overridden: '已覆盖',
  reset: '恢复默认',
  readOnly: '本部署的设置为只读。',
  unavailable: '该插件当前未加载，暂时无法配置。',
  save: '保存',
  saving: '保存中…',
  saveFailed: '本部署没有接受这些值，已保留供你修改。',
  invalidNumber: '请填 20 到 100 的整数；留空表示使用默认值。',
}

/**
 * The form frame's copy, read from this page's dictionary.
 * @param t - the page's locale reader.
 * @returns the labels the shared settings form renders.
 */
export function formLabels(t: (key: CompactionSettingsLocaleKey) => string): SettingsFormLabels {
  return { unavailable: t('unavailable'), readOnly: t('readOnly'), saveFailed: t('saveFailed'), save: t('save'), saving: t('saving') }
}
