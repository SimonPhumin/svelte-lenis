<script lang="ts">
	const {
		href = '',
		class: className = '',
		children
	} = $props<{
		href?: string;
		class?: string;
		children?: () => unknown;
	}>();

	const isProtocol = href?.startsWith('mailto:') || href?.startsWith('tel:');
	const isExternal = href?.startsWith('http');
</script>

{#if typeof href !== 'string'}
	<button class={className}>
		{@render children?.()}
	</button>
{:else if isProtocol || isExternal}
	<a class={className} {href} target="_blank" rel="noopener noreferrer">
		{@render children?.()}
	</a>
{:else}
	<a class={className} {href}>
		{@render children?.()}
	</a>
{/if}
