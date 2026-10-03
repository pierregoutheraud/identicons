"use client";

import {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useLayoutEffect,
	useRef,
	type ComponentPropsWithoutRef
} from "react";
import IdenticonEngine, {
	type IdenticonOptions
} from "@pierregoutheraud/identicons-core";

// useLayoutEffect draws before the browser paints, so there is no blank first
// frame. It does nothing on the server and React 18 warns about it there.
const useIsomorphicLayoutEffect =
	typeof window === "undefined" ? useEffect : useLayoutEffect;

export interface IdenticonProps extends Omit<
	ComponentPropsWithoutRef<"canvas">,
	"width" | "height"
> {
	height: number; // height in blocks
	width: number; // width in blocks
	pixelSize: number; // pixel size of 1 block
	seed: string;
	shape?: "square" | "circle";
	text?: string | undefined;
	numberOfColors?: number;
	colors?: string[] | undefined;
	symetry?: IdenticonOptions["symetry"];
	/** Tile edge when symetry is "tile". See IdenticonOptions.tileSize. */
	tileSize?: number;
	/** Where the mirror axis sits. See IdenticonOptions.symetryAxis. */
	symetryAxis?: IdenticonOptions["symetryAxis"];
	textColor?: IdenticonOptions["textColor"];
	textBackgroundColor?: IdenticonOptions["textBackgroundColor"];
	textPosition?: IdenticonOptions["textPosition"];
	textFont?: IdenticonOptions["textFont"];
	textPadding?: number;
	/**
	 * Receives the palette the engine actually used, after it has drawn.
	 *
	 * Not a redraw trigger: passing a new function every render is fine.
	 */
	onColors?: ((colors: string[]) => void) | undefined;
}

export const Identicon = forwardRef<HTMLCanvasElement, IdenticonProps>(
	function Identicon(
		{
			height,
			width,
			pixelSize,
			seed,
			shape = "square",
			text = undefined,
			numberOfColors = 2,
			colors = undefined,
			symetry = "axial",
			symetryAxis = "gap",
			tileSize = 5,
			textColor = undefined,
			textBackgroundColor = undefined,
			textPosition = "bottom-right",
			textFont = "3x4",
			textPadding = 1,
			onColors = undefined,
			style,
			...canvasProps
		},
		ref
	) {
		const canvasRef = useRef<HTMLCanvasElement>(null);
		useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement);

		// Read from a ref rather than listed as a dependency, so an inline callback
		// does not redraw every render, and whatever it closes over never decides
		// when the canvas redraws.
		const onColorsRef = useRef(onColors);
		useIsomorphicLayoutEffect(() => {
			onColorsRef.current = onColors;
		});

		// An inline array literal is a new object every render; keying on its
		// content redraws only when an entry actually changes.
		const colorsKey = colors ? JSON.stringify(colors) : undefined;

		useIsomorphicLayoutEffect(() => {
			const canvas = canvasRef.current;

			if (!canvas || !seed) {
				return;
			}

			const identicon = new IdenticonEngine(canvas, {
				seed,
				height,
				width,
				pixelSize,
				shape,
				numberOfColors,
				// Parsed from the key so the engine gets its own copy, never the
				// caller's array.
				colors: colorsKey ? (JSON.parse(colorsKey) as string[]) : undefined,
				symetry,
				symetryAxis,
				tileSize,
				text,
				textPosition,
				textFont,
				textColor,
				textBackgroundColor,
				textPadding,
				onColors: undefined
			});

			// Called here rather than handed to the engine (which fires it mid
			// construction) so the canvas is already drawn: a throwing callback does
			// not leave a blank canvas.
			onColorsRef.current?.(identicon.options.colors);
		}, [
			seed,
			height,
			width,
			pixelSize,
			shape,
			numberOfColors,
			colorsKey,
			symetry,
			symetryAxis,
			tileSize,
			text,
			textPosition,
			textFont,
			textColor,
			textBackgroundColor,
			textPadding
		]);

		return (
			<canvas
				{...canvasProps}
				ref={canvasRef}
				style={{
					display: "block",
					width: width * pixelSize,
					height: height * pixelSize,
					...style
				}}
			/>
		);
	}
);
