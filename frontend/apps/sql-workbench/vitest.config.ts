import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

const resolvePath = (relativePath: string) => decodeURIComponent(new URL(relativePath, import.meta.url).pathname)

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/tests/setup.ts'],
    include: ['src/**/*.test.ts'],
    css: false,
  },
  resolve: {
    alias: {
      '@api': resolvePath('../../packages/api/src'),
      '@': resolvePath('./src'),
    },
  },
})
