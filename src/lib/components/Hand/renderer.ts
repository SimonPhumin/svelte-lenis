import {
	AmbientLight,
	Clock,
	DirectionalLight,
	OrthographicCamera,
	PerspectiveCamera,
	Scene,
	WebGLRenderer
} from 'three';

export default class Renderer {
	scene: Scene | undefined;
	camera: OrthographicCamera | PerspectiveCamera | undefined;
	renderer: WebGLRenderer | undefined;

	fov: number;
	nearPlane: number;
	farPlane: number;
	canvas: HTMLCanvasElement | undefined;

	viewport: {
		width: number;
		height: number;
	} = { width: 0, height: 0 };

	clock: Clock | undefined;

	ambientLight: AmbientLight | undefined;
	directionalLight: DirectionalLight | undefined;

	subscribers: ((args: { clock: Clock }) => void)[] = [];

	constructor() {
		this.scene = undefined;
		this.camera = undefined;
		this.renderer = undefined;

		// Camera params
		this.fov = 75;
		this.nearPlane = 1;
		this.farPlane = 1000;

		// Additional components
		this.clock = undefined;

		// Lighting is basically required
		this.ambientLight = undefined;
		this.directionalLight = undefined;

		this.animate = this.animate.bind(this);
	}

	initialize(canvas: HTMLCanvasElement) {
		if (!this.canvas) this.canvas = canvas;

		// Check WebGL support first
		if (!this.isWebGLAvailable()) {
			throw new Error('WebGL is not supported in this environment');
		}

		// Ensure canvas has proper dimensions
		if (canvas.width === 0 || canvas.height === 0) {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		}

		this.scene = new Scene();

		const width = window.innerWidth;
		const height = window.innerHeight;
		const aspect = width > height ? width / height : height / width;

		this.camera = new OrthographicCamera(
			-window.innerWidth / aspect,
			window.innerWidth / aspect,
			window.innerHeight / aspect,
			-window.innerHeight / aspect,
			0.01,
			10000
		);
		this.camera.position.set(0, 0, 1000);

		this.viewport.width = window.innerWidth / this.camera.zoom;
		this.viewport.height = window.innerHeight / this.camera.zoom;

		// Try multiple WebGL configurations
		const webglConfigs = [
			{ antialias: true, alpha: true, powerPreference: 'high-performance' as const },
			{ antialias: false, alpha: true, powerPreference: 'high-performance' as const },
			{ antialias: false, alpha: false, powerPreference: 'high-performance' as const },
			{ antialias: false, alpha: false, powerPreference: 'default' as const },
			{ antialias: false, alpha: false, powerPreference: 'low-power' as const }
		];

		for (const config of webglConfigs) {
			try {
				this.renderer = new WebGLRenderer({
					canvas: this.canvas,
					...config
				});
				this.renderer.setSize(this.viewport.width, this.viewport.height);

				const target = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
				this.renderer.setPixelRatio(Math.min(Math.max(0, target), 1));

				this.clock = new Clock();
				window.addEventListener('resize', () => this.onWindowResize(), false);

				console.log('WebGL initialized successfully with config:', config);
				return; // Success, exit the function
			} catch (error) {
				console.warn('WebGL config failed:', config, error);
				continue; // Try next config
			}
		}

		// If all configs failed
		throw new Error('WebGL initialization failed with all configurations');
	}

	private isWebGLAvailable(): boolean {
		try {
			const canvas = document.createElement('canvas');
			const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
			return !!gl;
		} catch {
			return false;
		}
	}

	animate() {
		window.requestAnimationFrame(this.animate);
		this.render();
	}

	render() {
		for (const subscriber of this.subscribers) {
			subscriber({ clock: this.clock! });
		}

		this.renderer!.render(this.scene!, this.camera!);
	}

	onWindowResize() {
		this.viewport.width = window.innerWidth;
		this.viewport.height = window.innerHeight;

		// if (this.camera) this.camera.aspect = window.innerWidth / window.innerHeight;

		this.camera?.updateProjectionMatrix();
		this.renderer?.setSize(window.innerWidth, window.innerHeight);
	}

	onFrame(subscriber: (arg: { clock: Clock }) => void) {
		this.subscribers.push(subscriber);

		return () => {
			this.subscribers = this.subscribers.filter((s) => s !== subscriber);
		};
	}
}
