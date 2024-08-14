import cloudflare from '@astrojs/cloudflare'
import markdoc from '@astrojs/markdoc'
import react from '@astrojs/react'
import keystatic from '@keystatic/astro'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

export default defineConfig({
	vite: {
		plugins: [tailwindcss()]
	},
	output: 'hybrid',
	adapter: cloudflare({
		platformProxy: {
			enabled: true
		}
	}),
	integrations: [react(), markdoc(), keystatic()]
})
