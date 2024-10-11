import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'html/*',
          dest: 'html'
        },
        {
          src: 'css/*',
          dest: 'css'
        },
        {
          src: 'js/*',
          dest: 'js'
        }
      ]
    })
  ],
  base: '/PhysicScope/', // Set your GitHub repo as base path if needed
})
