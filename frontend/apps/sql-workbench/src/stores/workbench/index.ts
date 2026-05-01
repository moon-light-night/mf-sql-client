import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { QueryResult, TableInfo, HistoryEntry, ValidateResult } from '@sql-client/types'
import {
  DEFAULT_SQL_QUERY,
  WORKBENCH_ACTIVE_TAB,
  WORKBENCH_CONNECTION_STATUS,
  WORKBENCH_HISTORY_PAGE_SIZE,
} from '@/consts'
import { WorkbenchActiveTab, WorkbenchConnectionStatus } from '@/types'

export type ActiveTab = WorkbenchActiveTab
export type ConnectionStatus = WorkbenchConnectionStatus

export const useSqlWorkbenchStore = defineStore('sqlWorkbench', () => {
  const sql = ref<string>(DEFAULT_SQL_QUERY)
  const executing = ref<boolean>(false)
  const result = ref<QueryResult | null>(null)
  const execError = ref<string | null>(null)
  const validating = ref<boolean>(false)
  const validation = ref<ValidateResult | null>(null)

  const schema = ref<TableInfo[]>([])
  const schemaLoading = ref<boolean>(false)
  const schemaError = ref<string | null>(null)

  const history = ref<HistoryEntry[]>([])
  const historyTotal = ref<number>(0)
  const historyLoading = ref<boolean>(false)
  const historyError = ref<string | null>(null)
  const historyOffset = ref<number>(0)
  const HISTORY_PAGE = WORKBENCH_HISTORY_PAGE_SIZE

  const connectionStatus = ref<ConnectionStatus>(WORKBENCH_CONNECTION_STATUS.UNKNOWN)
  const activeTab = ref<ActiveTab>(WORKBENCH_ACTIVE_TAB.RESULTS)
  const schemaCollapsed = ref<boolean>(false)

  const isLoading = computed<boolean>(() => executing.value || validating.value)
  const hasResult = computed<boolean>(() => result.value !== null)
  const rowCount = computed<number>(() => result.value?.rowsCount ?? 0)

  const setSql = (value: string) => {
    sql.value = value
  }

  const clearSql = () => {
    sql.value = ''
    clearResults()
  }

  const startExecution = () => {
    executing.value = true
    result.value = null
    execError.value = null
    validation.value = null
  }

  const setResult = (value: QueryResult) => {
    executing.value = false
    result.value = value
    execError.value = null
    activeTab.value = WORKBENCH_ACTIVE_TAB.RESULTS
  }

  const setExecError = (msg: string) => {
    executing.value = false
    execError.value = msg
    result.value = null
    activeTab.value = WORKBENCH_ACTIVE_TAB.RESULTS
  }

  const clearResults = () => {
    result.value = null
    execError.value = null
    validation.value = null
  }

  const startValidation = () => {
    validating.value = true
    validation.value = null
  }

  const setValidation = (value: ValidateResult) => {
    validating.value = false
    validation.value = value
  }

  const setValidationError = (msg: string) => {
    validating.value = false
    validation.value = { valid: false, message: msg }
  }

  const setSchema = (tables: TableInfo[]) => {
    schema.value = tables
    schemaLoading.value = false
    schemaError.value = null
  }

  const setSchemaError = (msg: string) => {
    schemaLoading.value = false
    schemaError.value = msg
  }

  const setHistory = (entries: HistoryEntry[], total: number) => {
    history.value = entries
    historyTotal.value = total
    historyLoading.value = false
    historyError.value = null
  }

  const setHistoryError = (msg: string) => {
    historyLoading.value = false
    historyError.value = msg
  }

  const restoreQuery = (entry: HistoryEntry) => {
    setSql(entry.sql)
    clearResults()
    activeTab.value = WORKBENCH_ACTIVE_TAB.RESULTS
  }

  const setConnectionStatus = (status: ConnectionStatus) => {
    connectionStatus.value = status
  }

  return {
    sql, 
    setSql, 
    clearSql,
    executing, 
    result, 
    execError,
    startExecution, 
    setResult,
    setExecError, 
    clearResults,
    validating, 
    validation,
    startValidation, 
    setValidation, 
    setValidationError,
    schema, 
    schemaLoading, 
    schemaError,
    setSchema, 
    setSchemaError,
    history, 
    historyTotal, 
    historyLoading, 
    historyError,
    historyOffset, 
    HISTORY_PAGE,
    setHistory, 
    setHistoryError, 
    restoreQuery,
    connectionStatus, 
    setConnectionStatus,
    activeTab, 
    schemaCollapsed,
    isLoading, 
    hasResult, 
    rowCount,
  }
})
