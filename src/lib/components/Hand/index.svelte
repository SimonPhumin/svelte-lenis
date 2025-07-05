<script lang="ts">
	import Renderer from './renderer';

	import Particles from './Particles.svelte';
	import Arm from './Arm.svelte';

	let renderer = $state<Renderer>();
	let canvasRef = $state<HTMLCanvasElement>();
	let height = $state<number>(),
		width = $state<number>();
	let webglSupported = $state(true);

	$effect(() => {
		if (typeof window !== 'undefined') {
			height = window.innerHeight;
			width = window.innerWidth;

			try {
				renderer = new Renderer();
				if (canvasRef) {
					renderer.initialize(canvasRef);
					renderer.animate();
				}
			} catch (error) {
				console.warn('WebGL not supported, disabling 3D components:', error);
				webglSupported = false;
			}
		}
	});
</script>

<div class="canvas-container">
	<div class="container">
		{#if webglSupported}
			<canvas bind:this={canvasRef}>
				{#if renderer != undefined}
					<Particles {renderer} {width} {height} depth={500} count={100} size={150} />
					<Arm {renderer} />
				{/if}
			</canvas>
		{/if}
	</div>
</div>

<style lang="scss">
	.canvas-container {
		height: 100%;
		overflow: hidden;
		position: relative;
		width: 100%;

		.container {
			height: 100%;
			width: 100%;
		}

		canvas {
			display: block;
		}
	}
</style>
