import type { QueryResult } from '@sql-client/types'
import { getGrpcClient } from '@api/grpc/client'
import { mapGrpcError } from '@api/grpc/errors'

export async function executeQuery(baseUrl: string, sql: string): Promise<QueryResult> {
  try {
    const client = getGrpcClient(baseUrl)
    const call = client.executeQuery({ sql })
    const response = await call.response
    return {
      columns: response.columns.map((column) => ({
        name: column.name,
        dataType: column.dataType,
      })),
      rows: response.rows.map((row) => ({ values: [...row.values] })),
      rowsCount: response.rowsCount,
      durationMs: Number(response.durationMs),
    }
  } catch (error) {
    throw mapGrpcError(error)
  }
}
