export interface SiteContact {
  label: string
  href: string
  icon: string
}

export interface SiteLink {
  label: string
  href: string
}

export interface NavLink {
  label: string
  href: string
  parentLink?: boolean
  dropdown?: NavLink[]
}

export type SurfaceToken = 'surface' | 'surface-alt' | 'deep' | 'brand' | 'warm'

export type Surface = SurfaceToken | (string & {})

export const surfaceColors: Record<SurfaceToken, string> = {
  surface: 'var(--color-surface)',
  'surface-alt': 'var(--color-surface-alt)',
  deep: 'var(--color-deep)',
  brand: 'var(--color-surface-brand)',
  warm: 'var(--color-surface-warm)',
}

export const surfaceColor = (surface: Surface): string =>
  surfaceColors[surface as SurfaceToken] ?? String(surface)

export interface FooterCompany {
  companyName: string
  cnpj: string
  address: string
  contacts: SiteContact[]
  legalLinks: SiteLink[]
}

export const footerCompany: FooterCompany = {
  companyName: 'CAMARGO GALLO ENGENHARIA LTDA',
  cnpj: '23.741.090/0001-77',
  address: 'Rua Maria Jose Rangel, 159 - Vila São Paulo, São Paulo/SP - CEP 04650-180',
  contacts: [
    { label: '(11) 2924-8556', href: 'tel:+551129248556', icon: 'phone' },
    {
      label: 'WhatsApp',
      href: 'https://wa.me/551129248556?text=Olá, gostaria de saber mais sobre recuperação de fachadas',
      icon: 'whatsapp',
    },
  ],
  legalLinks: [
    { label: 'Política de Privacidade', href: '#privacy' },
    { label: 'Termos de Uso', href: '#terms' },
  ],
}

export const headerNavHome: NavLink[] = [
  { label: 'EMPRESA', href: '/empresa' },
  { label: 'SERVIÇOS', href: '/servicos' },
  {
    label: 'ESTUDOS DE CASO',
    href: '/estudos-de-caso',
    parentLink: true,
    dropdown: [
      { label: 'Revitalização de fachadas e áreas comuns', href: '/estudos-de-caso/revitalizacao-de-fachadas' },
      { label: 'Retrofit de fachadas e áreas comuns', href: '/estudos-de-caso/retrofit-de-fachadas' },
      { label: 'Pintura de fachadas e áreas comuns', href: '/estudos-de-caso/pintura-de-fachadas' },
      { label: 'Impermeabilização de lajes de cobertura', href: '/estudos-de-caso/impermeabilizacao-de-lajes' },
    ],
  },
  { label: 'SEGURANÇA', href: '/seguranca' },
  { label: 'PORTFÓLIO', href: '/portfolio' },
  { label: 'CONTATO', href: '/contato' },
]

export const headerNavSite: NavLink[] = [
  { label: 'EMPRESA', href: '/empresa' },
  { label: 'SERVIÇOS', href: '/servicos' },
  {
    label: 'ESTUDOS DE CASO',
    href: '/estudos-de-caso',
    parentLink: true,
    dropdown: [
      { label: 'Revitalização de fachadas e áreas comuns', href: '/estudos-de-caso/revitalizacao-de-fachadas' },
      { label: 'Retrofit de fachadas e áreas comuns', href: '/estudos-de-caso/retrofit-de-fachadas' },
      { label: 'Pintura de fachadas e áreas comuns', href: '/estudos-de-caso/pintura-de-fachadas' },
      { label: 'Impermeabilização de lajes de cobertura', href: '/estudos-de-caso/impermeabilizacao-de-lajes' },
    ],
  },
  { label: 'SEGURANÇA', href: '/seguranca' },
  { label: 'PORTFÓLIO', href: '/portfolio' },
  { label: 'CONTATO', href: '/contato' },
]

export const bannerProps = {
  bannerImage: '/assets/logo-camargo-gallo.png',
  bannerImageAlt: 'Logo Camargo Gallo',
  bannerTitle: 'Pronto para começar?',
  bannerDescription: 'Recuperação e impermeabilização de fachadas com retorno em até 24h.',
  companyDescription: 'Recuperação de fachadas, impermeabilização e engenharia diagnóstica em São Paulo.',
  copyright: '© 2026 Camargo Gallo Engenharia. Todos os direitos reservados.',
  size: 'lg' as const,
  padding: 'md' as const,
}

export const whatsappHref =
  'https://wa.me/551129248556?text=Olá, gostaria de saber mais sobre recuperação de fachadas'
