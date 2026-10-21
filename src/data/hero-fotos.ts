import { assetUrl } from '../lib/paths'

export interface HeroFoto {
  src: string
  alt: string
  legenda: string
  href: string
}

const heroFotosBase: HeroFoto[] = [
  {
    src: '/assets/hero-slide/trat-patologias-revestimentos-ceramicos.webp',
    alt: 'Exemplo de tratamento de patologias em revestimentos cerâmicos',
    legenda: 'Tratamento de patologias em revestimentos cerâmicos',
    href: '#servicos',
  },
  {
    src: '/assets/hero-slide/substituicao-de-revestimentos.webp',
    alt: 'Vista aérea de edifício residencial com substituição de revestimento',
    legenda: 'Substituição de revestimentos',
    href: '#servicos',
  },
]

/* As fotos do hero vivem sob a raiz do site; no staging precisam do
   prefixo do deploy para nao cair na copia de producao. */
export const heroFotos: HeroFoto[] = heroFotosBase.map((foto) => ({
  ...foto,
  src: assetUrl(foto.src),
}))
