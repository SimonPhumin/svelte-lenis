import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

export function loadGLB(url: string): Promise<THREE.GLTF> {
	return new Promise((resolve, reject) => {
		loader.load(
			url,
			(gltf) => {
				resolve(gltf);
			},
			undefined,
			(error: unknown) => {
				console.error('Error loading GLB:', error);
				reject(error);
			}
		);
	});
}
