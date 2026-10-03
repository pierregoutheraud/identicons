![identicons-2](https://i.imgur.com/42ZD3FG.png)
![identicons-1](https://i.imgur.com/bqjb4yW.png)

# Demo

[Demo](https://svelte-identicons.vercel.app/) (built with the Svelte version, same engine and same output)

# Install

`pnpm add @pierregoutheraud/react-identicons`

Requires React 18 or later.

# Display identicon

```tsx
import { Identicon } from "@pierregoutheraud/react-identicons";

export function Avatar() {
	return (
		<Identicon
			seed="your-seed"
			height={10}
			width={10}
			pixelSize={10}
			numberOfColors={2}
			symetry="central"
			text={undefined}
			textColor="#ffffff"
		/>
	);
}
```

The same seed and options draw exactly the same image as [svelte-identicons](https://www.npmjs.com/package/svelte-identicons).

- `ref` is forwarded to the `<canvas>`, for example to export it with `canvas.toDataURL()`.
- `onColors` receives the palette the engine used, after it has drawn.
- Any other canvas attribute (`className`, `style`, `aria-label`, ...) is passed to the `<canvas>`.
- The component is marked `"use client"`, so it works from Next.js server components.
