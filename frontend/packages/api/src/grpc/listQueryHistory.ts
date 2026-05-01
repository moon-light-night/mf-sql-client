import type { HistoryEntry } from '@sql-client/types'
import { getGrpcClient } from '@api/grpc/client'
import { mapGrpcError } from '@api/grpc/errors'

export type HistoryResult = { entries: HistoryEntry[]; total: number }

export async function listQueryHistory(
  baseUrl: string,
  limit = 50,
  offset = 0,
): Promise<HistoryResult> {
  try {
    const client = getGrpcClient(baseUrl)
    const call = client.listQueryHistory({ limit, offset })
    const response = await call.response
    return {
      entries: response.entries.map((entry) => ({
        id: entry.id,
        sql: entry.sql,
        success: entry.success,
        error: entry.error,
        rowsCount: entry.rowsCount,
        durationMs: Number(entry.durationMs),
        executedAt: entry.executedAt,
      })),
      total: response.total,
    }
  } catch (error) {
    throw mapGrpcError(error)
  }
}
