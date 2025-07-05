import { browser } from '$app/environment';
import { writable, derived } from 'svelte/store';

interface Size {
	width: number;
	height: number;
}

export function useWindowSize(initialWidth = Infinity, initialHeight = Infinity) {
	const size = writable<Size>({ width: initialWidth, height: initialHeight });
	let frame = 0;

	const setRafState = (value: Size) => {
		if (!browser) return;
		cancelAnimationFrame(frame);
		frame = requestAnimationFrame(() => {
			size.set(value);
		});
	};

	const handler = () => {
		if (!browser) return;
		setRafState({
			width: window.innerWidth,
			height: window.innerHeight
		});
	};

	// Set up the resize listener only in browser
	if (browser) {
		handler();
		window.addEventListener('resize', handler);
	}

	// Create derived values for individual dimensions
	const width = derived(size, ($size) => $size.width);
	const height = derived(size, ($size) => $size.height);

	return {
		size,
		width,
		height,
		handler,
		cleanup: () => {
			if (!browser) return;
			cancelAnimationFrame(frame);
			window.removeEventListener('resize', handler);
		}
	} as const;
}
