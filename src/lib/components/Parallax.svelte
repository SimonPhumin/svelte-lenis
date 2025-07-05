<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { gsap } from 'gsap';

	import { useWindowSize } from '$lib/lifecycle-functions/useWindowSize';
	import { mapRange } from '$lib/utils/maths';

	const {
		id = 'parallax',
		speed = 1,
		position = '',
		class: className = '',
		children
	} = $props<{
		id?: string;
		speed?: number;
		position?: string;
		class?: string;
		children?: () => unknown;
	}>();

	const emit = createEventDispatcher();

	const { size } = useWindowSize();

	let triggerRef: HTMLDivElement;
	let targetRef: HTMLDivElement;

	$effect(() => {
		if (typeof window !== 'undefined' && targetRef) {
			const y = $size.width * speed * 0.1;

			const setY = gsap.quickSetter(targetRef, 'y', 'px');
			const set3D = gsap.quickSetter(targetRef, 'force3D');

			const timeline = gsap.timeline({
				scrollTrigger: {
					id: id,
					trigger: targetRef,
					scrub: true,
					start: 'top bottom',
					end: 'bottom top',
					onUpdate: (e) => {
						if (position === 'top') {
							setY(e.progress * y);
						} else {
							setY(-mapRange(0, 1, e.progress, -y, y));
						}

						set3D(e.progress > 0 && e.progress < 1);
					}
				}
			});

			emit('mounted');

			return () => {
				timeline.kill();
			};
		}
	});
</script>

<div bind:this={triggerRef} class={className}>
	<div bind:this={targetRef} class={className}>
		{@render children?.()}
	</div>
</div>
