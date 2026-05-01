import { config } from '@sql-client/config'
import {
  validateQuery as _validateQuery,
  executeQuery as _executeQuery,
  getSandboxSchema as _getSandboxSchema,
  listQueryHistory as _listQueryHistory,
} from '@api/client'
import type { QueryResult, TableInfo, HistoryEntry, ValidateResult } from '@sql-client/types'

function baseUrl(): string {
  return config.grpcWebBaseUrl
}

export function useApiClient() {
  return {
    validateQuery: (sql: string): Promise<ValidateResult> => _validateQuery(baseUrl(), sql),
    executeQuery: (sql: string): Promise<QueryResult> => _executeQuery(baseUrl(), sql),
    getSandboxSchema: (): Promise<TableInfo[]> => _getSandboxSchema(baseUrl()),
    listQueryHistory: (limit?: number, offset?: number): Promise<{ entries: HistoryEntry[]; total: number }> =>
      _listQueryHistory(baseUrl(), limit, offset),
  }
}
