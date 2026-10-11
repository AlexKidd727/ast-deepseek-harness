/**
 * Staged form over the `http-proxy-settings` namespace: host, port, username,
 * and a write-only password (role secret on the Host).
 */

import type { Context as ClientContext } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-api-remotes/client'
import type { SnapshotStore } from '@deepseek-ai/dsh-client-store'
import {
  SettingsFormModel, settingsNumberField, settingsTextField,
  type SettingsFieldState, type SettingsFormActions, type SettingsFormScope, type SettingsFormShell,
} from '@deepseek-ai/dsh-client-ui-primitives'

/**
 * Namespace of the host proxy-settings plugin. Spelled here rather than
 * imported: a client package must not depend on a Host package.
 */
export const HTTP_PROXY_SETTINGS_NS = 'http-proxy-settings'

/** Form field the password control stages under. */
const PASSWORD_FIELD = 'password'

/** The proxy fields this page edits. */
export interface NetworkSettings {
  /** Proxy hostname or IP. */
  host?: string
  /** TCP port. */
  port?: number
  /** Optional username. */
  username?: string
}

/** What the Network page renders. */
export interface NetworkCardState extends SettingsFormShell {
  /** Proxy host. */
  host: SettingsFieldState
  /** Proxy port. */
  port: SettingsFieldState
  /** Optional username. */
  username: SettingsFieldState
  /** Staged password draft (never seeded from the Host). */
  password: SettingsFieldState
  /** Whether the Host reports a password configured. */
  passwordConfigured: boolean
}

/** The registration-side face the Network section injects. */
export interface NetworkCardFace extends SettingsFormActions {
  hooks: {
    /** Page snapshot bound by the renderer as useNetworkCard. */
    networkCard: SnapshotStore<NetworkCardState>
  }
}

/** Bridges the `http-proxy-settings` scope onto the Network page. */
export class NetworkCardController {
  private readonly form: SettingsFormModel<NetworkSettings>
  private readonly store: SnapshotStore<NetworkCardState>
  private readonly unsubscribe: () => void
  private passwordConfigured = false

  /**
   * @param scope - the bound settings scope for `http-proxy-settings`.
   * @param ctx - browser context whose `remote.settings` answers secret presence.
   */
  constructor(
    private readonly scope: SettingsFormScope<NetworkSettings>,
    private readonly ctx: ClientContext,
  ) {
    this.form = new SettingsFormModel(
      scope,
      [settingsTextField('host'), settingsNumberField('port'), settingsTextField('username')],
      [{ field: PASSWORD_FIELD, write: text => this.writePassword(text) }],
    )
    this.store = this.form.bind(() => this.projection())
    this.unsubscribe = scope.subscribe(() => { void this.readPasswordPresence() })
    void this.readPasswordPresence()
  }

  private projection(): NetworkCardState {
    return {
      ...this.form.shell(),
      host: this.form.field('host'),
      port: this.form.field('port'),
      username: this.form.field('username'),
      password: this.form.field(PASSWORD_FIELD),
      passwordConfigured: this.passwordConfigured,
    }
  }

  /**
   * Read whether the Host holds a redacted password for this namespace.
   */
  private async readPasswordPresence(): Promise<void> {
    const response = await this.ctx.remote.settings.describe()
    if (!response.ok) return
    const ns = response.value.namespaces.find(entry => entry.ns === HTTP_PROXY_SETTINGS_NS)
    const secret = ns?.secrets.find(entry => entry.path.length === 1 && entry.path[0] === PASSWORD_FIELD)
    const next = secret?.set ?? false
    if (next === this.passwordConfigured) return
    this.passwordConfigured = next
    this.store.set(this.projection())
  }

  /**
   * Write or clear the staged password through the settings mutate path.
   * @param value - staged password text; blank clears the field.
   * @returns whether the Host accepted the write.
   */
  private async writePassword(value: string): Promise<boolean> {
    const snapshot = this.scope.getSnapshot()
    const trimmed = value.trim()
    const ok = trimmed === ''
      ? await this.scope.mutate([{ op: 'unset', path: [PASSWORD_FIELD] }], snapshot.revision)
      : await this.scope.mutate(
        [{ op: 'set', path: [PASSWORD_FIELD], value: trimmed }],
        snapshot.revision,
      )
    await this.readPasswordPresence()
    return ok
  }

  /**
   * Build the face the section's slot registration injects.
   * @returns the page snapshot and form actions.
   */
  inject(): NetworkCardFace {
    return { hooks: { networkCard: this.store }, ...this.form.actions() }
  }

  /** Release subscriptions. */
  dispose(): void {
    this.unsubscribe()
    this.form.dispose()
  }
}
