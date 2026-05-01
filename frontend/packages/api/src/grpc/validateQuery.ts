import type { ValidateResult } from '@sql-client/types'
import { getGrpcClient } from '@api/grpc/client'
import { mapGrpcError } from '@api/grpc/errors'

export async function validateQuery(baseUrl: string, sql: string): Promise<ValidateResult> {
  try {
    const client = getGrpcClient(baseUrl)
    const call = client.validateQuery({ sql })
    const response = await call.response
    return {
      valid: response.valid,
      message: response.message,
    }
  } catch (error) {
    throw mapGrpcError(error)
  }
}
