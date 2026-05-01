<template>
  <div class="flex flex-col h-full bg-white dark:bg-gray-800">
    <div
      class="flex items-center justify-between px-3 py-2.5 border-b
             border-gray-200 dark:border-gray-700 shrink-0"
    >
      <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {{ WORKBENCH_UI_TEXTS.SCHEMA }}
      </span>
      <Button
        type="button"
        unstyled
        :class="WORKBENCH_BUTTON_STYLES.icon"
        :disabled="store.schemaLoading"
        @click="reloadSchema"
      >
        <i :class="reloadIconClass" />
      </Button>
    </div>

    <div v-if="store.schemaLoading" class="flex flex-col gap-2 p-3">
      <div
        v-for="n in 5"
        :key="n"
        class="h-5 rounded bg-gray-300 dark:bg-gray-700/40 animate-pulse"
      />
    </div>

    <div v-else-if="store.schemaError" class="p-3">
      <div class="text-xs text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700/60 rounded px-2 py-1.5">
        {{ store.schemaError }}
      </div>
    </div>

    <div
      v-else-if="store.schema.length === 0"
      class="flex flex-col items-center justify-center gap-2 py-8 text-gray-500 dark:text-gray-400"
    >
      <i class="pi pi-database text-2xl opacity-40" />
      <span class="text-xs">{{ WORKBENCH_UI_TEXTS.SCHEMA_EMPTY }}</span>
    </div>

    <div v-else class="flex-1 overflow-y-auto p-2 space-y-1">
      <div
        v-for="table in store.schema"
        :key="table.tableName"
        class="rounded-md overflow-hidden"
      >
        <Button
          type="button"
          unstyled
          :class="`${WORKBENCH_BUTTON_STYLES.treeItem} group`"
          @click="toggleTable(table.tableName)"
        >
          <i
            class="pi text-xs transition-transform text-gray-500 dark:text-gray-400"
            :class="tableToggleIconClass(table.tableName)"
          />
          <i class="pi pi-table text-xs text-blue-500" />
          <span class="text-xs font-medium text-gray-700 dark:text-gray-200 truncate flex-1">
            {{ table.tableName }}
          </span>
          <span class="text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
            {{ table.columns.length }}
          </span>
        </Button>

        <Transition name="expand">
          <div v-if="isTableExpanded(table.tableName)" class="ml-4 border-l border-gray-200 dark:border-gray-700 pl-2 pb-1">
            <div
              v-for="col in table.columns"
              :key="col.name"
              class="grid grid-cols-[10px_minmax(0,1fr)_max-content] items-center gap-1.5 px-2 py-0.5 min-w-0"
            >
              <i class="pi pi-minus text-gray-300 text-xs" />
              <span class="text-[11px] text-gray-600 dark:text-gray-300 truncate min-w-0" :title="col.name">{{ col.name }}</span>
              <span
                class="text-[10px] text-gray-400 font-mono max-w-20 truncate"
                :title="col.dataType"
              >
                {{ compactType(col.dataType) }}
              </span>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import { computed, onMounted, ref } from 'vue'
import { WORKBENCH_BUTTON_STYLES } from '@/consts/buttonStyles'
import { WORKBENCH_UI_TEXTS } from '@/consts'
import { useSqlWorkbenchStore } from '@/stores'
import { useSchemaExplorer } from '@/composables/index'

const store = useSqlWorkbenchStore()
const { loadSchema, reloadSchema } = useSchemaExplorer()

const expanded = ref<Set<string>>(new Set())

const reloadIconClass = computed<string>(() =>
  store.schemaLoading ? 'pi pi-spin pi-spinner text-sm' : 'pi pi-refresh text-sm',
)

const isTableExpanded = (name: string): boolean => expanded.value.has(name)

const tableToggleIconClass = (name: string): string =>
  isTableExpanded(name) ? 'pi-chevron-down' : 'pi-chevron-right'

const toggleTable = (name: string): void => {
  if (expanded.value.has(name)) {
    expanded.value.delete(name)
  } else {
    expanded.value.add(name)
  }
  expanded.value = new Set(expanded.value)
}

const compactType = (dataType: string): string => {
  const type = dataType.toLowerCase()

  switch (type) {
    case 'character varying':
      return 'varchar'
    case 'timestamp with time zone':
      return 'timestamptz'
    case 'timestamp without time zone':
      return 'timestamp'
    case 'double precision':
      return 'float8'
    default:
      return dataType
  }
}

onMounted(() => {
  loadSchema()
})
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.15s ease;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}
.expand-enter-to,
.expand-leave-from {
  max-height: 200px;
}
</style>
