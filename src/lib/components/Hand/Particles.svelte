<script lang="ts">
	import {
		BufferAttribute,
		BufferGeometry,
		Color,
		MathUtils,
		Points,
		ShaderMaterial,
		Vector2,
		Clock
	} from 'three';

	import type Renderer from './renderer';

	// import { useScroll } from '$lib/lifecycle-functions/useScroll';

	import fragmentShader from './particles/fragment.glsl';
	import vertexShader from './particles/vertex.glsl';

	const {
		renderer,
		width = 250,
		height = 250,
		depth = 250,
		count = 1000,
		size = 100
	} = $props<{
		renderer: Renderer;
		width?: number;
		height?: number;
		depth?: number;
		count?: number;
		size?: number;
	}>();

	const positions = () => {
		const array = new Array(count * 3);

		for (let i = 0; i < array.length; i += 3) {
			array[i] = MathUtils.randFloatSpread(width);
			array[i + 1] = MathUtils.randFloatSpread(height);
			array[i + 2] = MathUtils.randFloatSpread(depth);
		}

		return Float32Array.from(array);
	};

	const noise = Float32Array.from(Array.from({ length: count * 3 }, () => Math.random() * 100));
	const sizes = Float32Array.from(Array.from({ length: count }, () => Math.random() * size));
	const speeds = Float32Array.from(Array.from({ length: count }, () => Math.random() * 0.2));
	const scales = Float32Array.from(Array.from({ length: count }, () => Math.random() * 100));

	let uniforms = $state({
		uTime: { value: 0 },
		uColor: {
			value: new Color('rgb(255, 207, 206)')
		},
		uScroll: {
			value: 0
		},
		uResolution: {
			value: new Vector2(width, height)
		}
	});

	$effect(() => {
		if (typeof window !== 'undefined' && renderer) {
			const bufferGeometry = new BufferGeometry();
			bufferGeometry.setAttribute('position', new BufferAttribute(positions(), 3));
			bufferGeometry.setAttribute('noise', new BufferAttribute(noise, 3));
			bufferGeometry.setAttribute('size', new BufferAttribute(sizes, 1));
			bufferGeometry.setAttribute('speed', new BufferAttribute(speeds, 1));
			bufferGeometry.setAttribute('scale', new BufferAttribute(scales, 1));

			const material = new ShaderMaterial({
				uniforms,
				vertexShader,
				fragmentShader,
				transparent: true
			});

			const dots = new Points(bufferGeometry, material);

			// uniforms.uResolution.value.set(renderer.viewport.width, renderer.viewport.height);

			renderer?.scene?.add(dots);

			const unsubscribe = renderer?.onFrame(({ clock }: { clock: Clock }) => {
				uniforms.uTime.value = clock.getElapsedTime();
			});

			return () => {
				if (unsubscribe) {
					unsubscribe();
				}
			};
		}
	});

	// useScroll(({ scroll }) => {
	// 	uniforms.uScroll.value = scroll;
	// });
</script>
