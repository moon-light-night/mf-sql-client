import { useApiClient } from '@sql-client/api'
import { WORKBENCH_ERROR_MESSAGES } from '@/consts'
import { useQueryStore } from '@/stores'

export const useQuery = () => {
  const store = useQueryStore()
  const client = useApiClient()

  const runQuery = async (sql: string) => {
    if (!sql.trim()) return

    store.setLoading(true)
    try {
      const result = await client.executeQuery(sql)
      store.setResult(result)
    } catch (err) {
      store.setError(err instanceof Error ? err.message : String(err))
    } finally {
      store.setLoading(false)
    }
  }

  const validateQuery = async (sql: string) => {
    if (!sql.trim()) return

    store.setLoading(true)
    try {
      const res = await client.validateQuery(sql)
      if (res.valid) {
        store.setInfo(res.message || WORKBENCH_ERROR_MESSAGES.QUERY_VALID)
      } else {
        store.setError(res.message || WORKBENCH_ERROR_MESSAGES.INVALID_QUERY)
      }
    } catch (err) {
      store.setError(err instanceof Error ? err.message : String(err))
    } finally {
      store.setLoading(false)
    }
  }

  return { runQuery, validateQuery }
}

