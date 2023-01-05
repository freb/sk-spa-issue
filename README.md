Run `npm run dev` or `npm run preview` and open the server URL in a browser to see the issue.

An imported library that uses browser functions will error if imported inside `+page.ts` or `+layout.ts`, but it is fine inside `+page.svelte`. The app is configured for SPA, inlucinde proper exports in the root layout and adapter-static configuration in svelte.config.js.