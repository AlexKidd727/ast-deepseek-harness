/** The compaction page's staged form over the `compaction-settings` settings namespace. */

import type { SnapshotStore } from '@deepseek-ai/dsh-client-store'
import {
  SettingsFormModel, settingsNumberField,
  type SettingsFieldState, type SettingsFormActions, type SettingsFormScope, type SettingsFormShell,
} from '@deepseek-ai/dsh-client-ui-primitives'

/**
 * Namespace of the user-owned compaction threshold. Spelled here rather than
 * imported: a client package must not depend on a Host package.
 */
export const COMPACTION_SETTINGS_NS = 'compaction-settings'

/** The compaction fields this page edits. */
export interface CompactionSettings {
  /** Context-window percent at which automatic compaction summarizes older history. */
  thresholdPercent?: number
}

/** What the compaction page renders. */
export interface CompactionCardState extends SettingsFormShell {
  /** Automatic compaction threshold percent. */
  thresholdPercent: SettingsFieldState
}

/** The registration-side face the compaction page's slot entry injects. */
export interface CompactionCardFace extends SettingsFormActions {
  hooks: {
    /** Page snapshot bound by the renderer as useCompactionCard. */
    compactionCard: SnapshotStore<CompactionCardState>
  }
}

/** Bridges the `compaction-settings` scope onto the page's staged form. */
export class CompactionCardController {
  private readonly form: SettingsFormModel<CompactionSettings>
  private readonly store: SnapshotStore<CompactionCardState>

  /** @param scope - the bound settings scope for the `compaction-settings` namespace. */
  constructor(scope: SettingsFormScope<CompactionSettings>) {
    this.form = new SettingsFormModel(scope, [settingsNumberField('thresholdPercent')])
    this.store = this.form.bind(() => this.projection())
  }

  private projection(): CompactionCardState {
    return { ...this.form.shell(), thresholdPercent: this.form.field('thresholdPercent') }
  }

  /**
   * Build the face the page's slot registration injects.
   * @returns the page's snapshot and its form actions.
   */
  inject(): CompactionCardFace {
    return { hooks: { compactionCard: this.store }, ...this.form.actions() }
  }

  /** Release accepted-value subscriptions. */
  dispose(): void { this.form.dispose() }
}
