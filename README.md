# identicons

Seeded pixel identicons, as a framework-agnostic engine plus Svelte and React components.

| Package                                                                                                  | Path                                 |                                                                                |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------ |
| [`svelte-identicons`](https://www.npmjs.com/package/svelte-identicons)                                   | [`packages/svelte`](packages/svelte) | Svelte 5 component, and the [demo site](https://svelte-identicons.vercel.app/) |
| [`@pierregoutheraud/react-identicons`](https://www.npmjs.com/package/@pierregoutheraud/react-identicons) | [`packages/react`](packages/react)   | React component, with a dev playground                                         |
| [`@pierregoutheraud/identicons-core`](https://www.npmjs.com/package/@pierregoutheraud/identicons-core)   | [`packages/core`](packages/core)     | The engine both components draw with                                           |

Both components hand the same options to the same engine, so a seed draws the same image in Svelte and React.

## Development

```sh
pnpm install
pnpm dev:svelte   # demo site on http://localhost:5190
pnpm dev:react    # React playground on http://localhost:5194 (PORT overrides it)
pnpm test         # every package
pnpm check        # builds core, then type-checks every package
pnpm build:libs   # core, react and the svelte library, in dependency order
```

The demo site, the playground and their tests import the engine from `packages/core/src` through a Vite alias, so engine edits hot-reload and nothing has to be built first. Type-checking and library builds use core's built `dist`.

The React playground reads the same query string as the demo site's home page, so pasting a demo URL's query into the playground renders the same identicon.

## Publishing

Publish with `pnpm publish` (not `npm publish`), so `workspace:^` dependencies are rewritten to real version ranges. Publish core first when its version changes.
