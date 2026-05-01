<template>
  <Transition name="slide-down">
    <div v-if="store.validation" class="rounded-lg border px-3 py-2 text-sm" :class="panelClass">
      <div class="flex items-start gap-2">
        <i class="mt-0.5 text-base" :class="iconClass" />
        <div class="min-w-0 flex-1">
          <span class="font-medium">{{ titleText }}</span>
          <span v-if="store.validation.message" class="ml-2 text-current opacity-80">
            {{ store.validation.message }}
          </span>
        </div>
        <Button
          type="button"
          unstyled
          :class="WORKBENCH_BUTTON_STYLES.dismiss"
          @click="store.validation = null"
        >
          <i class="pi pi-times text-xs" />
        </Button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import { computed } from 'vue'
import { WORKBENCH_BUTTON_STYLES } from '@/consts/buttonStyles'
import { WORKBENCH_ERROR_MESSAGES } from '@/consts'
import { useSqlWorkbenchStore } from '@/stores'

const store = useSqlWorkbenchStore()

const panelClass = computed<string>(() =>
  store.validation?.valid
    ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300'
    : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300',
)

const iconClass = computed<string>(() =>
  store.validation?.valid ? 'pi pi-check text-green-600 dark:text-green-400' : 'pi pi-times-circle text-red-500 dark:text-red-400',
)

const titleText = computed<string>(() =>
  store.validation?.valid ? WORKBENCH_ERROR_MESSAGES.QUERY_VALID : WORKBENCH_ERROR_MESSAGES.INVALID_QUERY,
)
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
