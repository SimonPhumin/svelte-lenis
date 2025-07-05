import { raf } from '$lib/utils/tempus';

export function useFrame(callback: (time?: number) => void, priority = 0) {
	// Add the callback to RAF
	if (callback) {
		raf.add(callback, priority);
	}

	return {
		add: (newCallback: (time?: number) => void, newPriority = 0) => {
			raf.add(newCallback, newPriority);
		},
		remove: (callbackToRemove: (time?: number) => void) => {
			raf.remove(callbackToRemove);
		},
		cleanup: () => {
			if (callback) {
				raf.remove(callback);
			}
		}
	};
}
