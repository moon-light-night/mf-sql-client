const BUTTON_BASE = [
  'inline-flex select-none items-center whitespace-nowrap rounded-md border border-transparent',
  'font-medium transition-colors duration-150',
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-0',
  'disabled:cursor-not-allowed disabled:opacity-50',
].join(' ')

export const WORKBENCH_BUTTON_STYLES = {
  icon: [
    BUTTON_BASE,
    'h-7 w-7 p-0 text-gray-500 dark:text-gray-400',
    'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700/70',
    'hover:text-gray-700 dark:hover:text-gray-100',
  ].join(' '),
  actionGhost: [
    BUTTON_BASE,
    'px-2.5 py-1.5 text-sm text-gray-500 dark:text-gray-300',
    'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700/70',
    'hover:text-gray-700 dark:hover:text-white',
  ].join(' '),
  actionSecondary: [
    BUTTON_BASE,
    'px-2.5 py-1.5 text-sm text-gray-100',
    'bg-gray-700 border-gray-600 hover:bg-gray-600',
  ].join(' '),
  actionPrimary: [
    BUTTON_BASE,
    'px-3 py-1.5 text-sm text-gray-950',
    'bg-emerald-400 border-emerald-300 hover:bg-emerald-300',
  ].join(' '),
  sidebarToggle: [
    BUTTON_BASE,
    'h-full w-4 shrink-0 rounded-none border-r border-gray-200 dark:border-gray-700',
    'bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/40',
    'text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-300',
  ].join(' '),
  tabBase: [
    BUTTON_BASE,
    'relative -mb-px gap-1.5 border-b-2 rounded-none px-3 py-2 text-xs',
    'font-medium leading-none',
  ].join(' '),
  tabActive: 'border-blue-500 text-blue-600 dark:text-blue-400',
  tabInactive: 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300',
  treeItem: [
    BUTTON_BASE,
    'flex w-full items-center gap-2 px-2 py-1.5 text-left text-xs',
    'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700/60',
    'text-gray-700 dark:text-gray-200',
  ].join(' '),
  historyItem: [
    BUTTON_BASE,
    'flex w-full items-start justify-start rounded-none px-3 py-2.5 text-left',
    'bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20',
    'text-gray-700 dark:text-gray-200',
  ].join(' '),
  pagination: [
    BUTTON_BASE,
    'h-6 w-6 p-0 text-gray-500 dark:text-gray-400',
    'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700/70',
    'hover:text-gray-700 dark:hover:text-gray-100',
  ].join(' '),
  dismiss: [
    BUTTON_BASE,
    'h-6 w-6 p-0 bg-transparent text-current opacity-60',
    'hover:bg-black/5 dark:hover:bg-white/10 hover:opacity-100',
  ].join(' '),
} as const

export const getWorkbenchTabButtonClass = (active: boolean): string =>
  [
    WORKBENCH_BUTTON_STYLES.tabBase,
    active ? WORKBENCH_BUTTON_STYLES.tabActive : WORKBENCH_BUTTON_STYLES.tabInactive,
  ].join(' ')
