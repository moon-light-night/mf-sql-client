import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import SchemaExplorer from '@/components/schema-explorer/SchemaExplorer.vue'
import { useSqlWorkbenchStore } from '@/stores'

const loadSchema = vi.fn()
const reloadSchema = vi.fn()

vi.mock('@/composables/useSchemaExplorer', () => ({
  useSchemaExplorer: () => ({ loadSchema, reloadSchema }),
}))

describe('SchemaExplorer', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    loadSchema.mockReset()
    reloadSchema.mockReset()
  })

  it('показывает таблицы схемы и колонки', async () => {
    const store = useSqlWorkbenchStore()
    store.setSchema([
      {
        tableName: 'customers',
        columns: [
          { name: 'id', dataType: 'integer' },
          { name: 'name', dataType: 'varchar' },
        ],
      },
    ])

    const wrapper = mount(SchemaExplorer)
    expect(loadSchema).toHaveBeenCalled()
    expect(wrapper.text()).toContain('customers')

    const row = wrapper.findAll('button').find((b) => b.text().includes('customers'))
    expect(row).toBeTruthy()
    await row!.trigger('click')
    expect(wrapper.text()).toContain('id')
    expect(wrapper.text()).toContain('name')
  })
})
