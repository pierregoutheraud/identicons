# @pierregoutheraud/identicons-core

The engine behind [svelte-identicons](https://www.npmjs.com/package/svelte-identicons) and [@pierregoutheraud/react-identicons](https://www.npmjs.com/package/@pierregoutheraud/react-identicons). It draws a seeded pixel identicon on any `<canvas>`, with no framework dependency.

A seed identifies one fixed pattern: resizing the grid only reveals or hides cells, it never redraws them.

## Install

`pnpm add @pierregoutheraud/identicons-core`

## Usage

```typescript
import { Identicon } from "@pierregoutheraud/identicons-core";

const canvas = document.querySelector("canvas")!;

const identicon = new Identicon(canvas, {
	seed: "your-seed",
	width: 10,
	height: 10,
	pixelSize: 10,
	numberOfColors: 2,
	symetry: "central",
	onColors: undefined
});

// The palette the engine actually used.
console.log(identicon.options.colors);
```

See `IdenticonOptions` in `src/Identicon.ts` for every option.
