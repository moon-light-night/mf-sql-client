import type { WorkbenchActiveTab, WorkbenchConnectionStatus } from '@/types'

export const DEFAULT_SQL_QUERY = 'SELECT * FROM customers LIMIT 10;'
export const WORKBENCH_HISTORY_PAGE_SIZE = 30

export const WORKBENCH_UI_TEXTS = {
  TITLE: 'SQL Workbench',
  THEME_SWITCH_LIGHT: 'Switch to light theme',
  THEME_SWITCH_DARK: 'Switch to dark theme',
  TAB_RESULTS: 'Results',
  TAB_HISTORY: 'History',
  SIDEBAR_SHOW_SCHEMA: 'Show schema',
  SIDEBAR_HIDE_SCHEMA: 'Hide schema',
  SQL_QUERY: 'SQL Query',
  ACTION_CLEAR: 'Clear',
  ACTION_VALIDATE: 'Validate',
  ACTION_RUN: 'Run',
  SHORTCUT_RUN: 'Ctrl+Enter',
  QUERY_HISTORY: 'Query History',
  QUERY_HISTORY_EMPTY: 'No query history yet',
  QUERY_HISTORY_EMPTY_HINT: 'Run your first query to start tracking',
  PAGINATION_OF: 'of',
  SCHEMA: 'Schema',
  SCHEMA_EMPTY: 'No schema loaded',
  STATUS_RUNNING: 'Running…',
  STATUS_ERROR: 'Error',
  RESULT_EMPTY_PROMPT: 'Run a query to see results',
  RESULT_EXECUTING: 'Executing…',
  RESULT_ZERO_ROWS: 'Query returned 0 rows',
  RESULT_CAPPED: 'Result is capped at 500 rows',
  ROW_SINGULAR: 'row',
  ROW_PLURAL: 'rows',
} as const

export const WORKBENCH_ACTIVE_TAB = {
  RESULTS: 'results',
  HISTORY: 'history',
} as const

export const WORKBENCH_CONNECTION_STATUS = {
  UNKNOWN: 'unknown',
  CONNECTED: 'connected',
  ERROR: 'error',
} as const

export const WORKBENCH_CONNECTION_STATUS_LABELS: Record<WorkbenchConnectionStatus, string> = {
  [WORKBENCH_CONNECTION_STATUS.UNKNOWN]: 'Connecting…',
  [WORKBENCH_CONNECTION_STATUS.CONNECTED]: 'Connected',
  [WORKBENCH_CONNECTION_STATUS.ERROR]: 'Disconnected',
}

export const WORKBENCH_TABS: Array<{ id: WorkbenchActiveTab; label: string; icon: string }> = [
  { id: WORKBENCH_ACTIVE_TAB.RESULTS, label: WORKBENCH_UI_TEXTS.TAB_RESULTS, icon: 'pi-table' },
  { id: WORKBENCH_ACTIVE_TAB.HISTORY, label: WORKBENCH_UI_TEXTS.TAB_HISTORY, icon: 'pi-history' },
]

export const WORKBENCH_ERROR_MESSAGES = {
  QUERY_VALID: 'Query is valid',
  INVALID_QUERY: 'Invalid query',
  VALIDATION_FAILED: 'SQL did not pass validation',
  FALLBACK_ERROR: 'error',
} as const
