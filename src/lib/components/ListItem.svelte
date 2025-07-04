<script lang="ts">
	import { type Component } from 'svelte';
	import cn from 'clsx';

	const { class: className = '', ...rest } = $props<{
		href?: string;
		title?: string;
		source?: string;
		visible?: boolean;
		index?: number;
		class?: string;
	}>();

	let Arrow = $state<Component>();

	$effect(() => {
		if (typeof window !== 'undefined') {
			(async () => {
				Arrow = (await import('./Icons/ArrowDiagonal.svelte')).default;
			})();
		}
	});
</script>

<a
	href={rest.href}
	class={cn(className, 'item', rest.visible && 'visible')}
	style={`--i: ${rest.index}`}
>
	<div class="inner">
		<div class="title">
			<span class="text">{rest.title}</span>
			{#if Arrow}
				<Arrow class="arrow" />
			{/if}
		</div>
		<div class="source">
			<span>{rest.source}</span>
		</div>
	</div>
</a>

<style lang="scss">
	@use '$lib/styles/_functions' as *;

	.item {
		position: relative;

		.inner {
			padding: mobile-vw(16px) 0;
			overflow: hidden;
			display: flex;
			justify-content: space-between;

			@include mobile {
				flex-direction: column;
			}

			@include desktop {
				align-items: center;
				padding: desktop-vw(16px) 0;
			}
		}

		&::after {
			content: '';
			position: absolute;
			left: 0;
			right: 0;
			height: desktop-vw(1px);
			background-color: var(--grey);
			bottom: 0;
		}

		&::before {
			position: absolute;
			left: 0;
			top: 0;
			content: '';
			width: 100%;
			height: 100%;
			background-color: var(--theme-contrast);
			transform: scaleY(0);
			transform-origin: top;
			transition: transform 600ms var(--ease-out-expo);
		}

		@include mobile {
			&::before {
				content: none;
			}
		}

		.title {
			display: flex;
			align-items: center;
			transition: transform 600ms var(--ease-out-expo);
			// will-change: transform;
			overflow: hidden;

			.text {
				font-weight: 500;
				line-height: 100%;
				font-size: mobile-vw(20px);
				letter-spacing: -0.03em;

				@include mobile {
					margin-bottom: mobile-vw(8px);
				}

				@include desktop {
					line-height: 114%;
					font-size: desktop-vw(28px);
				}
			}

			:global(.arrow) {
				aspect-ratio: 1 / 1;
				margin-left: auto;
				width: mobile-vw(19px);

				@include desktop {
					transform: translate(-20%, 20%);
					opacity: 0;
					margin-left: desktop-vw(24px);
					width: desktop-vw(19px);
				}
			}
		}

		.source {
			font-weight: 700;
			transition: transform 600ms var(--ease-out-expo);
			line-height: 100%;
			letter-spacing: -0.03em;
			font-size: mobile-vw(20px);
			will-change: transform;

			@include desktop {
				text-align: end;
				line-height: 114%;
				font-size: desktop-vw(28px);
			}
		}

		@include hover {
			&:hover {
				&::before {
					transform: scaleY(1);
					transform-origin: bottom;
				}

				.title {
					transform: translateX(desktop-vw(16px));

					:global(.arrow) {
						transition:
							opacity 600ms var(--ease-out-expo),
							transform 600ms var(--ease-out-expo);
						opacity: 1;
						transform: translate(0, 0);
						transition-delay: 100ms;
					}
				}

				.source {
					transform: translateX(desktop-vw(-16px));
				}
			}
		}

		// animation

		@include desktop {
			display: inline-block;
			width: 100%;
			transition: transform 1.2s var(--ease-out-expo);
			transition-delay: calc(100ms * var(--i));

			&::after {
				transition: transform 1.2s var(--ease-out-expo);
				transform-origin: right;
				transition-delay: calc(100ms * var(--i));
			}

			.source {
				overflow: hidden;
			}

			.text,
			.source > * {
				transition: transform 1.2s var(--ease-out-expo);
				display: block;
				transition-delay: calc(100ms * var(--i));
			}

			&:not(.visible) {
				transform: translateY(100%);

				&::after {
					transform: scaleX(0);
				}

				.text,
				.source > * {
					transform: translateY(100%);
				}
			}
		}
	}
</style>
