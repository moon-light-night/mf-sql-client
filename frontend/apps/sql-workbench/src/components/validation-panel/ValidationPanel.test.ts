import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import ValidationPanel from '@/components/validation-panel/ValidationPanel.vue'
import { useSqlWorkbenchStore } from '@/stores'

describe('ValidationPanel', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('рендерит success состояние', () => {
    const store = useSqlWorkbenchStore()
    store.setValidation({ valid: true, message: 'ok' })

    const wrapper = mount(ValidationPanel)
    expect(wrapper.text()).toContain('Query is valid')
    expect(wrapper.text()).toContain('ok')
  })

  it('рендерит error состояние', () => {
    const store = useSqlWorkbenchStore()
    store.setValidation({ valid: false, message: 'bad sql' })

    const wrapper = mount(ValidationPanel)
    expect(wrapper.text()).toContain('Invalid query')
    expect(wrapper.text()).toContain('bad sql')
  })
})
