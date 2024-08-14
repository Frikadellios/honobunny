import cloudflare from '@astrojs/cloudflare'
import markdoc from '@astrojs/markdoc'
import mdx from '@astrojs/mdx'
import partytown from '@astrojs/partytown'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import keystatic from '@keystatic/astro'
import tailwindcss from '@tailwindcss/vite'
import robotsTxt from 'astro-robots-txt'
import { defineConfig } from 'astro/config'
import rehypeExternalLinks from 'rehype-external-links'
import { remarkReadingTime } from './src/lib/readTime'
import { SITE } from './src/site.config.ts'

// https://astro.build/config
export default defineConfig({
	vite: {
		define: {
			'process.env': process.env
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
		mdx()
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
