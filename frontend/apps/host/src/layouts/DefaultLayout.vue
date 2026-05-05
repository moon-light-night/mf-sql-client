<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Desktop sidebar -->
    <aside class="layout-sidebar w-56 shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div class="px-5 py-2 h-12 border-b border-gray-200 dark:border-gray-700 flex items-center">
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

    <!-- Main content -->
    <main class="layout-main flex-1 overflow-hidden min-h-0 flex flex-col">
      <RouterView v-slot="{ Component }">
        <component :is="Component" class="flex-1 min-h-0 overflow-hidden" />
      </RouterView>
    </main>

    <!-- Mobile bottom navigation -->
    <nav class="layout-bottom-nav bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <RouterLink
        to="/"
        class="flex flex-col items-center justify-center gap-0.5 text-gray-500 dark:text-gray-400
               transition-colors hover:text-blue-600 dark:hover:text-blue-400"
        exact-active-class="!text-blue-600 dark:!text-blue-400"
      >
        <i class="pi pi-code text-lg" />
        <span class="layout-bottom-nav__label">Workbench</span>
      </RouterLink>
      <RouterLink
        to="/history"
        class="flex flex-col items-center justify-center gap-0.5 text-gray-500 dark:text-gray-400
               transition-colors hover:text-blue-600 dark:hover:text-blue-400"
        active-class="!text-blue-600 dark:!text-blue-400"
      >
        <i class="pi pi-history text-lg" />
        <span class="layout-bottom-nav__label">History</span>
      </RouterLink>
    </nav>
  </div>
</template>

<style scoped>
/* --- Mobile-first defaults (< 768px) --- */
.layout-sidebar {
  display: none;
}

.layout-main {
  padding-bottom: 3.5rem; /* space for bottom nav */
}

.layout-bottom-nav {
  display: flex;
  align-items: stretch;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3.5rem;
  z-index: 50;
}

.layout-bottom-nav a {
  flex: 1;
}

.layout-bottom-nav__label {
  font-size: 10px;
  font-weight: 500;
}

/* --- Desktop (≥ 768px) --- */
@media (min-width: 768px) {
  .layout-sidebar {
    display: flex;
  }

  .layout-main {
    padding-bottom: 0;
  }

  .layout-bottom-nav {
    display: none;
  }
}
</style>
