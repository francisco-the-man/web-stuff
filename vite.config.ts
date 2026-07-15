import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { imagetools } from 'vite-imagetools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Serve large PNG/JPEG art scans as web-sized WebP without touching the source files
    imagetools({
      defaultDirectives: (url) => {
        if (/\.(png|jpe?g)$/i.test(url.pathname)) {
          return new URLSearchParams('format=webp&quality=80&w=2000')
        }
        return new URLSearchParams()
      },
    }),
  ],
  base: process.env.GITHUB_ACTIONS ? '/web-stuff/' : '/', // Base path only for GitHub Pages
})
