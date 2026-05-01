import type { TableInfo } from '@sql-client/types'
import { getGrpcClient } from '@api/grpc/client'
import { mapGrpcError } from '@api/grpc/errors'

export async function getSandboxSchema(baseUrl: string): Promise<TableInfo[]> {
  try {
    const client = getGrpcClient(baseUrl)
    const call = client.getSandboxSchema({})
    const response = await call.response
    return response.tables.map((table) => ({
      tableName: table.tableName,
      columns: table.columns.map((column) => ({
        name: column.name,
        dataType: column.dataType,
      })),
    }))
  } catch (error) {
    throw mapGrpcError(error)
  }
}
