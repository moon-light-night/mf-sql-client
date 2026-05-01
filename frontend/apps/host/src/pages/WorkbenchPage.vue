<script setup lang="ts">
import { WORKBENCH_MAX_RETRY_ATTEMPTS, WORKBENCH_RETRY_DELAY_MS } from '@/consts'
import { onMounted, shallowRef } from 'vue'
import type { Component } from 'vue'

const remoteComponent = shallowRef<Component | null>(null)

async function loadRemoteWithRetry() {
  for (let attempts = 1; attempts <= WORKBENCH_MAX_RETRY_ATTEMPTS; attempts += 1) {
    try {
      const mod = await import('sql-workbench/WorkbenchApp')
      remoteComponent.value = mod.default as Component
      return
    } catch {
      if (attempts === WORKBENCH_MAX_RETRY_ATTEMPTS) {
        break
      }
      await new Promise((resolve) => setTimeout(resolve, WORKBENCH_RETRY_DELAY_MS))
    }
  }

  const fallback = await import('@/components/WorkbenchPlaceholder.vue')
  remoteComponent.value = fallback.default as Component
}

onMounted(loadRemoteWithRetry)
</script>

<template>
  <div v-bind="$attrs" class="flex-1 min-h-0 overflow-hidden">
    <component :is="remoteComponent" v-if="remoteComponent" class="h-full" />
    <div v-else class="flex items-center justify-center h-full text-gray-400">
      <i class="pi pi-spin pi-spinner text-2xl mr-2" />
      Loading workbench…
    </div>
  </div>
</template>
