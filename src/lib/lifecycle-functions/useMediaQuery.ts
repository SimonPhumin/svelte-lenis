import { browser } from '$app/environment';
import { writable, derived } from 'svelte/store';

export function useMediaQuery(queryString: string) {
	const mediaQuery = (() => {
		if (browser) {
			try {
				return window.matchMedia(queryString);
			} catch (error) {
				if (process.env.NODE_ENV !== 'production') {
					console.error(error);
				}
			}
		}
		return null;
	})();

	const isMatch = writable(false);

	const onChange = ({ matches }: { matches: boolean }) => {
		isMatch.set(!!matches);
	};

	const opts = Object.defineProperty({}, 'passive', {
		get: function () {
			return true;
		}
	});

	// Set up the media query listener
	if (mediaQuery) {
		onChange(mediaQuery);
		mediaQuery.addEventListener('change', onChange, opts);
	}

	// Create a derived value that provides additional context
	const mediaQueryInfo = derived(isMatch, ($isMatch) => ({
		matches: $isMatch,
		query: queryString,
		mediaQuery: mediaQuery
	}));

	return {
		isMatch,
		mediaQueryInfo,
		cleanup: () => {
			mediaQuery?.removeEventListener('change', onChange, opts);
		}
	};
}
