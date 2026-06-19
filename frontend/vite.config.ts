import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

// https://vite.dev
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  resolve: {
    alias: {
      // Resolves exact absolute disk path to the root zod installation
      'zod': require.resolve('zod') 
    }
  },
  server: {
    fs: {
      allow: ['..'] 
    }
  }
})
