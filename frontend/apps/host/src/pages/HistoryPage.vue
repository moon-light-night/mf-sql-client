<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useApiClient } from '@sql-client/api'
import { useTheme } from '@sql-client/config'
import type { HistoryEntry } from '@sql-client/types'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Message from 'primevue/message'
import Skeleton from 'primevue/skeleton'
import Tag from 'primevue/tag'
import { HISTORY_PAGE_SIZE, HISTORY_SCROLL_THRESHOLD } from '@/consts'

const api = useApiClient()
const { isDark, toggleTheme } = useTheme()

const scrollContainer = ref<HTMLElement | null>(null)
const entries = ref<HistoryEntry[]>([])
const total = ref<number>(0)
const offset = ref<number>(0)
const initialLoading = ref<boolean>(false)
const loadingMore = ref<boolean>(false)
const error = ref<string | null>(null)
const hasMore = ref<boolean | null>(null)
  
const scrollIsDisabled = computed<boolean>(() => loadingMore.value || initialLoading.value)
const themeAriaLabel = computed<string>(() => isDark.value ? 'Switch to light theme' : 'Switch to dark theme')
const themeIcon = computed<string>(() => isDark.value ? 'pi pi-sun' : 'pi pi-moon')

const loadHistory = async (isInitial = true) => {
  try {
    if (isInitial) {
      initialLoading.value = true
      entries.value = []
      offset.value = 0
    } else {
      loadingMore.value = true
    }

    const res = await api.listQueryHistory(HISTORY_PAGE_SIZE, offset.value)
    
    if (isInitial) {
      entries.value = res.entries
    } else {
      entries.value.push(...res.entries)
    }
    
    total.value = res.total
    hasMore.value = offset.value + HISTORY_PAGE_SIZE < res.total

    error.value = null
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
    hasMore.value = false
  } finally {
    if (isInitial) {
      initialLoading.value = false
    } else {
      loadingMore.value = false
    }
  }
}

const formatDate = (iso: string): string => {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

const calculateTagValue = (success: boolean): string => success ? "Success" : "Error"

const calculateTagSeverity = (success: boolean): string => success ? "success" : "danger"

const handleScroll = () => {
  if (scrollIsDisabled.value || !scrollContainer.value) return
  
  const { scrollHeight, scrollTop, clientHeight } = scrollContainer.value
  const distanceToBottom = scrollHeight - scrollTop - clientHeight
  
  if (distanceToBottom < HISTORY_SCROLL_THRESHOLD && hasMore.value) {
    offset.value += HISTORY_PAGE_SIZE
    loadHistory(false)
  }
}

watch(scrollContainer, (el) => {
  if (el) {
    el.addEventListener('scroll', handleScroll)
    return () => {
      el.removeEventListener('scroll', handleScroll)
    }
  }
})

onMounted(() => {
  loadHistory(true)
})
</script>

<template>
  <div class="flex flex-col h-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
    <div
      class="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800
             border-b border-gray-200 dark:border-gray-700 shrink-0 h-12"
    >
      <span class="font-bold text-blue-600 dark:text-blue-400 text-sm tracking-wide">Query History</span>

      <div class="flex items-center gap-1.5">
        <Button
          :icon="themeIcon"
          severity="secondary"
          size="small"
          text
          rounded
          :aria-label="themeAriaLabel"
          @click="toggleTheme"
        />
        <Button
          label="Refresh"
          icon="pi pi-refresh"
          size="small"
          severity="secondary"
          :loading="initialLoading"
          @click="loadHistory(true)"
        />
      </div>
    </div>

    <div ref="scrollContainer" class="p-4 md:p-5 flex-1 min-h-0 overflow-auto bg-white dark:bg-gray-800">
      <Message v-if="error" severity="error" :closable="false">{{ error }}</Message>

      <div v-else-if="initialLoading && !entries.length" class="space-y-2">
        <Skeleton v-for="n in 5" :key="n" height="3rem" class="rounded-lg" />
      </div>

      <div
        v-else-if="!entries.length"
        class="flex flex-col items-center justify-center h-40 text-gray-400 dark:text-gray-500"
      >
        <i class="pi pi-history text-3xl mb-2" />
        <p class="text-sm">No queries executed yet</p>
      </div>

      <DataTable
        v-else
        :value="entries"
        size="small"
        striped-rows
        class="text-sm"
      >
        <Column field="executedAt" header="Time" :pt="{ headerCell: { class: 'whitespace-nowrap w-40' } }">
          <template #body="{ data }">
            <span class="text-gray-500 dark:text-gray-300 text-xs">{{ formatDate(data.executedAt) }}</span>
          </template>
        </Column>
        <Column field="sql" header="Query">
          <template #body="{ data }">
            <code class="text-xs font-mono break-all line-clamp-2 text-gray-600 dark:text-gray-100">{{ data.sql }}</code>
          </template>
        </Column>
        <Column field="success" header="Status" :pt="{ headerCell: { class: 'w-20' } }">
          <template #body="{ data }">
            <Tag
              :value="calculateTagValue(data.success)"
              :severity="calculateTagSeverity(data.success)"
            />
          </template>
        </Column>
        <Column field="rowsCount" header="Rows" :pt="{ headerCell: { class: 'w-16 text-right' } }">
          <template #body="{ data }">
            <span class="text-right block text-gray-600 dark:text-gray-100">{{ data.success ? data.rowsCount : '—' }}</span>
          </template>
        </Column>
        <Column field="durationMs" header="ms" :pt="{ headerCell: { class: 'w-16 text-right' } }">
          <template #body="{ data }">
            <span class="text-right block text-gray-500 dark:text-gray-300">{{ data.durationMs }}</span>
          </template>
        </Column>
      </DataTable>

      <div v-if="loadingMore" class="flex justify-center py-4">
        <i class="pi pi-spin pi-spinner text-gray-400 dark:text-gray-500" />
      </div>
      <div v-else-if="!hasMore" class="text-center py-4 text-xs text-gray-400 dark:text-gray-500">
        No more entries
      </div>
    </div>
  </div>
</template>
