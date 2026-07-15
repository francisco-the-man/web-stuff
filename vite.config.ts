import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { imagetools } from 'vite-imagetools'

// In dev, Vite's SPA fallback would swallow /admin/ and serve the React app;
// production (Netlify) serves public/admin/index.html as the directory index.
const adminIndexRewrite = (): Plugin => ({
  name: 'admin-index-rewrite',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (req.url === '/admin' || req.url === '/admin/') {
        req.url = '/admin/index.html'
      }
      next()
    })
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    adminIndexRewrite(),
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
