import { onMount } from 'svelte';

import { raf } from '$lib/utils/tempus';

type Callback = (now?: number, deltaTime?: number) => void;

export function useFrame(callback: Callback, priority = 0) {
	onMount(() => {
		if (callback) {
			raf.add(callback, priority);

			return () => raf.remove(callback);
		}
	});
}
