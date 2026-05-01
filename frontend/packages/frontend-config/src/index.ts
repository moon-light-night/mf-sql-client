export interface AppConfig {
  apiUrl: string
  grpcWebBaseUrl: string
  appTitle: string
}

export { initTheme, useTheme } from './useTheme'
export type { ThemeMode } from './useTheme'

function requireEnv(key: string): string {
  const value = (import.meta.env as Record<string, string | undefined>)[key]
  if (!value) {
    console.warn(`[sql-client/config] Missing env variable: ${key}`)
    return ''
  }
  return value
}

export const config: AppConfig = {
  apiUrl: requireEnv('VITE_APP_API_URL'),
  grpcWebBaseUrl: requireEnv('VITE_APP_GRPC_WEB_BASE_URL'),
  appTitle: requireEnv('VITE_APP_TITLE') || 'SQL Client',
}
