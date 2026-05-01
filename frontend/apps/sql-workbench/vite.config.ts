import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

const resolvePath = (relativePath: string) => decodeURIComponent(new URL(relativePath, import.meta.url).pathname)
const resolveDeps = (pkg: string) => resolvePath(`../../../node_modules/${pkg}`)

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'sql-workbench',
      filename: 'remoteEntry.js',
      exposes: {
        './WorkbenchApp': './src/app/WorkbenchApp.vue',
      },
      shared: ['vue', 'vue-router', 'pinia', 'primevue'],
    }),
  ],
  resolve: {
    alias: {
      "@": resolvePath('./src'),
      "@api": resolvePath('../../packages/api/src'),
      "vue": resolveDeps('vue'),
      "vue-router": resolveDeps('vue-router'),
      "pinia": resolveDeps('pinia'),
      "primevue": resolveDeps('primevue')
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  server: {
    port: 5174,
    host: true,
    cors: true,
  },
  envDir: '../../../',
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
})
