import { registerSW } from 'virtual:pwa-register'

registerSW({
	immediate: true,
	onRegisteredSW(swScriptUrl) {
		// eslint-disable-next-line no-console
		console.log('SW registered: ', swScriptUrl)
	},
	onOfflineReady() {
		// eslint-disable-next-line no-console
		console.log('PWA application ready to work offline')
	}
})

window.addEventListener('load', () => {
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	const pwaToast = document.querySelector<HTMLDivElement>('#pwa-toast')!
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	const pwaToastMessage = pwaToast.querySelector<HTMLDivElement>('.message #toast-message')!
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	const pwaCloseBtn = pwaToast.querySelector<HTMLButtonElement>('#pwa-close')!
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	const pwaRefreshBtn = pwaToast.querySelector<HTMLButtonElement>('#pwa-refresh')!

	// biome-ignore lint/style/useConst: <explanation>
	let refreshSW: ((reloadPage?: boolean) => Promise<void>) | undefined

	const refreshCallback = () => refreshSW?.(true)

	const hidePwaToast = (raf = false) => {
		if (raf) {
			requestAnimationFrame(() => hidePwaToast(false))
			return
		}
		if (pwaToast.classList.contains('refresh')) pwaRefreshBtn.removeEventListener('click', refreshCallback)

		pwaToast.classList.remove('show', 'refresh')
	}
	const showPwaToast = (offline: boolean) => {
		if (!offline) pwaRefreshBtn.addEventListener('click', refreshCallback)
		requestAnimationFrame(() => {
			hidePwaToast(false)
			if (!offline) pwaToast.classList.add('refresh')
			pwaToast.classList.add('show')
		})
	}

	pwaCloseBtn.addEventListener('click', () => hidePwaToast(true))

	refreshSW = registerSW({
		immediate: true,
		onOfflineReady() {
			pwaToastMessage.innerHTML = 'App ready to work offline'
			showPwaToast(true)
		},
		onNeedRefresh() {
			pwaToastMessage.innerHTML = 'New content available, click on reload button to update'
			showPwaToast(false)
		},
		onRegisteredSW(swScriptUrl) {
			console.log('SW registered: ', swScriptUrl)
		}
	})
})
