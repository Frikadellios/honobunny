import cloudflare from '@astrojs/cloudflare'
import markdoc from '@astrojs/markdoc'
import mdx from '@astrojs/mdx'
import partytown from '@astrojs/partytown'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import keystatic from '@keystatic/astro'
import tailwindcss from '@tailwindcss/vite'
import AstroPWA from '@vite-pwa/astro'
import robotsTxt from 'astro-robots-txt'
import { defineConfig } from 'astro/config'
import rehypeExternalLinks from 'rehype-external-links'
import type { ManifestOptions } from 'vite-plugin-pwa'
import { remarkReadingTime } from './src/lib/readTime.ts'
import { SITE } from './src/site.config.ts'
import manifest from './webmanifest.json'

// https://astro.build/config
export default defineConfig({
	vite: {
		logLevel: 'info',
		server: {
			fs: {
				// Allow serving files from hoisted root node_modules
				allow: ['../..']
			}
		},
		define: {
			'process.env': process.env,
			__DATE__: `'${new Date().toISOString()}'`
		},
		plugins: [tailwindcss()],
		build: {
			cssMinify: 'lightningcss'
		}
	},
	site: SITE,
	prefetch: {
		defaultStrategy: 'viewport',
		prefetchAll: true
	},
	output: 'hybrid',
	adapter: cloudflare({
		platformProxy: {
			enabled: true
		}
	}),
	integrations: [
		sitemap({
			filter: (page) => page !== `${SITE}/keystatic`
		}),
		robotsTxt({
			sitemap: 'https://www.honobunny.pages.dev/sitemap-0.xml',
			host: 'honobunny'
		}),
		partytown({
			config: {
				forward: ['dataLayer.push'],
				debug: false
			}
		}),
		react(),
		markdoc(),
		keystatic(),
		mdx(),
		AstroPWA({
			base: '/',
			scope: '/',
			includeAssets: ['favicon.svg'],
			pwaAssets: {
				config: true
			},
			workbox: {
				skipWaiting: true,
				clientsClaim: true,
				navigateFallback: '/404',
				ignoreURLParametersMatching: [/./],
				globPatterns: ['**/*.{html,js,css,png,svg,json,ttf,ico,txt,jpeg,png}']
			},
			experimental: {
				directoryAndTrailingSlashHandler: true
			},
			devOptions: {
				enabled: true,
				navigateFallbackAllowlist: [/^\//]
			},
			mode: 'production',
			registerType: 'autoUpdate',
			manifest: manifest as Partial<ManifestOptions>
		})
	],
	markdown: {
		rehypePlugins: [
			[
				rehypeExternalLinks,
				{
					content: {
						type: 'text',
						value: ' 🔗'
					},
					target: '_blank',
					rel: ['nofollow', 'noreferrer']
				}
			]
		],
		remarkPlugins: [remarkReadingTime],
		shikiConfig: {
			theme: 'github-dark-dimmed',
			wrap: true
		},
		gfm: true
	}
})
