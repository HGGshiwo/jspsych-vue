import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const build_example = mode == 'example'
  const out_dir = build_example ? 'example/dist' : 'dist'

  const lib = {
    entry: path.resolve(__dirname, 'src/index.ts'),
    name: 'vue-jspsych',
    fileName: (format: any) => `index.${format}.js`
  }

  return {
    plugins: [vue(), vueDevTools()],
    base: './',
    build: {
      lib: build_example ? undefined : lib,
      outDir: out_dir
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})
