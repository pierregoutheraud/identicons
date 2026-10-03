import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// jsdom has no canvas backend and logs "Not implemented" on every getContext
// call. The engine fills imageData before it asks for a context and stops on
// null, so returning null is enough for it to run headlessly.
HTMLCanvasElement.prototype.getContext = (() =>
	null) as typeof HTMLCanvasElement.prototype.getContext;

afterEach(() => {
	cleanup();
});
