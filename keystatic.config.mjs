import { collection, config, fields } from '@keystatic/core'

export default config({
	storage: import.meta.env.DEV
		? {
				kind: 'local'
			}
		: {
				kind: 'github',
				repo: 'Frikadellios/honobunny'
			},
	collections: {
		posts: collection({
			label: 'Posts',
			slugField: 'title',
			path: 'src/content/posts/**/*',
			format: { contentField: 'content' },
			entryLayout: 'content',
			schema: {
				title: fields.slug({ name: { label: 'Title' } }),
				content: fields.mdx({ label: 'Content', extension: 'md' })
			}
		})
	}
})
