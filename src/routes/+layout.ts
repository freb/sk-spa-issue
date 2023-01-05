import { redirect } from '@sveltejs/kit'
import type { LayoutLoad } from "./$types";
import settings from '$stores/settings';
import { get } from 'svelte/store';

// https://kit.svelte.dev/docs/page-options#prerender
export const prerender = false;
// https://kit.svelte.dev/docs/page-options#ssr
export const ssr = false;
// https://kit.svelte.dev/docs/page-options#csr
export const csr = true;

