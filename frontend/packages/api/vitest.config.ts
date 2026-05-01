import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@api': decodeURIComponent(new URL('./src', import.meta.url).pathname),
    },
  },
})
