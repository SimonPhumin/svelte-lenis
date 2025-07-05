<script lang="ts">
	import Lns from './LNS.svelte';
	import Ei from './EI.svelte';

	const { class: className = '' } = $props<{ class?: string }>();
</script>

<div class={className}>
	<Lns fill="var(--pink)" />
	<Ei fill="var(--pink)" />
</div>

<style lang="scss">
	@use '$lib/styles/_functions' as *;

	$intro-out: 1500ms;

	:global(.translate) {
		@include desktop {
			transform: translate3d(0, -100%, 0);
			transition: transform $intro-out var(--ease-out-expo);
		}
	}

	:global(.mobile) {
		@include mobile {
			transform: translate3d(0, -105%, 0);
		}
	}
</style>
