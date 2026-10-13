import { describe, expect, it, vi } from 'vitest'
import type { SettingsPathOpView } from '@deepseek-ai/dsh-api-remotes/client'
import { stubConfigForm, type StubConfigForm } from '@deepseek-ai/dsh-client-test-runtime'
import { CompactionCardController, type CompactionSettings } from '../src/client/compaction-card-controller.ts'

/** Make the stub behave like a Host that accepts every write. */
function acceptWrites<T>(host: StubConfigForm<T>): void {
  const section = (): Record<string, unknown> => ({ ...host.scope.getSnapshot().value as object })
  const layer = (): Record<string, unknown> => ({ ...host.scope.getSnapshot().user as object })
  host.mutate.mockImplementation((ops: readonly SettingsPathOpView[]) => {
    const value = { ...section() }
    const user = { ...layer() }
    for (const op of ops) {
      const field = op.path[0]!
      if (op.op === 'set') {
        value[field] = op.value
        user[field] = op.value
      } else {
        Reflect.deleteProperty(user, field)
        value[field] = (host.scope.getSnapshot().base as Record<string, unknown> | undefined)?.[field]
      }
    }
    host.publish({ value: value as T, user })
    return Promise.resolve(true)
  })
}

describe('CompactionCardController', () => {
  it('saves the threshold percent as a number', async () => {
    const host = stubConfigForm<CompactionSettings>()
    acceptWrites(host)
    const controller = new CompactionCardController(host.scope)
    host.publish({
      status: 'ready',
      writable: true,
      value: { thresholdPercent: 80 },
      base: { thresholdPercent: 80 },
      user: {},
    })
    const face = controller.inject()

    face.edit('thresholdPercent', '90')
    face.save()
    await vi.waitFor(() => { expect(host.mutate).toHaveBeenCalledWith([{ op: 'set', path: ['thresholdPercent'], value: 90 }], undefined) })

    expect(face.hooks.compactionCard.getSnapshot()).toMatchObject({
      dirty: false,
      thresholdPercent: { text: '90', overridden: true },
    })
  })

  it('shows the 80% default and reports a read-only document so the card can disable its controls', () => {
    const host = stubConfigForm<CompactionSettings>()
    const controller = new CompactionCardController(host.scope)

    host.publish({ status: 'ready', writable: false, value: { thresholdPercent: 80 } })

    const snapshot = controller.inject().hooks.compactionCard.getSnapshot()
    expect(snapshot.writable).toBe(false)
    expect(snapshot.thresholdPercent).toMatchObject({ text: '80', overridden: false })
    controller.dispose()
  })
})
