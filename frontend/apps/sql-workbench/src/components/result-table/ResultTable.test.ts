import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import ResultTable from '@/components/result-table/ResultTable.vue'
import { useSqlWorkbenchStore } from '@/stores'

describe('ResultTable', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('показывает empty state', () => {
    const wrapper = mount(ResultTable)
    expect(wrapper.text()).toContain('Run a query to see results')
  })

  it('показывает error state', () => {
    const store = useSqlWorkbenchStore()
    store.setExecError('boom')

    const wrapper = mount(ResultTable)
    expect(wrapper.text()).toContain('boom')
  })

  it('рендерит динамические колонки', () => {
    const store = useSqlWorkbenchStore()
    store.setResult({
      columns: [
        { name: 'id', dataType: 'integer' },
        { name: 'name', dataType: 'varchar' },
      ],
      rows: [{ values: ['1', 'Alice'] }],
      rowsCount: 1,
      durationMs: 3,
    })

    const wrapper = mount(ResultTable)
    expect(wrapper.text()).toContain('id')
    expect(wrapper.text()).toContain('integer')
    expect(wrapper.text()).toContain('name')
    expect(wrapper.text()).toContain('varchar')
  })
})
