import { WORKBENCH_CONNECTION_STATUS } from '@/consts'
import { useSqlWorkbenchStore } from '@/stores'
import { useApiClientApi } from '@/composables/useApiClientApi'

export const useQueryHistory = () => {
  const store = useSqlWorkbenchStore()
  const client = useApiClientApi()

  const loadHistory = async (offset = 0) => {
    store.historyLoading = true
    store.historyError = null
    store.historyOffset = offset
    try {
      const res = await client.listQueryHistory(store.HISTORY_PAGE, offset)
      store.setHistory(res.entries, res.total)
      store.setConnectionStatus(WORKBENCH_CONNECTION_STATUS.CONNECTED)
    } catch (err) {
      store.setConnectionStatus(WORKBENCH_CONNECTION_STATUS.ERROR)
      store.setHistoryError(err instanceof Error ? err.message : String(err))
    }
  }

  const nextPage = () => {
    const next = store.historyOffset + store.HISTORY_PAGE
    if (next < store.historyTotal) {
      loadHistory(next)
    }
  }

  const prevPage = () => {
    const prev = Math.max(0, store.historyOffset - store.HISTORY_PAGE)
    loadHistory(prev)
  }

  return { loadHistory, nextPage, prevPage }
}
