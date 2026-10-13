// @vitest-environment jsdom
/** The compaction page as the Plugins page renders it: its one-liner and its one field. */

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { bindSnapshotSelector } from '@deepseek-ai/dsh-client-test-runtime'
import { createSnapshotStore } from '@deepseek-ai/dsh-client-store'
import type { SettingsFieldState, SettingsFormShell } from '@deepseek-ai/dsh-client-ui-primitives'
import { CompactionCard, type CompactionCardProps } from '../src/client/CompactionCard.tsx'
import type { CompactionCardState } from '../src/client/compaction-card-controller.ts'
import { en } from '../src/client/locales.ts'

afterEach(cleanup)

const t = (key: keyof typeof en) => en[key]

const settled: SettingsFormShell = { available: true, writable: true, dirty: false, invalid: false, saving: false, failed: false }

function field(text: string, rest: Partial<SettingsFieldState> = {}): SettingsFieldState {
  return { text, overridden: false, invalid: false, ...rest }
}

function renderCard(state: Partial<CompactionCardState> = {}, view: 'summary' | 'page' = 'page') {
  const store = createSnapshotStore<CompactionCardState>({ ...settled, thresholdPercent: field('80'), ...state })
  const actions = { edit: vi.fn(), resetField: vi.fn(), save: vi.fn(), discard: vi.fn() }
  const props = { ...actions, view, t, useCompactionCard: bindSnapshotSelector(store) } as CompactionCardProps
  render(<CompactionCard {...props} />)
  return actions
}

describe('CompactionCard', () => {
  it('renders its one-liner alone in the summary view', () => {
    renderCard({}, 'summary')

    expect(document.body.textContent).toBe(en.description)
    expect(screen.queryByLabelText(en.threshold)).toBeNull()
  })

  it('stages and saves the threshold it owns', () => {
    const actions = renderCard({ dirty: true })

    fireEvent.change(screen.getByLabelText(en.threshold), { target: { value: '90' } })
    fireEvent.click(screen.getByRole('button', { name: en.save }))

    expect(actions.edit).toHaveBeenCalledWith('thresholdPercent', '90')
    expect(actions.save).toHaveBeenCalledOnce()
  })

  it('stages a reset to the default threshold', () => {
    const actions = renderCard({ thresholdPercent: field('90', { overridden: true }) })

    fireEvent.click(screen.getByRole('button', { name: en.reset }))

    expect(actions.resetField).toHaveBeenCalledWith('thresholdPercent')
  })

  it('says the plugin is not loaded while its namespace is unavailable, and disables the field while the document is read-only', () => {
    renderCard({ available: false })
    expect(screen.getByRole('status').textContent).toBe(en.unavailable)
    cleanup()

    renderCard({ writable: false })
    expect(screen.getByRole('status').textContent).toBe(en.readOnly)
    expect(screen.getByLabelText(en.threshold)).toHaveProperty('disabled', true)
  })
})
