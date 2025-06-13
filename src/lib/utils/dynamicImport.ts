interface DynamicModule {
	default: unknown;
}

const imports: Record<string, Promise<DynamicModule>> = {};

export async function dynamicImport(module: string, promise: Promise<DynamicModule>) {
	imports[module] = promise;
	return (await promise).default;
}

export async function waitForImports(modules: string[]) {
	return await Promise.all(modules.map((mod) => imports[mod]).filter(Boolean));
}
