import { browser } from '$app/environment';
import { writable, derived } from 'svelte/store';

// import { throttle } from 'throttle-debounce';

export interface Rect {
	height: number;
	width: number;
	top: number;
	left: number;
}

const DEFAULT_RECT = { height: 0, width: 0, top: 0, left: 0 };

export function useRect(lazy: boolean = false) {
	let node: HTMLElement | null;
	let resizeObserver: ResizeObserver;

	const rect = writable<Rect>({ ...DEFAULT_RECT });
	const lazyRect = writable<Rect>({ ...DEFAULT_RECT });

	const resize = () => {
		if (!node) return;

		const top = offsetTop(node);
		const left = offsetLeft(node);

		lazyRect.update((current) => ({ ...current, top, left }));

		if (!lazy) {
			rect.update((current) => ({ ...current, top, left }));
		}
	};

	const onResizeObserver = (entries: ResizeObserverEntry[]) => {
		const [entry] = entries;
		const { width, height } = entry.contentRect;

		lazyRect.update((current) => ({ ...current, width, height }));

		if (!lazy) {
			rect.update((current) => ({ ...current, width, height }));
		}
	};

	const unobserve = () => {
		if (!browser) return;
		if (node) resizeObserver?.unobserve(node);
		resizeObserver?.unobserve(document.body);
		resizeObserver?.disconnect();
	};

	const setRef = (elm: HTMLElement) => {
		if (!browser) return;
		if (!elm || elm === node) return;
		node = elm;

		unobserve();
		resize();

		resizeObserver = new ResizeObserver(onResizeObserver);
		resizeObserver.observe(node);
	};

	// Observer "document.body" by default
	// let callback: throttle<() => void>;
	// if (browser) {
	// 	let callback = throttle(debounce, resize);
	// 	resizeObserver = new ResizeObserver(callback);
	// 	resizeObserver.observe(document.body);
	// }

	// Create derived values for individual dimensions
	const width = derived(rect, ($rect) => $rect.width);
	const height = derived(rect, ($rect) => $rect.height);
	const top = derived(rect, ($rect) => $rect.top);
	const left = derived(rect, ($rect) => $rect.left);

	return {
		setRef,
		rect,
		lazyRect,
		width,
		height,
		top,
		left,
		cleanup: () => {
			unobserve();
		}
	} as const;
}

// offsetTop function returns the offsetTop value of a DOM element.
// The offsetTop value is the distance between the top of the element
// and the top of the viewport.
export function offsetTop(element: HTMLElement | null, accumulator = 0): number {
	if (!element) return 0;

	const top = accumulator + element.offsetTop;
	if (element.offsetParent) {
		return offsetTop(element.offsetParent as HTMLElement, top);
	}
	return top;
}

// offsetLeft function returns the offsetLeft value of a DOM element.
// The offsetLeft value is the distance between the left of the element
// and the left of the viewport.
export function offsetLeft(element: HTMLElement | null, accumulator = 0): number {
	if (!element) return 0;

	const left = accumulator + element.offsetLeft;
	if (element.offsetParent) {
		return offsetLeft(element.offsetParent as HTMLElement, left);
	}

	return left;
}
