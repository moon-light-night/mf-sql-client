import { config } from '@vue/test-utils'

config.global.stubs = {
  Transition: false,
  Button: {
    template: '<button data-test="btn" @click="$emit(\'click\')">{{ label }}<slot /></button>',
    props: ['label', 'icon', 'disabled', 'loading', 'severity', 'size', 'text', 'rounded'],
  },
  Textarea: {
    template: '<textarea :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)"></textarea>',
    props: ['modelValue', 'rows', 'placeholder', 'disabled'],
  },
  DataTable: {
    template: '<div class="datatable"><slot /><slot name="empty" /></div>',
    props: ['value'],
  },
  Column: {
    template: '<div class="column"><slot name="header" /></div>',
    props: ['field', 'header'],
  },
  Message: {
    template: '<div class="message"><slot /></div>',
    props: ['severity', 'closable'],
  },
  Skeleton: { template: '<div class="skeleton" />' },
  Tag: { template: '<span class="tag"><slot /></span>' },
}
