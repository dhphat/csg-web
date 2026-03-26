import { resolve } from 'path'
import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    {
      name: 'html-rewrite',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && !req.url.includes('.') && req.url !== '/' && !req.url.startsWith('/@')) {
            const parsedUrl = new URL(req.url, 'http://localhost');
            const targetPath = path.join(__dirname, parsedUrl.pathname + '.html');
            if (fs.existsSync(targetPath)) {
              req.url = req.url.replace(parsedUrl.pathname, parsedUrl.pathname + '.html');
            }
          }
          next();
        });
      }
    }
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        project: resolve(__dirname, 'project.html'),
        'project-detail': resolve(__dirname, 'project-detail.html'),
        'hall-of-fame': resolve(__dirname, 'hall-of-fame.html'),
        member: resolve(__dirname, 'member.html'),
        achievement: resolve(__dirname, 'achievement.html'),
        about: resolve(__dirname, 'about.html'),
        department: resolve(__dirname, 'department.html'),
        admin: resolve(__dirname, 'admin/index.html'),
      },
    },
  },
})
