import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // GitHub Pages 배포 시 저장소 이름을 base 경로로 사용 (Actions에서 GHPAGES_BASE 주입)
  base: process.env.GHPAGES_BASE || '/',
  plugins: [react(), tailwindcss()],
})
