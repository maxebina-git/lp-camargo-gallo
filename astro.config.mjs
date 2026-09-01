// @ts-check
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/lp-camargo-gallo/' : '/',
  integrations: [vue()],

  vite: {
    plugins: [tailwindcss()],
  },
});