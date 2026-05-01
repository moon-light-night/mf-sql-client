<script setup lang="ts">
import Button from 'primevue/button'
import { computed, onMounted } from 'vue'
import { WORKBENCH_BUTTON_STYLES } from '@/consts/buttonStyles'
import { WORKBENCH_ERROR_MESSAGES, WORKBENCH_UI_TEXTS } from '@/consts'
import { useSqlWorkbenchStore } from '@/stores'
import { useQueryHistory } from '@/composables/index'
import { HistoryEntry } from '@sql-client/types'

const store = useSqlWorkbenchStore()
const { loadHistory, nextPage, prevPage } = useQueryHistory()

const historyLoadingButtonClass = computed<string>(() =>
  store.historyLoading
    ? 'pi pi-spin pi-spinner text-sm'
    : 'pi pi-refresh text-sm'
)

const historyTotal = computed<string>(() => {
  return `${store.historyOffset + 1}-
    ${Math.min(store.historyOffset + store.HISTORY_PAGE, store.historyTotal)} 
    ${WORKBENCH_UI_TEXTS.PAGINATION_OF} ${store.historyTotal}`
})

const nextPageDisabled = computed<boolean>(() =>
  store.historyOffset + store.HISTORY_PAGE >= store.historyTotal
)

const calculateExecutionInfo = (entry: HistoryEntry): string => `${entry.rowsCount || 0} rows · ${entry.durationMs || 0} ms`

const calculateEntrySuccess = (entry: HistoryEntry): string => entry?.success ? 'bg-green-500' : 'bg-red-500'

const formatDate = (iso: string): string => {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  } catch {
    return iso
  }
}

onMounted(() => loadHistory(0))
</script>

<template>
  <div class="flex flex-col h-full">
    <div
      class="flex items-center justify-between px-3 py-2 border-b
             border-gray-200 dark:border-gray-700 shrink-0"
    >
      <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {{ WORKBENCH_UI_TEXTS.QUERY_HISTORY }}
      </span>
      <Button
        type="button"
        unstyled
        :class="WORKBENCH_BUTTON_STYLES.icon"
        :disabled="store.historyLoading"
        @click="loadHistory(0)"
      >
        <i :class="historyLoadingButtonClass" />
      </Button>
    </div>

    <div v-if="store.historyLoading && !store.history.length" class="p-3 space-y-2">
      <div
        v-for="n in 6"
        :key="n"
        class="h-10 rounded bg-gray-300 dark:bg-gray-700/40 animate-pulse"
      />
    </div>

    <div v-else-if="store.historyError" class="p-3">
      <div class="text-xs text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700/60 rounded px-2 py-1.5">
        {{ store.historyError }}
      </div>
    </div>

    <div
      v-else-if="!store.history.length"
      class="flex flex-col items-center justify-center gap-2 py-12 text-gray-500 dark:text-gray-400"
    >
      <i class="pi pi-history text-3xl opacity-30" />
      <span class="text-sm">{{ WORKBENCH_UI_TEXTS.QUERY_HISTORY_EMPTY }}</span>
      <span class="text-xs text-gray-600 dark:text-gray-500">{{ WORKBENCH_UI_TEXTS.QUERY_HISTORY_EMPTY_HINT }}</span>
    </div>

    <div v-else class="flex-1 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700/50">
      <Button
        v-for="entry in store.history"
        :key="entry.id"
        type="button"
        unstyled
        :class="`${WORKBENCH_BUTTON_STYLES.historyItem} group`"
        @click="store.restoreQuery(entry)"
      >
        <div class="flex w-full items-start gap-2 min-w-0">
          <span
            class="mt-1 w-1.5 h-1.5 rounded-full shrink-0"
            :class="calculateEntrySuccess(entry)"
          />
          <div class="flex-1 min-w-0">
            <p
              class="text-xs font-mono text-gray-700 dark:text-gray-200
                     truncate leading-snug"
              :title="entry.sql"
            >
              {{ entry.sql }}
            </p>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(entry.executedAt) }}</span>
              <span v-if="entry.success" class="text-xs text-gray-500 dark:text-gray-400">
                {{ calculateExecutionInfo(entry) }}
              </span>
                <span v-else class="text-xs text-red-500 dark:text-red-400 truncate max-w-32" :title="entry.error">
                  {{ entry.error || WORKBENCH_ERROR_MESSAGES.FALLBACK_ERROR }}
              </span>
            </div>
          </div>
          <i
            class="pi pi-arrow-up-left text-xs text-gray-300 group-hover:text-blue-400
                   transition-colors shrink-0 mt-0.5"
          />
        </div>
      </Button>
    </div>

    <div
      v-if="store.historyTotal > store.HISTORY_PAGE"
      class="flex items-center justify-between px-3 py-2 border-t
             border-gray-200 dark:border-gray-700 shrink-0"
    >
      <span class="text-xs text-gray-400">
        {{ historyTotal }}
      </span>
      <div class="flex gap-1">
        <Button
          type="button"
          unstyled
          :class="WORKBENCH_BUTTON_STYLES.pagination"
          :disabled="!store.historyOffset"
          @click="prevPage()"
        >
          <i class="pi pi-chevron-left text-xs" />
        </Button>
        <Button
          type="button"
          unstyled
          :class="WORKBENCH_BUTTON_STYLES.pagination"
          :disabled="nextPageDisabled"
          @click="nextPage()"
        >
          <i class="pi pi-chevron-right text-xs" />
        </Button>
      </div>
    </div>
  </div>
</template>
