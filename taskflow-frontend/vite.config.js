import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'


// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(),
     VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'TaskFlow',
        short_name: 'TaskFlow',
        description: 'Aplicación de gestión de tareas.',
        theme_color: '#ffffff',

        icons: [
          {
            src: 'pwa-128x128.png',
            sizes: '128x128',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    })
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
