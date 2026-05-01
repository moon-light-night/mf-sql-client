<template>
  <div class="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
    <template v-if="store.loading">
      <i class="pi pi-spin pi-spinner" />
      <span>{{ WORKBENCH_UI_TEXTS.STATUS_RUNNING }}</span>
    </template>
    <template v-else-if="store.error">
      <i class="pi pi-times-circle text-red-500" />
      <span class="text-red-500">{{ WORKBENCH_UI_TEXTS.STATUS_ERROR }}</span>
    </template>
    <template v-else-if="store.info">
      <i class="pi pi-check text-green-500" />
      <span class="text-green-600 dark:text-green-400">{{ store.info }}</span>
    </template>
    <template v-else-if="store.result">
      <i class="pi pi-check text-green-500" />
      <span>
        {{ store.result.rowsCount }}
        {{ resultRowsLabel }}
        &middot;
        {{ store.result.durationMs }}ms
      </span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { WORKBENCH_UI_TEXTS } from '@/consts'
import { useQueryStore } from '@/stores'

const store = useQueryStore()

const resultRowsLabel = computed<string>(() => {
  if (!store.result) return WORKBENCH_UI_TEXTS.ROW_PLURAL
  return store.result.rowsCount === 1 ? WORKBENCH_UI_TEXTS.ROW_SINGULAR : WORKBENCH_UI_TEXTS.ROW_PLURAL
})
</script>
