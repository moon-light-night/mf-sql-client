import { WORKBENCH_CONNECTION_STATUS, WORKBENCH_ERROR_MESSAGES } from '@/consts'
import { useSqlWorkbenchStore } from '@/stores'
import { useApiClientApi } from '@/composables/useApiClientApi'

export const useQueryExecution = () => {
  const store = useSqlWorkbenchStore()
  const client = useApiClientApi()
  
  const executeQuery = async (sql: string, validateFirst = true) => {
    if (!sql.trim()) return

    if (validateFirst) {
      store.startValidation()
      try {
        const validation = await client.validateQuery(sql)
        store.setValidation(validation)

        if (!validation.valid) {
          store.setExecError(validation.message || WORKBENCH_ERROR_MESSAGES.VALIDATION_FAILED)
          return
        }
      } catch (err) {
        store.setConnectionStatus(WORKBENCH_CONNECTION_STATUS.ERROR)
        store.setValidationError(err instanceof Error ? err.message : String(err))
        return
      }
    }

    store.startExecution()
    try {
      const result = await client.executeQuery(sql)
      store.setResult(result)
      store.setConnectionStatus(WORKBENCH_CONNECTION_STATUS.CONNECTED)
      refreshHistory()
    } catch (err) {
      store.setConnectionStatus(WORKBENCH_CONNECTION_STATUS.ERROR)
      store.setExecError(err instanceof Error ? err.message : String(err))
    }
  }

  const validateQuery = async (sql: string) => {
    if (!sql.trim()) return
    store.startValidation()
    try {
      const result = await client.validateQuery(sql)
      store.setValidation(result)
      store.setConnectionStatus(WORKBENCH_CONNECTION_STATUS.CONNECTED)
    } catch (err) {
      store.setConnectionStatus(WORKBENCH_CONNECTION_STATUS.ERROR)
      store.setValidationError(err instanceof Error ? err.message : String(err))
    }
  }

  const refreshHistory = async () => {
    store.historyLoading = true
    try {
      const res = await client.listQueryHistory(store.HISTORY_PAGE, 0)
      store.historyOffset = 0
      store.setHistory(res.entries, res.total)
      store.setConnectionStatus(WORKBENCH_CONNECTION_STATUS.CONNECTED)
    } catch {
      store.historyLoading = false
    }
  }

  return { executeQuery, validateQuery, refreshHistory }
}
