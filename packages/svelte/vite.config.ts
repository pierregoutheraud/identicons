import { sveltekit } from "@sveltejs/kit/vite";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			// The demo and its tests run on the engine's source rather than its built
			// dist, so engine edits hot-reload and the site builds without building
			// core first. Not kit.alias: svelte-package would rewrite the published
			// import into a relative path pointing outside the package.
			"@pierregoutheraud/identicons-core": fileURLToPath(
				new URL("../core/src/index.ts", import.meta.url)
			)
		}
	},
	server: {
		port: 5190
	},
	test: {
		include: ["src/**/*.{test,spec}.{js,ts}"]
	}
});
