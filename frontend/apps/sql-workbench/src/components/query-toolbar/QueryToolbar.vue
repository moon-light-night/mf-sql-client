<template>
  <div
    class="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800
           border-b border-gray-200 dark:border-gray-700 shrink-0 h-12"
  >
    <div class="flex items-center gap-3">
      <span class="font-bold text-blue-600 dark:text-blue-400 text-sm tracking-wide">
        {{ WORKBENCH_UI_TEXTS.TITLE }}
      </span>
      <span
        class="text-[11px] px-2 py-0.5 rounded-md border border-gray-400 dark:border-gray-600
               text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/40 uppercase tracking-wide"
      >
        test
      </span>
    </div>

    <div class="flex items-center gap-2 text-xs">
      <Button
        type="button"
        unstyled
        :class="WORKBENCH_BUTTON_STYLES.icon"
        :aria-label="themeAriaLabel"
        @click="toggleTheme"
      >
        <i :class="themeIconClass" />
      </Button>
      <span
        class="inline-block w-2 h-2 rounded-full"
        :class="statusDotClass"
      />
      <span
        :class="statusTextClass"
      >
        {{ WORKBENCH_CONNECTION_STATUS_LABELS[store.connectionStatus] }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import { computed } from 'vue'
import { useTheme } from '@sql-client/config'
import { WORKBENCH_BUTTON_STYLES } from '@/consts/buttonStyles'
import {
  WORKBENCH_CONNECTION_STATUS,
  WORKBENCH_CONNECTION_STATUS_LABELS,
  WORKBENCH_UI_TEXTS,
} from '@/consts'
import { useSqlWorkbenchStore } from '@/stores'

const store = useSqlWorkbenchStore()
const { isDark, toggleTheme } = useTheme()

const themeAriaLabel = computed<string>(() =>
  isDark.value ? WORKBENCH_UI_TEXTS.THEME_SWITCH_LIGHT : WORKBENCH_UI_TEXTS.THEME_SWITCH_DARK,
)

const themeIconClass = computed<string>(() =>
  isDark.value ? 'pi pi-sun text-sm' : 'pi pi-moon text-sm',
)

const statusDotClass = computed<string>(() => 
  store.connectionStatus === WORKBENCH_CONNECTION_STATUS.CONNECTED ? "bg-green-500" : "bg-red-500"
)

const statusTextClass = computed<string>(() => 
  store.connectionStatus === WORKBENCH_CONNECTION_STATUS.CONNECTED ? 'text-green-700 dark:text-green-400' : "text-red-600 dark:text-red-400"
)
</script>
