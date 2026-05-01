import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import QueryHistory from '@/components/query-history/QueryHistory.vue'
import { useSqlWorkbenchStore } from '@/stores'

const loadHistory = vi.fn()
const nextPage = vi.fn()
const prevPage = vi.fn()

vi.mock('@/composables/useQueryHistory', () => ({
  useQueryHistory: () => ({ loadHistory, nextPage, prevPage }),
}))

describe('QueryHistory', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    loadHistory.mockReset()
  })

  it('восстанавливает SQL из истории по клику', async () => {
    const store = useSqlWorkbenchStore()
    store.setHistory([
      {
        id: '1',
        sql: 'SELECT * FROM customers',
        success: true,
        error: '',
        rowsCount: 1,
        durationMs: 10,
        executedAt: new Date().toISOString(),
      },
    ], 1)

    const wrapper = mount(QueryHistory)
    expect(loadHistory).toHaveBeenCalledWith(0)

    const entryBtn = wrapper.findAll('button').find((b) => b.text().includes('SELECT * FROM customers'))
    expect(entryBtn).toBeTruthy()
    await entryBtn!.trigger('click')
    expect(store.sql).toBe('SELECT * FROM customers')
  })
})
