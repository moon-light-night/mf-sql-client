import { WORKBENCH_CONNECTION_STATUS } from '@/consts'
import { useSqlWorkbenchStore } from '@/stores'
import { useApiClientApi } from '@/composables/useApiClientApi'

export const useSchemaExplorer = () => {
  const store = useSqlWorkbenchStore()
  const client = useApiClientApi()

  const loadSchema = async () => {
    if (store.schema.length > 0) return
    store.schemaLoading = true
    store.schemaError = null
    try {
      const tables = await client.getSandboxSchema()
      store.setSchema(tables)
      store.setConnectionStatus(WORKBENCH_CONNECTION_STATUS.CONNECTED)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      store.setSchemaError(msg)
      store.setConnectionStatus(WORKBENCH_CONNECTION_STATUS.ERROR)
    }
  }

  const reloadSchema = async () => {
    store.schema = []
    await loadSchema()
  }

  return { loadSchema, reloadSchema }
}
