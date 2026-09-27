export interface HeroFoto {
  src: string
  alt: string
  legenda: string
  href: string
}

export const heroFotos: HeroFoto[] = [
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
