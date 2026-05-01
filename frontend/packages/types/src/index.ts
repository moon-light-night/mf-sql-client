export interface Column {
  name: string
  dataType: string
}

export interface Row {
  values: string[]
}

export interface QueryResult {
  columns: Column[]
  rows: Row[]
  rowsCount: number
  durationMs: number
}

export interface TableInfo {
  tableName: string
  columns: Column[]
}

export interface HistoryEntry {
  id: string
  sql: string
  success: boolean
  error: string
  rowsCount: number
  durationMs: number
  executedAt: string
}

export interface ValidateResult {
  valid: boolean
  message: string
}
