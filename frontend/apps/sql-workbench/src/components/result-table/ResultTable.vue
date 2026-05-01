<template>
  <div class="flex flex-col min-h-0 h-full">
    <div
      v-if="store.result"
      class="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800/60
             border-b border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 shrink-0"
    >
      <i class="pi pi-check text-green-500" />
      <span>{{ store.result.rowsCount }} {{ resultRowsLabel }}</span>
      <span class="text-gray-300 dark:text-gray-600">·</span>
      <span>{{ store.result.durationMs }} ms</span>
      <span v-if="store.result.rowsCount >= 500" class="ml-2 text-amber-500 font-medium">
        <i class="pi pi-exclamation-triangle mr-1" />{{ WORKBENCH_UI_TEXTS.RESULT_CAPPED }}
      </span>
    </div>

    <div
      v-if="showEmpty"
      class="flex flex-col items-center justify-center h-full text-gray-400 gap-2 py-12"
    >
      <i class="pi pi-table text-4xl opacity-30" />
      <p class="text-sm">{{ WORKBENCH_UI_TEXTS.RESULT_EMPTY_PROMPT }}</p>
    </div>

    <div
      v-else-if="store.executing"
      class="flex flex-col items-center justify-center h-full text-gray-400 gap-3 py-12"
    >
      <i class="pi pi-spin pi-spinner text-3xl text-blue-400" />
      <span class="text-sm">{{ WORKBENCH_UI_TEXTS.RESULT_EXECUTING }}</span>
    </div>

    <div v-else-if="store.execError" class="p-4">
      <div class="text-sm text-red-300 bg-red-900/30 border border-red-700/60 rounded px-3 py-2">
        <span class="font-mono break-all">{{ store.execError }}</span>
      </div>
    </div>

    <div v-else-if="store.result" class="flex-1 min-h-0 overflow-auto">
      <div v-if="store.result.rows.length === 0" class="flex flex-col items-center py-8 text-gray-400 gap-2">
        <i class="pi pi-inbox text-3xl opacity-40" />
        <span class="text-sm">{{ WORKBENCH_UI_TEXTS.RESULT_ZERO_ROWS }}</span>
      </div>

      <table v-else class="w-full min-w-max text-xs border-collapse">
        <thead class="bg-gray-100 dark:bg-gray-800/80 sticky top-0 z-10">
          <tr>
            <th
              v-for="col in store.result.columns"
              :key="col.name"
              class="text-left px-3 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap"
            >
              <div class="flex flex-col leading-tight">
                <span class="font-semibold text-gray-900 dark:text-gray-100">{{ col.name }}</span>
                <span class="text-gray-600 dark:text-gray-400 font-normal text-[11px]">{{ col.dataType }}</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in store.result.rows"
            :key="index"
            class="border-b border-gray-200 dark:border-gray-800/70"
            :class="tableRowClass(index)"
          >
            <td
              v-for="(col, colIndex) in store.result.columns"
              :key="`${index}-${col.name}`"
              class="px-3 py-1.5 whitespace-nowrap text-gray-700 dark:text-gray-100"
            >
              {{ formatCellValue(row.values[colIndex]) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { WORKBENCH_UI_TEXTS } from '@/consts'
import { useSqlWorkbenchStore } from '@/stores'

const store = useSqlWorkbenchStore()

const resultRowsLabel = computed<string>(() => {
  if (!store.result) return WORKBENCH_UI_TEXTS.ROW_PLURAL
  return store.result.rowsCount === 1 ? WORKBENCH_UI_TEXTS.ROW_SINGULAR : WORKBENCH_UI_TEXTS.ROW_PLURAL
})

const showEmpty = computed<boolean>(
  () => !store.result && !store.executing && !store.execError,
)

const tableRowClass = (index: number): string =>
  index % 2 === 0
    ? 'bg-white dark:bg-black/40'
    : 'bg-gray-50 dark:bg-gray-900/70'

const formatCellValue = (value: string | undefined | null): string => value || '—'
</script>
