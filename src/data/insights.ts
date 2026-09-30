export interface Insight {
  slug: string;
  titulo: string;
  resumo: string;
  data: string;
  categoria: 'Técnica' | 'Normas' | 'Cases' | 'Prevenção';
  conteudo: string;
  imagem: string;
}

export const insights: Insight[] = [
  {
    slug: 'importancia-da-norma-nr35',
    titulo: 'A Importância da Norma NR-35 na Manutenção de Fachadas',
    resumo: 'Entenda como a conformidade com a NR-35 garante a segurança dos trabalhadores e a tranquilidade do condomínio.',
    data: '2026-09-15',
    categoria: 'Normas',
    conteudo: 'A NR-35 é a norma regulamentadora que estabelece os requisitos mínimos e as medidas de proteção para o trabalho em altura... [conteúdo completo simulado]',
    imagem: 'https://placehold.co/600x400?text=Norma+NR-35'
  },
  {
    slug: 'patologias-comuns-em-fachadas',
    titulo: 'As Patologias Mais Comuns em Fachadas Prediais',
    resumo: 'Identifique sinais de alerta como fissuras, descolamentos e infiltrações antes que se tornem problemas graves.',
    data: '2026-09-10',
    categoria: 'Técnica',
    conteudo: 'A identificação precoce de patologias é a chave para a economia em reformas. Fissuras e desplacamentos costumam indicar problemas estruturais ou de materiais... [conteúdo completo simulado]',
    imagem: 'https://placehold.co/600x400?text=Patologias+Fachadas'
  },
  {
    slug: 'recuperacao-estrutural-vs-estetica',
    titulo: 'Recuperação Estrutural vs. Pintura Estética',
    resumo: 'Por que pintar a fachada sem tratar a estrutura é um erro comum e perigoso em condomínios.',
    data: '2026-09-05',
    categoria: 'Técnica',
    conteudo: 'Muitos síndicos optam pela pintura apenas para "renovar" o prédio, mas sem a recuperação estrutural, a pintura nova poderá descascar em pouco tempo... [conteúdo completo simulado]',
    imagem: 'https://placehold.co/600x400?text=Recuperacao+Estrutural'
  },
  {
    slug: 'impermeabilizacao-de-lajes',
    titulo: 'Guia de Impermeabilização de Lajes de Cobertura',
    resumo: 'Soluções modernas para evitar infiltrações e garantir a estanqueidade total da cobertura do edifício.',
    data: '2026-08-28',
    categoria: 'Prevenção',
    conteudo: 'A impermeabilização correta é a única barreira contra as infiltrações que comprometem a laje e as unidades do último andar... [conteúdo completo simulado]',
    imagem: 'https://placehold.co/600x400?text=Impermeabilizacao'
  },
  {
    slug: 'retrofit-de-fachadas-modernizacao',
    titulo: 'Retrofit de Fachadas: Modernização e Valorização do Patrimônio',
    resumo: 'Como a modernização da fachada pode aumentar significativamente o valor de mercado de um edifício antigo.',
    data: '2026-08-20',
    categoria: 'Cases',
    conteudo: 'O retrofit vai além da estética; ele envolve a atualização de materiais e sistemas para melhorar a eficiência térmica e visual... [conteúdo completo simulado]',
    imagem: 'https://placehold.co/600x400?text=Retrofit+Fachadas'
  },
  {
    slug: 'manutencao-preventiva-periodica',
    titulo: 'O Plano de Manutenção Preventiva Periódica',
    resumo: 'Como evitar reformas emergenciais caras através de um cronograma rigoroso de inspeções e reparos.',
    data: '2026-08-12',
    categoria: 'Prevenção',
    conteudo: 'A manutenção preventiva é a melhor forma de gerir o orçamento de um condomínio, evitando surpresas desagradáveis... [conteúdo completo simulado]',
    imagem: 'https://placehold.co/600x400?text=Manutencao+Preventiva'
  },
  {
    slug: 'estudo-de-caso-recuperacao-sp',
    titulo: 'Case: Recuperação de Fachada em Edifício de 20 Andares em SP',
    resumo: 'Análise técnica de um projeto complexo de recuperação estrutural com foco em segurança e agilidade.',
    data: '2026-08-05',
    categoria: 'Cases',
    conteudo: 'Neste projeto, enfrentamos desafios de acesso e intempéries, utilizando técnicas avançadas de ancoragem e projeção de concreto... [conteúdo completo simulado]',
    imagem: 'https://placehold.co/600x400?text=Case+Recuperacao+SP'
  },
  {
    slug: 'estanqueidade-de-janelas',
    titulo: 'Problemas de Estanqueidade em Janelas e Esquadrias',
    resumo: 'Soluções para eliminar infiltrações nas janelas sem a necessidade de trocar todo o sistema de esquadrias.',
    data: '2026-07-28',
    categoria: 'Técnica',
    conteudo: 'Muitas vezes, a infiltração não está na parede, mas na vedação entre a esquadria e a alvenaria... [conteúdo completo simulado]',
    imagem: 'https://placehold.co/600x400?text=Estanqueidade+Janelas'
  },
  {
    slug: 'pintura-premium-durabilidade',
    titulo: 'A Diferença entre Pinturas Comuns e Pinturas Premium',
    resumo: 'Por que investir em tintas de alta performance reduz a frequência de reformas a longo prazo.',
    data: '2026-07-20',
    categoria: 'Técnica',
    conteudo: 'Tintas premium possuem maior resistência a raios UV e poluição, mantendo a cor e a proteção por muito mais tempo... [conteúdo completo simulado]',
    imagem: 'https://placehold.co/600x400?text=Pintura+Premium'
  },
  {
    slug: 'importancia-da-inspecao-predial',
    titulo: 'Laudo de Inspeção Predial: O Primeiro Passo para a Segurança',
    resumo: 'Entenda por que o laudo técnico é indispensável antes de qualquer intervenção em fachadas.',
    data: '2026-07-12',
    categoria: 'Normas',
    conteudo: 'A inspeção predial é como um check-up médico do edifício. Sem ela, qualquer obra corre o risco de ignorar a causa raiz do problema... [conteúdo completo simulado]',
    imagem: 'https://placehold.co/600x400?text=Inspecao+Predial'
  },
  {
    slug: 'combate-ao-descolamento-cerâmico',
    titulo: 'Como Combater o Descolamento de Pastilhas e Cerâmicas',
    resumo: 'Técnicas de teste de percussão e a importância da correta argamassa de colagem.',
    data: '2026-07-05',
    categoria: 'Técnica',
    conteudo: 'O descolamento cerâmico é um risco grave para pedestres. O teste de percussão identifica áreas ocas que precisam de intervenção imediata... [conteúdo completo simulado]',
    imagem: 'https://placehold.co/600x400?text=Descolamento+Ceramico'
  }
];
