# Documentação do Projeto — lp-camargo-gallo

Landing page de captação de leads da **Camargo Gallo Engenharia**, consumindo o Design System `ds-grupo-rkb`.

**Deploy**: GitHub Actions → FTP em `/public_html/lp-camargo-gallo/`

> **Atenção**: o site é de propósito **não indexável** (ver [7. Assets](#7-assets)) — `robots.txt` bloqueia todos os crawlers e o `.htaccess` envia `X-Robots-Tag: noindex, nofollow`. É uma LP de captação, não uma página orgânica.

---

## Sumário

1. [Stack](#1-stack)
2. [Consumo do ds-grupo-rkb](#2-consumo-do-ds-grupo-rkb)
3. [Estrutura do Projeto](#3-estrutura-do-projeto)
4. [Seções da LP](#4-seções-da-lp)
5. [Componentes Vue](#5-componentes-vue)
6. [Estilos](#6-estilos)
7. [Assets](#7-assets)
8. [Configurações](#8-configurações)
9. [Deploy](#9-deploy)
10. [Armadilhas Conhecidas](#10-armadilhas-conhecidas)
11. [Arquitetura e Padrões](#11-arquitetura-e-padrões)

---

## 1. Stack

| Camada             | Tecnologia           | Versão      |
| ------------------ | -------------------- | ----------- |
| Framework          | Astro                | ^7.2.3      |
| UI Framework       | Vue 3                | ^3.5.40     |
| CSS                | Tailwind CSS v4      | ^4.3.3      |
| Design System      | ds-grupo-rkb         | 1.0.19 (fixo) |
| Animações          | GSAP + ScrollTrigger | ^3.12.5     |
| Ícones             | @lucide/vue          | ^1.34.0     |
| Deploy             | GitHub Actions → FTP | —           |
| Runtime            | Node                 | >=22.12.0   |

O `ds-grupo-rkb` é a **única dependência sem caret** — é fixado em `1.0.19` de propósito, para o build não quebrar numa atualização do DS. Ao atualizar o DS, é preciso revisar o diff do `dist` (o CSS dele é importado inteiro).

**Não há `lint` nem `typecheck` no projeto.** Os scripts são apenas `dev`, `build`, `preview` e `astro`. A única verificação automática é `npm run build` — `@astrojs/check` não está instalado.

---

## 2. Consumo do ds-grupo-rkb

### 2.1 Versão

```json
// package.json
"ds-grupo-rkb": "1.0.19"
```

O CI **não** força mais nenhuma versão. Ambos os workflows fazem apenas `npm ci` → `npm run build`.

### 2.2 Importação do CSS

O CSS do DS é importado em **1 único lugar**, `src/styles/global.css`:

```css
@import "tailwindcss";              /* Tailwind v4 primeiro */
@import 'ds-grupo-rkb/style.css';  /* depois o DS */
```

`BaseLayout.astro:2-3` importa `../styles/global.css` e `../styles/lp.css`.

A ordem importa: o `style.css` do DS já embute utilitários Tailwind v4 e precisa vir **depois** do `@import "tailwindcss"`.

### 2.3 Componentes Consumidos

#### `src/pages/index.astro`

```js
import {
  Button, Tag, Container, FormField, Input, Textarea,
  Heading, Text, Section, Reveal, Card, FeatureCard,
  IconSet, BackToTop, Header, BrandIcon, Footer
} from 'ds-grupo-rkb'
```

#### `src/components/hero/HeroSlider.vue`

```js
import {
  Button, Container, Heading, Section, FeatureCard, Carousel, CarouselSlide
} from 'ds-grupo-rkb'
```

#### `src/components/hero/HeroTextColumn.vue`

```js
import { Button, Heading, Text } from 'ds-grupo-rkb'
```

#### `src/components/about/AboutSection.astro`

```js
import { Container, Heading, Section, Text } from 'ds-grupo-rkb'
import AboutBadges from './AboutBadges.vue'
```

#### `src/components/about/AboutBadges.vue`

```js
import { FeatureCard } from 'ds-grupo-rkb'
import { aboutBadges } from '../../data/about-badges'
```

#### `src/components/faq/FaqSection.vue`

```js
import { AccordionGroup, AccordionItem, Heading, Text, Section, Container } from 'ds-grupo-rkb'
```

#### `src/components/legal/LegalDrawer.vue`

```js
import { Drawer } from 'ds-grupo-rkb'
```

#### Não utilizados

`Grid`, `TypographyPalette`, `Reveal` no escopo do hero, `Drawer` (só via LegalDrawer).

### 2.4 Theming

O body usa `data-theme="camargo-gallo"` (`BaseLayout.astro:76`), o que ativa as CSS custom properties semânticas do DS (`--color-primary-600`, `--color-surface`, `--color-ink`, `--color-deep`, `--color-divider`, etc.).

### 2.5 Refletir Mudanças do DS

1. No DS (`C:\Users\maxeb\Projetos\ds-grupo-rkb`): `npm run build:lib`
2. Nesta LP: bump da versão em `package.json` e `npm run dev -- --force`

---

## 3. Estrutura do Projeto

```
lp-camargo-gallo/
├── astro.config.mjs            # site, vue, sitemap, tailwind via vite
├── package.json                # dependências e scripts
├── tsconfig.json               # extends astro/tsconfigs/strict
├── .gitignore
├── AGENTS.md                   # instruções para agentes
├── CLAUDE.md
├── README.md
│
├── docs/
│   └── DOCUMENTACAO-PROJETO.md # Este arquivo
│
├── public/
│   ├── assets/
│   │   ├── hero-slide/         # 12 .webp — 2 em uso, 10 órfãos
│   │   ├── decorative-underline.png
│   │   └── logo-camargo-gallo.png
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── og-image.jpg
│   ├── robots.txt              # Disallow: /  (bloqueia indexação)
│   └── .htaccess               # X-Robots-Tag: noindex, nofollow
│
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro    # shell: fonts, GA, JSON-LD, GSAP, theme
│   │
│   ├── pages/
│   │   └── index.astro         # única página — toda a LP
│   │
│   ├── components/
│   │   ├── about/
│   │   │   ├── AboutSection.astro    # seção Sobre + parallax GSAP
│   │   │   └── AboutBadges.vue       # 5 badges (FeatureCard) em fileira
│   │   ├── WhatsappButton.vue
│   │   ├── faq/FaqSection.vue
│   │   ├── hero/
│   │   │   ├── HeroSlider.vue          # carrossel de 2 slides + swipe
│   │   │   ├── HeroTextColumn.vue      # coluna de texto (h1, copy, CTAs)
│   │   │   └── HeroSlideIndicator.vue  # indicador de slides (mobile)
│   │   └── legal/
│   │       ├── LegalDrawer.vue
│   │       ├── PrivacyPolicy.vue
│   │       └── TermsOfUse.vue
│   │
│   └── data/
│       ├── diferenciais.ts     # 4 trust cards do hero
│       ├── about-badges.ts     # 5 badges flutuantes da seção Sobre
│       └── hero-fotos.ts       # 2 fotos do arco (slide V2)
│
├── src/styles/
│   ├── global.css              # 2 linhas — imports
│   └── lp.css                  # 171 linhas — estilos específicos
│
├── dist/                       # build estático
├── send-email.php              # envio via PHPMailer/SMTP
└── envia.php                   # envio legado (mail())
```

O array `servicos` (11 itens) fica no frontmatter de `index.astro`, **não** em `src/data/` — é consumido em um único lugar, o `.map` da seção de serviços.

---

## 4. Seções da LP

Toda a LP está em `src/pages/index.astro`, com estas seções, nesta ordem:

### 4.1 Hero — carrossel de 2 slides (`HeroSlider.vue`)

A/B test da coluna direita do hero. Rótulo acessível: `"Variações do destaque"`.

| Slide  | Coluna direita (desktop)   | Coluna direita (mobile)   |
| ------ | -------------------------- | ------------------------- |
| **V1** | 4 trust cards              | idem (empilhados abaixo)  |
| **V2** | Título "Serviços" + arco com moldura e 2 fotos | idem                      |

- Coluna de texto **idêntica** nos 2 slides, extraída para `HeroTextColumn.vue` (h1, parágrafo, 2 CTAs)
- V2 além do arco: `<Heading as="2" size="xl">Serviços</Heading>` acima do arco (mesmo estilo do título "Confiança que se mede" do V1) e link `+ Serviços` (ícone `Plus` do Lucide) ao fim do bloco, `href="#servicos"`; a linha de legenda + setas do arco permanece inalterada
- Rótulo `<h1>` renderiza 2× no DOM (1 por slide); só 1 é visível por viewport
- Tracking GA4: `lp_hero_slide` com label `v1`/`v2`

**Navegação:**

- Setas do DS, `nav-position="top-right"`, `nav-class="top-20! right-4"`, visíveis em todas as larguras
- Indicador de 2 segmentos, **apenas mobile** (`lg:hidden`), posicionado entre o texto e a coluna direita — no mesmo lugar nos 2 slides
- **Swipe por toque**, implementado com Pointer Events no root do `<Carousel>` (ver [10. Armadilhas](#10-armadilhas-conhecidas))
- Teclado: `ArrowLeft`/`ArrowRight` no root (`tabindex="0"` nativo do DS)

**Layout mobile:** ambos os slides empilham em coluna (`max-lg:flex-col`) com ordem `texto → indicador → coluna direita` (`max-lg:order-1` / `2` / `3`). O texto é ancorado no topo para não pular verticalmente ao trocar de slide.

O hero no mobile fica mais alto que a viewport (≈1050px a 390px de largura) porque o V1 tem os 4 cards e o V2 tem o arco. A altura é a mesma nos 2 slides, então o swipe não gera pulo de scroll.

### 4.2 Sobre (`AboutSection.astro`)

Seção `.astro` com parallax na imagem, posicionada logo após o hero. Duas colunas no desktop, empilhadas no mobile (`grid gap-10 md:grid-cols-2`):

- **Esquerda**: imagem `public/about-image.png` (1201×718) com parallax GSAP
- **Direita**: `Heading as="2" size="display"`, `Heading as="3" size="xl"`, texto institucional

**Parallax** (`src/components/about/AboutSection.astro:5-39`):

- Box `aspect-[1201/718] overflow-hidden`; `<img>` com `h-[200%] w-full object-cover` (object-position central)
- GSAP `fromTo {yPercent: 0 → -49}` com `scrub` e `invalidateOnRefresh`, trigger `top bottom → bottom top`
- A matemática: `h-[200%]` (+100% da altura do box) tolera deslocamento de até 100% do box; `yPercent -49` = 98%, com folga
- Por que não distorce: o box usa a **mesma proporção da fonte** (1201:718), então `cover` amplia só ~1,008× (imperceptível) — diferente do `og-image.jpg` (1200×630) que exigia upscale de até 1,92×
- `prefers-reduced-motion: reduce` → nenhum ScrollTrigger é criado
- O script aguarda `load` e lê `window.gsap`/`window.ScrollTrigger` do `BaseLayout` (módulos bundlados em ordem indeterminada)
- **Verificado** (headless Chrome): box 604×361 (1,673) desktop / 358×214 mobile; imagem renderizada sempre 200% do box; `translateY` vai de 0 a −354px desktop (= 98% do box) e reverte exatamente ao subir; `h1` permanece 2; sem overflow horizontal

**Badges** (`AboutBadges.vue` + `src/data/about-badges.ts`):

- 5 `FeatureCard tone="surface-alt"` (card claro `#fafafa` com borda `border-border` e texto/ícone `text-ink` escuros — visual de "etiqueta", diferente dos trust cards escuros do hero), **em fluxo normal dentro do `<Container>` da seção, em fileira abaixo do grid foto/texto** (`class="mt-10"`)
- **Grid responsivo**: classe **`.about-badges` definida em `lp.css`** (não tailwind `sm:/md:/xl:`) — mobile 1 coluna, `@media (width>=40rem)` 2 colunas, `>=48rem` 3, **`>=80rem` 5 lado a lado**; largura esticada (`w-full`, sem largura fixa) com `justify-center` interno (alturas iguais por linha, conteúdo verticalmente centralizado)
  - **Por que não tailwind**: o `ds-grupo-rkb` embute um Tailwind compilado próprio; em dev o `.sm\:grid-cols-2` da DS aparece **depois** das utilities do app e, por igual especificidade, venceria o `md:grid-cols-3`/`xl:grid-cols-5` (fixando em 2 colunas). Com media queries explícitas no `lp.css` o comportamento fica idêntico em dev e build
- Padding compacto **`!p-2`** (8px)
- Diagrama do card: **ícone (26px) no slot `#title` → `divider="3/4"` do own DS → título no slot `#description`** (text-sm font-bold). Ou seja, o separador "Three Quarters" (`h-2 rounded-full bg-divider w-3/4`, centralizado via `[&_[role=separator]]:mx-auto`) fica **entre o ícone e o título**
- Ícones (`@lucide/vue`): `HardHat` (Segurança do Trabalho), `BadgeCheck` (Qualidade Técnica Comprovada), `CalendarClock` (Respeito aos Prazos), `Scale` (Preço Justo), `ClipboardList` (Orçamentos por Eng. Civis)
- **Movimento**: keyframes CSS `badgeFloat` (`lp.css`) com `translateY(-14px)` alternado, **duração/atraso por card via inline style** (4,8s–7s, delays negativos) para efeito orgânico; `will-change: transform`; `gap-6` (24px) > amplitude (14px) → linhas adjacentes nunca colidem
- Conteúdo acessível (não é `aria-hidden`) pois carrega claims dos diferenciais
- `prefers-reduced-motion: reduce` → animação desligada (`.about-badge { animation: none }`)

### 4.3 Serviços (`#servicos`)

- 11 `FeatureCard` em grid `md:grid-cols-2 xl:grid-cols-3`
- `<Tag>` com `{servicos.length} Serviços` — **derivado do array**, nunca literal
- Sem `id` por serviço, então não há deep-link individual

### 4.4 FAQ (`#faq`)

- `FaqSection.vue` com `AccordionGroup` + 5 `AccordionItem`
- GSAP ScrollTrigger faz o scroll alterar o item ativo automaticamente
- Único branch responsivo real do projeto:
  ```js
  mm.add('(min-width: 768px)', () => create('+=250%'))
  mm.add('(max-width: 767px)', () => create('+=180%'))
  ```
- Respeita `prefers-reduced-motion`

### 4.5 Formulário de Contato (`#contato`)

- `Card` com `FormField`, `Input`, `Textarea`, `Button`
- Validação client-side (telefone, email, nome, mensagem)
- Envio via `fetch()` para `send-email.php`
- Tracking GA no submit

### 4.6 Footer

- `Footer` do DS, com `companyInfo` vindo do const `footerCompany` no frontmatter

### 4.7 Legal Drawer

- `LegalDrawer.vue` com `client:load`
- Hash routing: `#privacy` ou `#terms`

### 4.8 BackToTop + WhatsApp

- `BackToTop` do DS e `WhatsappButton.vue`, ambos `client:load`

### 4.9 Seções removidas

Não existem mais: `estudo-de-caso` (antes/depois), `trust-cards` (versão mobile), `obras-em-execucao` e a animação orbital.

> **Atenção**: o item `ESTUDOS DE CASO` permanece no `headerNav` (`index.astro:60-70`) e seus 5 links apontam para `#estudo-de-caso`, que não existe mais. O clique não faz nada — não é 404, é um no-op. Decisão consciente, pendente de revisão.

---

## 5. Componentes Vue

| Componente                              | Linhas | `client:` |
| --------------------------------------- | ------ | --------- |
| `hero/HeroSlider.vue`                   | 269    | `load`    |
| `faq/FaqSection.vue`                    | 113    | `load`    |
| `hero/HeroTextColumn.vue`               | 84     | —         |
| `legal/TermsOfUse.vue`                  | 60     | —         |
| `WhatsappButton.vue`                    | 56     | `load`    |
| `legal/LegalDrawer.vue`                 | 45     | `load`    |
| `legal/PrivacyPolicy.vue`               | 78     | —         |
| `hero/HeroSlideIndicator.vue`           | 19     | —         |

### `HeroSlider.vue`

O componente mais delicado do projeto. Trata do carrossel de slides, do swipe por Pointer Events e do arco com fotos. Ver [4.1](#41-hero--carrossel-de-2-slides-heroslidervue) e [10](#10-armadilhas-conhecidas).

### `HeroTextColumn.vue`

Coluna de texto do hero (logo mobile, `h1`, parágrafo, 2 CTAs + tracking de WhatsApp e scroll-para-formulário). Usada 2× — uma por slide. Classes mantidas verbatim, incluindo as variantes `max-lg:*`, porque o componente é usado tanto no contexto mobile empilhado quanto no desktop lado a lado.

### `FaqSection.vue`

5 perguntas usando `AccordionGroup` + `AccordionItem` do DS, com GSAP ScrollTrigger pinned: o scroll altera o item ativo. Perguntas: ART, impacto a moradores, relatórios de terceiros, prazo de orçamento, condições de pagamento.

### `WhatsappButton.vue`

Botão flutuante verde (canto inferior direito). Detecta a visibilidade do `BackToTop` para evitar sobreposição. Link `wa.me/551129248556` com mensagem pré-preenchida. Tracking GA no clique. Hidden abaixo de 640px (`src/styles/lp.css`).

### Componentes legais

- `LegalDrawer.vue` — `Drawer` do DS, hash routing
- `PrivacyPolicy.vue` / `TermsOfUse.vue` — conteúdo estático, 7 seções cada

---

## 6. Estilos

### `src/styles/global.css` (2 linhas)

```css
@import "tailwindcss";
@import 'ds-grupo-rkb/style.css';
```

### `src/styles/lp.css` (171 linhas)

| Bloco                                | Linhas | Função                                              |
| ------------------------------------ | ------ | --------------------------------------------------- |
| `body { overflow-x: clip }`          | 1–3    | Evita scroll horizontal **sem** criar scroll container |
| `:where([id]) { scroll-margin-top }` | 5–7    | Compensa o header fixo de 64px nos links internos   |
| `.hero-title`                        | 9–12   | `clamp(1.75rem, 7.6vw, 2.5rem)`                    |
| `.hero-copy`                         | 14–17  | Tamanho mobile-first                                |
| `.hero-content`                      | 19–21  | Gap do bloco de texto                               |
| `.hero-arch*` (7 regras)             | 23–74  | Arco com moldura e revelação vertical das fotos     |
| `@media (min-width: 64rem)`          | 82–91  | Ponto de quebra do `lg` do Tailwind                |
| `@media (max-width: 639px)`          | 93–97  | Esconde o botão flutuante do WhatsApp              |
| `.accordion-item ...`                | 99–105 | `cursor: pointer` nos triggers                     |
| `.dots`                              | 107    | Estilo de dots do DS                               |
| `.trust-icon`                        | 116    | Alinha o ícone do trust card                        |
| `.about-badges` (grid explicito)     | 122–150 | Grade da fileira de badges via media queries próprias (1/2/3/5 col), independente das utilities Tailwind da DS |
| `.about-badge` + `@keyframes badgeFloat` | 152–171 | Flutuação `translateY(-14px)` dos badges do Sobre; `animation: none` com reduced-motion |

O reveal do arco usa `data-reveal`: `slide` (400ms de delay, 1ª entrada) e `swap` (120ms, visitas seguintes), com `prefers-reduced-motion` zerando os delays.

---

## 7. Assets

| Caminho                                     | Conteúdo                                    |
| ------------------------------------------- | ------------------------------------------- |
| `public/assets/hero-slide/`                 | 12 `.webp` — **2 em uso**, 10 órfãos (1,1 MB) |
| `public/assets/decorative-underline.png`    | Sublinhado decorativo do h1                 |
| `public/assets/logo-camargo-gallo.png`      | Logo (166×232)                              |
| `public/about-image.png`                    | Imagem da seção Sobre (1201×718, 1,5 MB) — parallax GSAP |
| `public/favicon.ico` / `favicon.svg`        | Favicons                                    |
| `public/og-image.jpg`                       | Somente Open Graph (814 KB — maior asset) |
| `public/robots.txt`                         | `Disallow: /` — bloqueia **todos** os crawlers |
| `public/.htaccess`                          | `X-Robots-Tag: noindex, nofollow` + `Options -Indexes` |

As 2 fotos em uso no hero: `trat-patologias-revestimentos-ceramicos.webp` (32,8 KB) e `substituicao-de-revestimentos.webp` (33,6 KB), ambas `loading="lazy"` e definidas em `src/data/hero-fotos.ts`.

**Os 10 `.webp` restantes em `hero-slide/` não têm referência em lugar nenhum.** São ~1,1 MB, ou seja, cerca de 20% do `dist/` atual.

**Build atual**: `dist/` com 3,0 MB / 32 arquivos.

---

## 8. Configurações

### `astro.config.mjs`

```js
export default defineConfig({
  site: 'https://staging.camargogallo.com.br',
  integrations: [vue(), sitemap()],
  vite: { plugins: [tailwindcss()] },
});
```

Não há `base`. ⚠️ O deploy por FTP grava em `/public_html/lp-camargo-gallo/` (subpath), mas o config não declara `base` — os assets são gerados como `/assets/...`, não `/lp-camargo-gallo/assets/...`. Vale confirmar se o servidor serve a LP na raiz do domínio ou se falta declarar `base`.

### `tsconfig.json`

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

### Scripts

| Comando           | Ação                                        |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | Dev server em `localhost:4321`              |
| `npm run build`   | Build estático para `./dist/`               |
| `npm run preview` | Preview do build                            |

Para testar no celular na mesma rede:

```bash
npx astro dev --host          # imprime a URL de Network
npx astro dev --host --background
npx astro dev logs            # a Network URL vai para o log
```

O `--` é obrigatório com npm: `npm run dev -- --host`. Sem ele, o npm consome a flag e a rede nunca é exposta.

---

## 9. Deploy

Dois workflows, ambos via FTP (`SamKirkland/FTP-Deploy-Action@4.3.3`), destino `/public_html/lp-camargo-gallo/`:

| Workflow                 | Trigger         |
| ------------------------ | --------------- |
| `.github/workflows/deploy.yml`         | push em `main`    |
| `.github/workflows/deploy-staging.yml` | push em `staging` |

Passos idênticos: `actions/checkout@v4` → `actions/setup-node@v4` (Node 22, cache npm) → `npm ci` → `npm run build` → FTP upload de `./dist/`.

---

## 10. Armadilhas Conhecidas

Coisas que já custaram tempo nesta base. Todas verificadas em código.

### 10.1 `Carousel` do DS não tem `unregister`

```js
register: () => total.value++   // em node_modules/ds-grupo-rkb/dist/index.js
```

`total` **só incrementa**. **Nunca monte ou desmonte slides conforme o breakpoint** — a cada resize o `total` cresceria e nav/dots ficariam corrompidos. O gating tem que ser por CSS, em duas branches (`hidden lg:block` / `lg:hidden`), nunca condicional em JS.

### 10.2 O `Carousel` não tem suporte a touch

Não existe `touchstart`, `pointerdown`, `scroll-snap` nem autoplay no bundle do DS. É um transform puro. O swipe foi implementado com Pointer Events **via fallthrough de attrs** no `<Carousel>` — funciona porque o root dele é um único `div` sem `inheritAttrs: false`.

### 10.3 Chame `next()` / `prev()` / `goTo()`, nunca atribua `index`

O `setIndex` do DS emite `update:index` — é isso que dispara o tracking `lp_hero_slide`. Atribuir `index` pela prop atualiza o DS pelo watcher **sem emitir**, e o evento de analytics silenciosamente nunca dispara. Use o template `ref`.

### 10.4 `hidden` ordena DEPOIS de `lg:flex` no CSS

No bundle compilado:

```
@15611  .hidden{display:none}
@40310  @media (width>=64rem){ .lg\:flex{display:flex} }   ← do style.css do DS
```

A ordem no arquivo depende de qual stylesheet veio por último, então **nunca** confie em `hidden` + `lg:flex` para alternar. Prefira media queries **mutuamente exclusivas** (`max-lg:*` e `lg:*`), que nunca competem:

```html
<!-- invisível abaixo de lg, visível a partir de lg -->
<div class="max-lg:flex … lg:hidden">
<div class="max-lg:hidden">      <!-- sem regra de display acima de lg -->
```

### 10.5 Nunca remova `hidden` e `lg:flex` juntos

`lg:flex` pode ser a **única** regra de `display: flex` do elemento. Sem ela, o container cai para `display: block` do user agent e `flex-col`, `justify-center` e `gap-*` deixam de valer silenciosamente — sem erro de build, sem erro de console.

### 10.6 Números mágicos em markup

O array `servicos` já caiu de 14 para 11 itens dentro de um commit de `fix:` de CSS, e um `<Tag>` com literal "11 Serviços" e a frase "14 etapas" no subtítulo ficaram dessincronizados. O `<Tag>` hoje usa `{servicos.length}`. A mesma atenção vale para qualquer número no meio do texto.

### 10.7 Cuidado com o glob do PowerShell

`Select-String -Path "src\**\*.vue"` **não** é recursivo de forma confiável e produz falsos negativos. Use `Get-ChildItem -Recurse -Include *.vue,*.astro` pipeado no `Select-String`.

### 10.8 `Drawer` do DS emite warning de Vue

```
Extraneous non-props attributes (data-astro-cid-*) were passed to component
```

O `Drawer` renderiza fragment/teleport, então o Vue não injeta o atributo de scope. **Sem impacto visual** neste projeto: o único `<style>` scoped de `index.astro` é `.tag-amber`, usado num `<Tag>` normal. É ruído do DS.

---

## 11. Arquitetura e Padrões

### DS-first

Toda a UI vem do `ds-grupo-rkb`. A LP só fornece:
- Layout da página
- Copy/textos
- Assets
- Styling específico da marca (via `data-theme`)

O CSS do DS é pré-compilado e distribuído apenas como bundle + sourcemap — **não há fontes `.vue` para editar**. Para mudar o comportamento de um componente do DS, é preciso fazer no wrapper local ou pedir a mudança upstream.

### Astro + Vue híbrido

- **Estrutura**: componentes `.astro` (server-side, sem JS no cliente)
- **Interatividade**: componentes `.vue` com `client:load` ou `client:visible`
- **Dados**: consts no frontmatter, ou `src/data/*.ts` quando compartilhados

Os componentes do hero são Vue, não Astro, porque o carrossel precisa de estado reativo. Vale notar que `HeroSlider` é uma island separada — o estado de `index` não é acessível de fora.

### Animações

Animações JS (GSAP ScrollTrigger) em **dois** lugares: FAQ (item ativo por scroll) e seção Sobre (parallax da imagem `about-image.png`). As animações de reveal do site são CSS puro (`transition` + `Reveal` do DS). A flutuação dos 5 badges da seção Sobre é **CSS** (`@keyframes badgeFloat`, `lp.css`), sem JS — desliga com `prefers-reduced-motion`. As remoções de 2026-09 eliminaram as animações pesadas: animação orbital com 199 frames, antes/depois com scroll pinned, scroll horizontal de trust cards e galeria infinita de obras.

### Single-Page Architecture

- Única rota: `/`
- Hash routing para os drawers legais (`#privacy`, `#terms`)
- IDs de seção para scroll interno: `#servicos`, `#faq`, `#contato`, `#titulo-orcamento`

### Multi-Tema

Suporte via `body[data-theme="..."]`, permitindo que o mesmo DS sirva diferentes marcas do grupo.

---

*Atualizado em: 28/09/2026*
