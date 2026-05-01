import { computed, readonly, ref } from 'vue'

export type ThemeMode = 'light' | 'dark'

const THEME_STORAGE_KEY = 'sql-client-theme'
const theme = ref<ThemeMode>('light')

let isInitialized = false

function getStoredTheme(): ThemeMode | null {
  if (typeof window === 'undefined') return null

  const saved = window.localStorage.getItem(THEME_STORAGE_KEY)
  return saved === 'light' || saved === 'dark' ? saved : null
}

function getPreferredTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolveTheme(): ThemeMode {
  return getStoredTheme() ?? getPreferredTheme()
}

function applyTheme(mode: ThemeMode) {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', mode === 'dark')
  }

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode)
  }
}

export function initTheme() {
  if (!isInitialized) {
    theme.value = resolveTheme()
    isInitialized = true
  }

  applyTheme(theme.value)

  return theme.value
}

export function useTheme() {
  initTheme()

  function setTheme(mode: ThemeMode) {
    theme.value = mode
    applyTheme(mode)
  }

  function toggleTheme() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  return {
    theme: readonly(theme),
    isDark: computed(() => theme.value === 'dark'),
    setTheme,
    toggleTheme,
  }
}