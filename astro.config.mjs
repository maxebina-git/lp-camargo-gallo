// @ts-check
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // O base e o site variam por ambiente, e cada workflow de deploy define:
  //
  //   producao: base '/lp-camargo-gallo/'  -> o front fica em
  //             camargogallo.com.br/lp-camargo-gallo/
  //   staging : base '/'                   -> o subdominio
  //             staging.camargogallo.com.br tem como raiz o diretorio do
  //             deploy (/public_html/staging/), entao os assets ficam em
  //             /_astro/* e nao em /staging/_astro/*
  //
  // base errado quebra o front inteiro: os assets nao carregam (page sem
  // CSS) e os links internos ganham um prefixo duplicado.
  site: process.env.SITE_URL || 'https://camargogallo.com.br',
  base: process.env.BASE_PATH || '/',
  integrations: [vue(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
});