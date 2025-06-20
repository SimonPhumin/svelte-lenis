import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const loader = new GLTFLoader();

// Optional: Provide a DRACOLoader instance to decode compressed mesh data
const dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath('/examples/jsm/libs/draco/');
loader.setDRACOLoader(dracoLoader);

export function loadGLB(path: string): Promise<GLTF> {
	return new Promise((res, rej) => {
		loader.load(
			path,
			function (gltf) {
				res(gltf);
			},
			undefined,
			function (error) {
				console.log('An error happened', error);
				rej(error);
			}
		);
	});
}
