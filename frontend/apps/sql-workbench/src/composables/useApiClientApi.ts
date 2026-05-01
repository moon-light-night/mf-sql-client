import { useApiClient } from '@sql-client/api'

let _client: ReturnType<typeof useApiClient> | null = null

export const useApiClientApi = () => {
  if (!_client) {
    _client = useApiClient()
  }
  return _client
}