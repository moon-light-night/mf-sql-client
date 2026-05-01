import { RpcError } from '@protobuf-ts/runtime-rpc'

export function mapGrpcError(error: unknown): Error {
  if (error instanceof RpcError) {
    const message = error.message?.trim() || 'gRPC error'
    const code = String(error.code ?? '')

    if (code === 'UNAVAILABLE' || code === '14') {
      return new Error('Сервис недоступен')
    }

    if (code === 'DEADLINE_EXCEEDED' || code === '4') {
      return new Error('Превышен таймаут запроса к серверу')
    }

    if (code === 'INVALID_ARGUMENT' || code === '3') {
      return new Error(message || 'Некорректный SQL-запрос')
    }

    return new Error(message)
  }

  if (error instanceof Error) {
    const lower = error.message.toLowerCase()

    if (lower.includes('failed to fetch') || lower.includes('networkerror')) {
      return new Error('Сетевая ошибка: не удалось соединиться с Envoy gRPC-Web endpoint')
    }

    if (lower.includes('cors')) {
      return new Error('Браузер заблокировал запрос (CORS)')
    }

    return new Error(error.message)
  }

  return new Error('Неизвестная ошибка при вызове gRPC-Web API')
}
