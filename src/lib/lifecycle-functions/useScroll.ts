import { get } from 'svelte/store';

import { lenisStore } from '$lib/stores/lenis';

export function useScroll(callback: (data: { scroll: number; limit: number }) => void) {
	const lenisVal = get(lenisStore);
	let unsubscribe: (() => void) | undefined;

	const setupScrollListener = () => {
		unsubscribe = lenisStore.subscribe((lenis) => {
			lenis?.on('scroll', callback);
		});
	};

	// Setup scroll listener
	setupScrollListener();

	return {
		setupScrollListener,
		cleanup: () => {
			lenisVal?.off('scroll', callback);
			unsubscribe?.();
		}
	};
}
