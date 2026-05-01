<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900">
    <aside class="w-56 shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div class="px-5 py-2 h-12 border-b border-gray-200 dark:border-gray-700">
        <span class="text-lg font-bold text-blue-600 dark:text-blue-400">SQL Client</span>
      </div>
      <nav class="flex-1 p-3 space-y-1">
        <RouterLink
          to="/"
          class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          exact-active-class="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
        >
          <i class="pi pi-code text-base" />
          Workbench
        </RouterLink>
        <RouterLink
          to="/history"
          class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          active-class="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
        >
          <i class="pi pi-history text-base" />
          History
        </RouterLink>
      </nav>
      <div class="px-5 py-3 border-t border-gray-200 dark:border-gray-700">
        <span class="text-xs text-gray-400">v0.1.0</span>
      </div>
    </aside>

    <main class="flex-1 overflow-hidden min-h-0 flex flex-col">
      <RouterView v-slot="{ Component }">
        <component :is="Component" class="flex-1 min-h-0 overflow-hidden" />
      </RouterView>
    </main>
  </div>
</template>
