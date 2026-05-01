import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport'
import { SqlClientServiceClient } from '@api/gen/sqlclient/v1/sql_client.client'

const clients = new Map<string, SqlClientServiceClient>()

export function getGrpcClient(baseUrl: string): SqlClientServiceClient {
  const normalized = baseUrl.replace(/\/$/, '')
  const cached = clients.get(normalized)
  if (cached) return cached

  const transport = new GrpcWebFetchTransport({
    baseUrl: normalized,
    format: 'binary',
  })

  const client = new SqlClientServiceClient(transport)
  clients.set(normalized, client)
  return client
}
