export interface PortfolioObra {
  titulo: string
  imagem: string
  resumo: string
  local?: string
  ano?: string
}

export const portfolio: PortfolioObra[] = [
  {
    titulo: 'Recuperação de Fachadas — Condomínio Solar',
    imagem: '/assets/hero-slide/trat-patologias-revestimentos-ceramicos.webp',
    resumo:
      'Tratamento de patologias em revestimentos cerâmicos com pintura e textura acrílica, elimina eflorescência e garante uniformidade na fachada.',
    local: 'São Paulo, SP',
    ano: '2024',
  },
  {
    titulo: 'Conversão de Fachadas Cerâmicas para Texturizadas',
    imagem: '/assets/hero-slide/substituicao-de-revestimentos.webp',
    resumo:
      'Substituição de revestimentos degradados por sistema texturizado de longa durabilidade, com preparo adequado do substrato.',
    local: 'Campinas, SP',
    ano: '2024',
  },
  {
    titulo: 'Impermeabilização de Lajes e Reservatórios',
    imagem: '/assets/hero-slide/BKQWmuKTS8_HJe2p.webp',
    resumo:
      'Aplicação de sistema de impermeabilização com mapeamento de trincas e recalibragem de caimentos em lajes e reservatórios.',
    local: 'Guarulhos, SP',
    ano: '2023',
  },
  {
    titulo: 'Recuperação Estrutural de Concreto Armado',
    imagem: '/assets/hero-slide/trat-patologias-revestimentos-ceramicos.webp',
    resumo:
      'Reforço e recuperação de elementos estruturais com diagnóstico prévio, seguindo os limites normativos da NR-35.',
    local: 'Barueri, SP',
    ano: '2023',
  },
  {
    titulo: 'Tratamento de Áreas com Som Cavo por Injeção',
    imagem: '/assets/hero-slide/substituicao-de-revestimentos.webp',
    resumo:
      'Injeção de materiais de preenchimento em sílios com cavidade, recuperando a estanqueidade sem quebra de chapéu.',
    local: 'Osasco, SP',
    ano: '2022',
  },
  {
    titulo: 'Sobreposição de Fachadas Cerâmicas com Textura Acrílica',
    imagem: '/assets/hero-slide/BKQWmuKTS8_HJe2p.webp',
    resumo:
      'Sobreposição de revestimento cerâmico com textura acrílica dispensando a remoção total, reduzindo prazo e custo de obra.',
    local: 'Santo André, SP',
    ano: '2022',
  },
]
