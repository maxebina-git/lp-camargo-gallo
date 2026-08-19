# lp-camargo-gallo

LP de captação de leads da **Camargo Gallo Engenharia** (Astro + `@astrojs/vue`, consumindo o Design System `ds-grupo-rkb`).

- Theming: `<body data-theme="camargo-gallo">` (ver `src/layouts/BaseLayout.astro`).
- Consome o DS compilado via `file: ../ds-grupo-rkb` (import `ds-grupo-rkb/style.css`).

## Como refletir mudanças do DS nesta LP

Quando um token/componente mudar no DS, é preciso regenerar o `dist` do DS e, depois, forçar a LP a pegar o `dist` novo:

1. No DS (`C:\Users\maxeb\Projetos\ds-grupo-rkb`): `npm run build:lib`
2. Aqui: `npm run dev -- --force` (cache-bust) — ou reinstale o pacote.

> Fluxo completo e "frases de comando" canônicas: `docs/COMMANDS.md` no repo do DS.

## Scripts

| Comando | Ação |
| :--- | :--- |
| `npm install` | Instala dependências |
| `npm run dev` | Dev server em `localhost:4321` |
| `npm run build` | Build estático para `./dist/` |
| `npm run preview` | Preview do build |