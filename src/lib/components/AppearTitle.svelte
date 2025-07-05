<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import cn from 'clsx';

	import { intersection } from '$lib/actions/intersection';
	import { useMediaQuery } from '$lib/lifecycle-functions/useMediaQuery';
	import { useRect } from '$lib/lifecycle-functions/useRect';

	const { visible = true, children } = $props<{
		visible?: boolean;
		children?: () => unknown;
	}>();

	let titleRef: HTMLSpanElement | null = null;
	let intersected = $state(false);

	const emit = createEventDispatcher();

	const { setRef: rectRef } = useRect();
	const { isMatch: isMobile } = useMediaQuery('(max-width: 800px)');

	$effect(() => {
		if (!$isMobile) {
			// Desktop-specific logic can be added here if needed
		}
	});

	$effect(() => {
		if (typeof window !== 'undefined') {
			emit('mounted');
		}
	});

	function rectAction(node: HTMLSpanElement) {
		rectRef(node);
	}
</script>

<span
	bind:this={titleRef}
	use:intersection={{
		threshold: 1
	}}
	use:rectAction
	class={cn('title', intersected && visible && 'visible')}
>
	<span class="line">
		{@render children?.()}
	</span>
</span>

<style lang="scss">
	@use '$lib/styles/_functions' as *;

	.title {
		.line {
			display: inline-block;
			overflow: hidden;

			> * {
				display: inline-block;
			}
		}

		&.visible {
			.line > * {
				transition: 1.2s var(--ease-out-expo) transform;
				transition-delay: calc(200ms * var(--i));
			}
		}

		&:not(.visible) {
			.line > * {
				transform: translateY(100%);
			}
		}
	}
</style>
