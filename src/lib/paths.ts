// Caminhos do front relativos ao deploy.
//
// O front e buildado com o `base` do Astro: '/lp-camargo-gallo/' em
// producao e '/staging/' no ambiente de testes. Sem isso, os assets
// (_astro/*), os links internos e as chamadas de API apontariam para a
// raiz do dominio e cairiam na versao errada.
//
//   producao: siteBase = '/lp-camargo-gallo'  apiBase = '/api'
//   staging : siteBase = '/staging'          apiBase = '/staging/api'
//
// A API nao fica no mesmo prefixo do front: em producao ela vive na raiz do
// dominio (/api) e no staging sob o prefixo do deploy (/staging/api). Por
// isso ela vem de PUBLIC_API_BASE, e nao de siteBase.
const rawBase = import.meta.env.BASE_URL || '/';

export const siteBase = rawBase.replace(/\/+$/, '');
export const apiBase = (import.meta.env.PUBLIC_API_BASE || siteBase + '/api').replace(/\/+$/, '');

// Prefixa um caminho interno (/assets/...) com o base do deploy.
// URLs absolutas (http/https) e caminhos relativos ficam intactos.
// E idempotente: se o path ja vier prefixado, nao duplica o prefixo.
export function withBase(path: string | null | undefined): string {
  if (!path) return '';
  const value = String(path);
  if (/^(https?:)?\/\//i.test(value)) return value;
  if (value.charAt(0) !== '/') return value;
  if (siteBase && value.startsWith(siteBase + '/')) return value;
  return siteBase + value;
}

// Prefixa um caminho de imagem (/assets/uploads/...) com o base do deploy.
export function assetUrl(path: string | null | undefined): string {
  return withBase(path);
}

// Prefixa um link interno de pagina (/portfolio) com o base do deploy.
export function linkUrl(path: string | null | undefined): string {
  return withBase(path);
}
