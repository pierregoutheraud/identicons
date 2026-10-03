import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Identicon, type IdenticonOptions } from "../src/index.js";

type Symetry = NonNullable<IdenticonOptions["symetry"]>;
type SymetryAxis = NonNullable<IdenticonOptions["symetryAxis"]>;
type TextPosition = NonNullable<IdenticonOptions["textPosition"]>;
type TextFont = NonNullable<IdenticonOptions["textFont"]>;
type Shape = "square" | "circle";

const SYMETRIES: Symetry[] = [
	"axial",
	"horizontal",
	"central",
	"kaleidoscope",
	"tile",
	"none"
];
const SYMETRY_AXES: SymetryAxis[] = ["gap", "column", "exact"];
const TEXT_POSITIONS: TextPosition[] = [
	"top-left",
	"top-center",
	"top-right",
	"center",
	"bottom-left",
	"bottom-center",
	"bottom-right"
];

interface Params {
	seed: string;
	width: number;
	height: number;
	pixelSize: number;
	numberOfColors: number;
	colors: string[];
	symetry: Symetry;
	symetryAxis: SymetryAxis;
	tileSize: number;
	shape: Shape;
	text: string;
	textColor: string;
	textPosition: TextPosition;
	textFont: TextFont;
}

function intOr(value: string | null, fallback: number): number {
	const parsed = parseInt(value || "", 10);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

// Same query parameters and defaults as the Svelte demo's home page, so a query
// string copied from there renders the same identicon here.
function parseParams(query: URLSearchParams): Params {
	return {
		seed: query.get("seed") || Math.random().toString(36).slice(2, 10),
		width: intOr(query.get("width"), 16),
		height: intOr(query.get("height"), 16),
		pixelSize: intOr(query.get("pixelSize"), 10),
		numberOfColors: intOr(query.get("numberOfColors"), 2),
		colors: query.get("colors")?.split(",").filter(Boolean) ?? [],
		symetry: (query.get("symetry") as Symetry) || "axial",
		symetryAxis: (query.get("symetryAxis") as SymetryAxis) || "gap",
		tileSize: intOr(query.get("tileSize"), 5),
		shape: (query.get("shape") as Shape) || "square",
		text: query.get("text") || "",
		textColor: query.get("textColor") || "#ffffff",
		textPosition: (query.get("textPosition") as TextPosition) || "bottom-right",
		textFont: (query.get("textFont") as TextFont) || "3x4"
	};
}

function toQuery(params: Params): string {
	const query = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		const text = Array.isArray(value) ? value.join(",") : String(value);
		if (text) {
			query.set(key, text);
		}
	}
	return query.toString();
}

function App() {
	const [params, setParams] = useState(() =>
		parseParams(new URLSearchParams(location.search))
	);
	const [palette, setPalette] = useState<string[]>([]);

	useEffect(() => {
		history.replaceState(null, "", `?${toQuery(params)}`);
	}, [params]);

	const set = <K extends keyof Params>(key: K, value: Params[K]) =>
		setParams((previous) => ({ ...previous, [key]: value }));

	const { shape, text, ...options } = params;
	const shared = {
		...options,
		shape,
		text: text || undefined,
		colors: params.colors.length ? params.colors : undefined
	};

	return (
		<main>
			<h1>react-identicons playground</h1>

			<section className="controls">
				<label>
					seed
					<input
						value={params.seed}
						onChange={(event) => set("seed", event.target.value)}
					/>
				</label>
				<button
					className="random"
					onClick={() => set("seed", Math.random().toString(36).slice(2, 10))}
				>
					random seed
				</button>
				<NumberInput
					label="width"
					value={params.width}
					onChange={(value) => set("width", value)}
				/>
				<NumberInput
					label="height"
					value={params.height}
					onChange={(value) => set("height", value)}
				/>
				<NumberInput
					label="pixelSize"
					value={params.pixelSize}
					onChange={(value) => set("pixelSize", value)}
				/>
				<NumberInput
					label="numberOfColors"
					value={params.numberOfColors}
					onChange={(value) => set("numberOfColors", value)}
				/>
				<label>
					colors (a,b,c)
					<input
						value={params.colors.join(",")}
						onChange={(event) =>
							set(
								"colors",
								event.target.value
									.split(",")
									.map((color) => color.trim())
									.filter(Boolean)
							)
						}
					/>
				</label>
				<Select
					label="symetry"
					value={params.symetry}
					options={SYMETRIES}
					onChange={(value) => set("symetry", value)}
				/>
				<Select
					label="symetryAxis"
					value={params.symetryAxis}
					options={SYMETRY_AXES}
					onChange={(value) => set("symetryAxis", value)}
				/>
				<NumberInput
					label="tileSize"
					value={params.tileSize}
					onChange={(value) => set("tileSize", value)}
				/>
				<Select
					label="shape"
					value={params.shape}
					options={["square", "circle"] as Shape[]}
					onChange={(value) => set("shape", value)}
				/>
				<label>
					text
					<input
						value={params.text}
						onChange={(event) => set("text", event.target.value)}
					/>
				</label>
				<label>
					textColor
					<input
						value={params.textColor}
						onChange={(event) => set("textColor", event.target.value)}
					/>
				</label>
				<Select
					label="textPosition"
					value={params.textPosition}
					options={TEXT_POSITIONS}
					onChange={(value) => set("textPosition", value)}
				/>
				<Select
					label="textFont"
					value={params.textFont}
					options={["3x4", "3x3"] as TextFont[]}
					onChange={(value) => set("textFont", value)}
				/>
			</section>

			<section className="main">
				<Identicon
					{...shared}
					data-testid="main-identicon"
					aria-label={`identicon for ${params.seed}`}
					onColors={setPalette}
				/>
				<div>
					<h2>palette used</h2>
					<div className="palette">
						{palette.map((color, index) => (
							<div className="swatch" key={`${color}-${index}`}>
								<span style={{ background: color }} />
								<span>{color}</span>
							</div>
						))}
					</div>
				</div>
			</section>

			<section>
				<h2>every symetry, same seed</h2>
				<div className="grid">
					{SYMETRIES.map((symetry) => (
						<div className="cell" key={symetry}>
							<Identicon {...shared} pixelSize={6} symetry={symetry} />
							{symetry}
						</div>
					))}
				</div>
			</section>

			<section>
				<h2>neighbouring seeds</h2>
				<div className="grid">
					{Array.from(
						{ length: 12 },
						(_, index) => `${params.seed}-${index}`
					).map((seed) => (
						<div className="cell" key={seed}>
							<Identicon {...shared} seed={seed} pixelSize={4} />
							{seed}
						</div>
					))}
				</div>
			</section>
		</main>
	);
}

function NumberInput(props: {
	label: string;
	value: number;
	onChange: (value: number) => void;
}) {
	return (
		<label>
			{props.label}
			<input
				type="number"
				min={1}
				value={props.value}
				onChange={(event) => {
					const value = parseInt(event.target.value, 10);
					if (value > 0) {
						props.onChange(value);
					}
				}}
			/>
		</label>
	);
}

function Select<T extends string>(props: {
	label: string;
	value: T;
	options: T[];
	onChange: (value: T) => void;
}) {
	return (
		<label>
			{props.label}
			<select
				value={props.value}
				onChange={(event) => props.onChange(event.target.value as T)}
			>
				{props.options.map((option) => (
					<option key={option}>{option}</option>
				))}
			</select>
		</label>
	);
}

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>
);
