import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import IdenticonEngine, {
	type IdenticonOptions
} from "@pierregoutheraud/identicons-core";
import { Identicon } from "./Identicon.js";

const stubCanvas = () =>
	({
		width: 0,
		height: 0,
		getContext: () => null
	}) as unknown as HTMLCanvasElement;

/** What the engine draws on its own, for checking the component adds nothing. */
function engine(options: Omit<IdenticonOptions, "onColors">) {
	return new IdenticonEngine(stubCanvas(), { ...options, onColors: undefined });
}

const base = { seed: "eventual-mango", width: 10, height: 8, pixelSize: 5 };

describe("Identicon", () => {
	it("sizes the canvas in CSS pixels and in backing pixels", () => {
		const { container } = render(<Identicon {...base} />);
		const canvas = container.querySelector("canvas")!;

		expect(canvas.style.display).toBe("block");
		expect(canvas.style.width).toBe("50px");
		expect(canvas.style.height).toBe("40px");
		expect(canvas.width).toBe(50);
		expect(canvas.height).toBe(40);
	});

	it("reports exactly the palette the engine picks for the same props", () => {
		const onColors = vi.fn();
		render(<Identicon {...base} numberOfColors={4} onColors={onColors} />);

		expect(onColors).toHaveBeenCalledTimes(1);
		expect(onColors).toHaveBeenCalledWith(
			engine({ ...base, numberOfColors: 4 }).options.colors
		);
	});

	it("defaults to two colours, like the Svelte component", () => {
		const onColors = vi.fn();
		render(<Identicon {...base} onColors={onColors} />);

		expect(onColors.mock.calls[0][0]).toEqual(
			engine({ ...base, numberOfColors: 2 }).options.colors
		);
	});

	it("redraws when the seed changes", () => {
		const onColors = vi.fn();
		const { rerender } = render(<Identicon {...base} onColors={onColors} />);
		rerender(<Identicon {...base} seed="other-seed" onColors={onColors} />);

		expect(onColors).toHaveBeenCalledTimes(2);
		expect(onColors.mock.calls[1][0]).toEqual(
			engine({ ...base, seed: "other-seed", numberOfColors: 2 }).options.colors
		);
	});

	it("does not redraw for a new but equal colors array", () => {
		const onColors = vi.fn();
		const { rerender } = render(
			<Identicon
				{...base}
				colors={["#111111", "#222222"]}
				onColors={onColors}
			/>
		);
		rerender(
			<Identicon
				{...base}
				colors={["#111111", "#222222"]}
				onColors={onColors}
			/>
		);
		expect(onColors).toHaveBeenCalledTimes(1);

		rerender(
			<Identicon
				{...base}
				colors={["#111111", "#333333"]}
				onColors={onColors}
			/>
		);
		expect(onColors).toHaveBeenCalledTimes(2);
		expect(onColors).toHaveBeenLastCalledWith(["#111111", "#333333"]);
	});

	it("does not hand the caller's colors array to the engine", () => {
		const colors = ["#111111", "#222222"];
		const onColors = vi.fn();
		render(<Identicon {...base} colors={colors} onColors={onColors} />);

		expect(onColors.mock.calls[0][0]).toEqual(colors);
		expect(onColors.mock.calls[0][0]).not.toBe(colors);
	});

	it("does not redraw for a new onColors, but calls the latest one", () => {
		const first = vi.fn();
		const second = vi.fn();
		const { rerender } = render(<Identicon {...base} onColors={first} />);
		rerender(<Identicon {...base} onColors={second} />);

		expect(first).toHaveBeenCalledTimes(1);
		expect(second).not.toHaveBeenCalled();

		rerender(<Identicon {...base} seed="other-seed" onColors={second} />);
		expect(first).toHaveBeenCalledTimes(1);
		expect(second).toHaveBeenCalledTimes(1);
	});

	it("draws nothing without a seed", () => {
		const onColors = vi.fn();
		render(<Identicon {...base} seed="" onColors={onColors} />);

		expect(onColors).not.toHaveBeenCalled();
	});

	it("forwards its ref to the canvas", () => {
		const ref = createRef<HTMLCanvasElement>();
		const { container } = render(<Identicon {...base} ref={ref} />);

		expect(ref.current).toBe(container.querySelector("canvas"));
	});

	it("passes canvas attributes through, and lets style override the size", () => {
		const { container } = render(
			<Identicon
				{...base}
				className="avatar"
				aria-label="avatar"
				style={{ width: "100%" }}
			/>
		);
		const canvas = container.querySelector("canvas")!;

		expect(canvas.className).toBe("avatar");
		expect(canvas.getAttribute("aria-label")).toBe("avatar");
		expect(canvas.style.width).toBe("100%");
		expect(canvas.style.height).toBe("40px");
	});
});
