import cloudflare from '@astrojs/cloudflare'
import markdoc from '@astrojs/markdoc'
import react from '@astrojs/react'
import keystatic from '@keystatic/astro'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  output: 'hybrid',
  adapter: cloudflare({
    platformProxy: {
      enabled: true
    }
  }),
  integrations: [react(), markdoc(), keystatic()]
})
