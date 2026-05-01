import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { QueryResult } from '@sql-client/types'
import { DEFAULT_SQL_QUERY } from '@/consts'

export const useQueryStore = defineStore('query', () => {
  const sql = ref<string>(DEFAULT_SQL_QUERY)
  const result = ref<QueryResult | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const info = ref<string | null>(null)

  const setLoading = (value: boolean) => {
    loading.value = value
    if (value) {
      error.value = null
      info.value = null
    }
  }

  const setResult = (value: QueryResult) => {
    result.value = value
    error.value = null
    info.value = null
  }

  const setError = (message: string) => {
    error.value = message
    result.value = null
    info.value = null
  }

  const setInfo = (message: string) => {
    info.value = message
    error.value = null
  }

  const reset = () => {
    result.value = null
    error.value = null
    info.value = null
    loading.value = false
  }

  return { 
    sql, 
    result, 
    loading,
    error, 
    info, 
    setLoading, 
    setResult, 
    setError, 
    setInfo, 
    reset
  }
})
