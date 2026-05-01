<template>
  <div class="flex flex-col h-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
    <QueryToolbar />

    <div class="flex flex-1 min-h-0 overflow-hidden">

      <div class="flex shrink-0 min-h-0">
        <aside
          class="flex flex-col border-r border-gray-200 dark:border-gray-700
                 overflow-hidden transition-all duration-200"
          :class="schemaSidebarClass"
        >
          <SchemaExplorer />
        </aside>
        <Button
          type="button"
          unstyled
          :class="WORKBENCH_BUTTON_STYLES.sidebarToggle"
          :title="schemaToggleTitle"
          @click="toggleSchemaSidebar"
        >
          <i
            class="pi text-xs"
            :class="schemaToggleIconClass"
          />
        </Button>
      </div>

      <div class="flex flex-col flex-1 min-h-0 min-w-0 overflow-hidden">

        <div
          class="flex flex-col gap-3 p-4 shrink-0 bg-white dark:bg-gray-800
                 border-b border-gray-200 dark:border-gray-700"
        >
          <SqlEditor />
          <ValidationPanel />
        </div>

        <div class="flex flex-col flex-1 min-h-0 bg-white dark:bg-gray-800">

          <div
            class="flex border-b border-gray-200 dark:border-gray-700 shrink-0 px-2"
          >
            <Button
              v-for="tab in tabs"
              :key="tab.id"
              type="button"
              unstyled
              :class="tabButtonClass(tab.id)"
              @click="store.activeTab = tab.id"
            >
              <i :class="`pi ${tab.icon} text-xs`" />
              {{ tab.label }}
              <span
                v-if="showResultsBadge(tab.id)"
                class="ml-1 px-1.5 py-0.5 rounded text-xs bg-blue-100 text-blue-600
                       dark:bg-blue-900/40 dark:text-blue-400"
              >
                {{ resultsBadgeCount }}
              </span>
            </Button>
          </div>

          <div class="flex-1 min-h-0 overflow-hidden">
            <ResultTable v-show="isResultsTabActive" class="h-full" />
            <QueryHistory v-show="isHistoryTabActive" class="h-full" />
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import { computed } from 'vue'
import { WORKBENCH_BUTTON_STYLES, getWorkbenchTabButtonClass } from '@/consts/buttonStyles'
import {
  QueryToolbar,
  SchemaExplorer,
  SqlEditor,
  ValidationPanel,
  ResultTable,
  QueryHistory,
} from '@/components/index'
import { WORKBENCH_ACTIVE_TAB, WORKBENCH_TABS, WORKBENCH_UI_TEXTS } from '@/consts'
import { useSqlWorkbenchStore } from '@/stores'
import type { ActiveTab } from '@/stores'

const store = useSqlWorkbenchStore()

const tabs: Array<{ id: ActiveTab; label: string; icon: string }> = WORKBENCH_TABS

const schemaSidebarClass = computed<string>(() => (store.schemaCollapsed ? 'w-0' : 'w-56'))

const schemaToggleTitle = computed<string>(() =>
  store.schemaCollapsed ? WORKBENCH_UI_TEXTS.SIDEBAR_SHOW_SCHEMA : WORKBENCH_UI_TEXTS.SIDEBAR_HIDE_SCHEMA,
)

const schemaToggleIconClass = computed<string>(() =>
  store.schemaCollapsed ? 'pi-chevron-right' : 'pi-chevron-left',
)

const isResultsTabActive = computed<boolean>(
  () => store.activeTab === WORKBENCH_ACTIVE_TAB.RESULTS,
)

const isHistoryTabActive = computed<boolean>(
  () => store.activeTab === WORKBENCH_ACTIVE_TAB.HISTORY,
)

const resultsBadgeCount = computed<number>(() => store.result?.rowsCount ?? 0)

const toggleSchemaSidebar = (): void => {
  store.schemaCollapsed = !store.schemaCollapsed
}

const tabButtonClass = (tabId: ActiveTab): string =>
  getWorkbenchTabButtonClass(store.activeTab === tabId)

const showResultsBadge = (tabId: ActiveTab): boolean =>
  tabId === WORKBENCH_ACTIVE_TAB.RESULTS && Boolean(store.result)
</script>
