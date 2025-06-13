<script lang="ts">
	import { onMount } from 'svelte';
	import Lenis from 'lenis';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import cn from 'clsx';

	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { lenisStore as lenis, setLenisStore } from '$lib/stores/lenis';
	import { themeStore } from '$lib/stores/theme';
	import { useScroll } from '$lib/lifecycle-functions/useScroll';
	import { useFrame } from '$lib/lifecycle-functions/useFrame';
	import { raf } from '$lib/utils/tempus';

	import CustomHead from '$lib/components/CustomHead.svelte';
	import Intro from '$lib/components/Intro.svelte';
	import Scrollbar from '$lib/components/Scrollbar.svelte';
	import Footer from '$lib/components/Footer.svelte';

	import '../styles.css';
	import Cursor from '$lib/components/Cursor.svelte';

	let className = '';

	export { className as class };

	if (browser) {
		gsap.registerPlugin(ScrollTrigger);

		// Merge rafs
		gsap.ticker.remove(gsap.updateRoot);
		raf.add((time) => {
			gsap.updateRoot(time! / 1000);
		}, 0);
	}

	let hash = '';

	useScroll(ScrollTrigger.update);

	ScrollTrigger.defaults({ markers: process.env.NODE_ENV === 'development' });

	// $: if (browser && $lenis) {
	// 	ScrollTrigger.refresh();
	// }

	$: if (browser && $lenis) {
		ScrollTrigger.refresh();
		$lenis.start();
		// document.documentElement.style.removeProperty('overflow');
	}
	// else if (browser) {
	// 	$lenis?.stop();
	// 	document.documentElement.style.setProperty('overflow', 'hidden');
	// }

	$: if (browser && $lenis && hash) {
		const target = document.querySelector(hash);
		$lenis.scrollTo(target as HTMLElement, { offset: 0 });
	}

	onMount(() => {
		// Cursor = import('../lib/components/Cursor.svelte').default;

		window.history.scrollRestoration = 'manual';
		window.scrollTo(0, 0);

		const lenisInstance = new Lenis();
		setLenisStore(lenisInstance);

		function onLinkClick(e: MouseEvent) {
			e.preventDefault();

			const node = e.currentTarget;
			const nodeHash = (node as HTMLLinkElement).href.split('#').pop();

			hash = '#' + nodeHash;

			setTimeout(() => {
				window.location.hash = hash;
			}, 0);
		}

		const internalLinks: Element[] = [...document.querySelectorAll('[href]')].filter((node) =>
			(node as HTMLLinkElement).href.includes($page.url.pathname + '#')
		);

		internalLinks.forEach((node) => {
			(node as HTMLLinkElement).addEventListener('click', onLinkClick, false);
		});

		return () => {
			internalLinks.forEach((node) => {
				(node as HTMLLinkElement).removeEventListener('click', onLinkClick, false);
			});

			$lenis?.destroy();
			// setLenisStore(null);
		};
	});

	useFrame((time) => {
		$lenis?.raf(time);
	});
</script>

<!-- <RealViewport /> -->
<CustomHead title="Lenis – Get smooth or die trying" />
<div class={cn(`theme-${$themeStore}`, 'layout', className)}>
	<!-- <PageTransition /> -->
	<Intro />
	<svelte:component this={Cursor} />
	<Scrollbar />
	<main class="main"><slot /></main>
	<Footer />
	<Cursor />
</div>

<style lang="scss">
	@use '$lib/styles/_functions' as *;

	.layout {
		background-color: var(--theme-primary);
		color: var(--theme-secondary);
		display: flex;
		flex-direction: column;
		min-height: 100vh;

		.main {
			flex-grow: 1;
		}
	}
</style>
