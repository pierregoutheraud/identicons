import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
	root: "playground",
	plugins: [react()],
	resolve: {
		alias: {
			// The playground and tests run on the engine's source rather than its
			// built dist, so engine edits hot-reload and nothing has to be built
			// first.
			"@pierregoutheraud/identicons-core": fileURLToPath(
				new URL("../core/src/index.ts", import.meta.url)
			)
		}
	},
	server: {
		port: Number(process.env.PORT) || 5194
	},
	test: {
		root: fileURLToPath(new URL(".", import.meta.url)),
		include: ["src/**/*.{test,spec}.{ts,tsx}"],
		environment: "jsdom",
		setupFiles: ["src/test-setup.ts"]
	}
});
