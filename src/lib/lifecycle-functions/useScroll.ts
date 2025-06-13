import { onMount } from 'svelte';
import { get } from 'svelte/store';
import type Lenis from 'lenis';

import { lenisStore } from '$lib/stores/lenis';

type ScrollCallback = (lenis: Lenis) => void;

export function useScroll(callback: ScrollCallback) {
	const lenisVal = get(lenisStore);

	const unsubscribe = lenisStore.subscribe((lenis) => {
		lenis?.on('scroll', callback);
		// lenis?.emit();
	});

	onMount(() => {
		return () => {
			lenisVal?.off('scroll', callback);
			unsubscribe();
		};
	});
}
