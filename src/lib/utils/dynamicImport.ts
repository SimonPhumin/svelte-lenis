const imports: Record<string, Promise<{ default: unknown }>> = {};

export async function dynamicImport(module: string, promise: Promise<{ default: unknown }>) {
	imports[module] = promise;
	return (await promise).default;
}

export async function waitForImports(modules: string[]) {
	return await Promise.all(modules.map((mod) => imports[mod]).filter(Boolean));
}
