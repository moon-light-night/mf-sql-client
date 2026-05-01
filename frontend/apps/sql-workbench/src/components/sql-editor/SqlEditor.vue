<template>
  <div class="flex flex-col gap-2 min-h-0">
    <div class="flex items-center justify-between gap-2">
      <span class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {{ WORKBENCH_UI_TEXTS.SQL_QUERY }}
      </span>
      <div class="flex items-center gap-1.5">
        <Button
          type="button"
          unstyled
          :class="WORKBENCH_BUTTON_STYLES.actionGhost"
          :disabled="clearButtonDisabled"
          @click="store.clearSql()"
        >
          <i class="pi pi-times text-sm" />
          <span>{{ WORKBENCH_UI_TEXTS.ACTION_CLEAR }}</span>
        </Button>
        <Button
          type="button"
          unstyled
          :class="WORKBENCH_BUTTON_STYLES.actionSecondary"
          :disabled="validateButtonDisabled"
          @click="handleValidate"
        >
          <i :class="validateIconClass" />
          <span>{{ WORKBENCH_UI_TEXTS.ACTION_VALIDATE }}</span>
        </Button>
        <Button
          type="button"
          unstyled
          :class="WORKBENCH_BUTTON_STYLES.actionPrimary"
          :disabled="runButtonDisabled"
          @click="handleRun"
        >
          <i :class="runIconClass" />
          <span>{{ WORKBENCH_UI_TEXTS.ACTION_RUN }}</span>
        </Button>
      </div>
    </div>

    <div class="relative">
      <textarea
        v-model="store.sql"
        class="font-mono text-sm w-full resize-none leading-relaxed px-3 py-2 rounded-md
               border border-gray-300 dark:border-gray-700 bg-white dark:bg-transparent 
               text-gray-900 dark:text-gray-100 focus:outline-none
               focus:border-blue-500"
        rows="9"
        :placeholder="DEFAULT_SQL_QUERY"
        :disabled="store.isLoading"
        spellcheck="false"
        @keydown.ctrl.enter.prevent="handleRun"
        @keydown.meta.enter.prevent="handleRun"
      />
      <span
        class="absolute bottom-2 right-3 text-xs text-gray-400 dark:text-gray-600
               pointer-events-none select-none"
      >
        {{ WORKBENCH_UI_TEXTS.SHORTCUT_RUN }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import { computed } from 'vue'
import { WORKBENCH_BUTTON_STYLES } from '@/consts/buttonStyles'
import { DEFAULT_SQL_QUERY, WORKBENCH_UI_TEXTS } from '@/consts'
import { useSqlWorkbenchStore } from '@/stores'
import { useQueryExecution } from '@/composables/index'

const store = useSqlWorkbenchStore()
const { executeQuery, validateQuery } = useQueryExecution()

const hasSql = computed<boolean>(() => store.sql.trim().length > 0)
const clearButtonDisabled = computed<boolean>(() => !hasSql.value || store.isLoading)
const validateButtonDisabled = computed<boolean>(() => !hasSql.value || store.executing)
const runButtonDisabled = computed<boolean>(() => !hasSql.value || store.validating)
const validateIconClass = computed<string>(() =>
  store.validating ? 'pi pi-spin pi-spinner text-sm' : 'pi pi-check text-sm',
)

const runIconClass = computed<string>(() =>
  store.executing ? 'pi pi-spin pi-spinner text-sm' : 'pi pi-play text-sm',
)

const handleRun = () => {
  executeQuery(store.sql)
}

const handleValidate = () => {
  validateQuery(store.sql)
}
</script>
