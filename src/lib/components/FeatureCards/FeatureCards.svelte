<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import { useRect } from '$lib/lifecycle-functions/useRect';
	import { useWindowSize } from '$lib/lifecycle-functions/useWindowSize';
	import { useScroll } from '$lib/lifecycle-functions/useScroll';
	import { clamp, mapRange } from '$lib/utils/maths';

	import Card2 from './Card2.svelte';

	const cards = [
		{ text: 'Run scroll in the main thread' },
		{
			text: Card2
		},
		{ text: 'Made for 2022+' },
		{ text: 'Bring your own animation library' },
		{
			text: 'CONTROL THE SCROLL EASING DURATION'
		},
		{ text: 'Use any element as scroller' },
		{ text: 'Enjoy horizontal + vertical support' },
		{ text: 'Feel free to use "position: sticky" again' },
		{
			text: 'touch support'
		}
	];

	let containerRef: HTMLDivElement;

	const emit = createEventDispatcher();

	const { size: windowSize } = useWindowSize();
	const { setRef, rect } = useRect();

	$effect(() => {
		if (typeof window !== 'undefined' && containerRef) {
			setRef(containerRef);

			emit('mounted');
		}
	});

	useScroll(({ scroll }) => {
		if (!containerRef) return;

		const end = $rect.top + $rect.height - $windowSize.height;

		containerRef.style.setProperty(
			'--progress',
			String(clamp(0, mapRange($rect.top, end, scroll, 0, 1), 1))
		);
	});
</script>

<div class="cards" bind:this={containerRef}>
	<div class="inner">
		<div class="grid">
			{#each cards as card, i (i)}
				<div class="card" style={`--i: ${i};`}>
					{#if typeof card.text === 'string'}
						<p class="text">{card.text}</p>
					{:else}
						<card.text />
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
	@use '$lib/styles/_functions' as *;

	.cards {
		.inner {
			.grid {
				display: grid;
				gap: desktop-vw(32px);
				grid-template-columns: repeat(auto-fit, minmax(desktop-vw(300px), 1fr));

				@include mobile {
					gap: mobile-vw(16px);
					grid-template-columns: 1fr;
				}

				.card {
					background-color: var(--theme-contrast);
					border-radius: desktop-vw(16px);
					padding: desktop-vw(32px);
					position: relative;

					@include mobile {
						border-radius: mobile-vw(16px);
						padding: mobile-vw(24px);
					}

					.text {
						font-size: desktop-vw(18px);
						font-weight: 500;
						line-height: 1.4;

						@include mobile {
							font-size: mobile-vw(16px);
						}
					}
				}
			}
		}
	}
</style>
