import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import SqlEditor from '@/components/sql-editor/SqlEditor.vue'
import { useSqlWorkbenchStore } from '@/stores'

const executeQuery = vi.fn()
const validateQuery = vi.fn()

vi.mock('@/composables/useQueryExecution', () => ({
  useQueryExecution: () => ({ executeQuery, validateQuery }),
}))

describe('SqlEditor', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    executeQuery.mockReset()
    validateQuery.mockReset()
  })

  it('очищает SQL по кнопке Clear', async () => {
    const wrapper = mount(SqlEditor)
    const store = useSqlWorkbenchStore()
    store.setSql('SELECT 42')

    const clearBtn = wrapper.findAll('button').find((b) => b.text().includes('Clear'))
    expect(clearBtn).toBeTruthy()
    await clearBtn!.trigger('click')

    expect(store.sql).toBe('')
  })

  it('вызывает validate и execute для кнопок', async () => {
    const wrapper = mount(SqlEditor)
    const store = useSqlWorkbenchStore()
    store.setSql('SELECT * FROM customers')

    const buttons = wrapper.findAll('button')
    const validateBtn = buttons.find((b) => b.text().includes('Validate'))
    const runBtn = buttons.find((b) => b.text().includes('Run'))

    await validateBtn!.trigger('click')
    await runBtn!.trigger('click')

    expect(validateQuery).toHaveBeenCalledWith('SELECT * FROM customers')
    expect(executeQuery).toHaveBeenCalledWith('SELECT * FROM customers')
  })

  it('запускает execute по Ctrl+Enter', async () => {
    const wrapper = mount(SqlEditor)
    const store = useSqlWorkbenchStore()
    store.setSql('SELECT now()')

    await wrapper.find('textarea').trigger('keydown.ctrl.enter')
    expect(executeQuery).toHaveBeenCalledWith('SELECT now()')
  })
})
