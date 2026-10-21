// @ts-check
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // O front de producao vive em /lp-camargo-gallo/ e o de staging em
  // /staging/. Sem o base correto, os assets buildados (_astro/*) e os links
  // internos apontam para a raiz do dominio e caem na versao errada.
  // SITE_URL/BASE_PATH sao definidos em cada workflow de deploy.
  site: process.env.SITE_URL || 'https://camargogallo.com.br',
  base: process.env.BASE_PATH || '/',
  integrations: [vue(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
});