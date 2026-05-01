import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@sql-client/config', () => ({
  config: {
    grpcWebBaseUrl: 'http://mock-envoy:8080',
  },
}))

const validateQuery = vi.fn()
const executeQuery = vi.fn()
const getSandboxSchema = vi.fn()
const listQueryHistory = vi.fn()

vi.mock('@api/client', () => ({
  validateQuery: (...args: unknown[]) => validateQuery(...args),
  executeQuery: (...args: unknown[]) => executeQuery(...args),
  getSandboxSchema: (...args: unknown[]) => getSandboxSchema(...args),
  listQueryHistory: (...args: unknown[]) => listQueryHistory(...args),
}))

describe('useApiClient', () => {
  beforeEach(() => {
    validateQuery.mockReset()
    executeQuery.mockReset()
    getSandboxSchema.mockReset()
    listQueryHistory.mockReset()
  })

  it('подставляет base url из config для validate/execute', async () => {
    const { useApiClient } = await import('@api/composable')
    const api = useApiClient()

    await api.validateQuery('SELECT 1')
    await api.executeQuery('SELECT 2')

    expect(validateQuery).toHaveBeenCalledWith('http://mock-envoy:8080', 'SELECT 1')
    expect(executeQuery).toHaveBeenCalledWith('http://mock-envoy:8080', 'SELECT 2')
  })

  it('вызывает schema/history методы с тем же base url', async () => {
    const { useApiClient } = await import('@api/composable')
    const api = useApiClient()

    await api.getSandboxSchema()
    await api.listQueryHistory(20, 40)

    expect(getSandboxSchema).toHaveBeenCalledWith('http://mock-envoy:8080')
    expect(listQueryHistory).toHaveBeenCalledWith('http://mock-envoy:8080', 20, 40)
  })
})
