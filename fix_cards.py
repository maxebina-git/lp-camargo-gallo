with open(r'C:\Users\maxeb\Projetos\lp-camargo-gallo\src\pages\index.astro', 'r', encoding='utf-8') as f:
    lines = f.read().splitlines()

start = None
end = None
for i, line in enumerate(lines):
    if 'grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto px-4' in line:
        start = i
    if start is not None and 'Section id="trust-cards-desktop"' in line:
        end = i
        break

new_block = '''  <div class="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
    <FeatureCard tone="deep" class="w-full"><h3 slot="title" class="font-display text-2xl font-bold text-center">Recuperação de Fachadas com Pintura ou Textura Acrílica</h3><p slot="description" class="text-on-deep/80 text-center">Tratamento de fissuras, trincas e falhas de aderência com fundos preparadores, membranas de proteção e acabamento em pintura ou textura acrílica de alto desempenho.</p></FeatureCard>
    <FeatureCard tone="deep" class="w-full"><h3 slot="title" class="font-display text-2xl font-bold text-center">Recuperação Total de Fachadas com Revestimento Cerâmico</h3><p slot="description" class="text-on-deep/80 text-center">Remoção integral do revestimento existente, recuperação da base e execução de novo sistema cerâmico com juntas de movimentação e detalhes técnicos completos.</p></FeatureCard>
    <FeatureCard tone="deep" class="w-full"><h3 slot="title" class="font-display text-2xl font-bold text-center">Conversão de Fachadas Cerâmicas para Texturizadas</h3><p slot="description" class="text-on-deep/80 text-center">Remoção completa da cerâmica, tratamento da base e execução de novo sistema com textura acrílica, proporcionando renovação estética e redução de cargas.</p></FeatureCard>
    <FeatureCard tone="deep" class="w-full"><h3 slot="title" class="font-display text-2xl font-bold text-center">Restauração Localizada de Fachadas Cerâmicas</h3><p slot="description" class="text-on-deep/80 text-center">Recuperação de trechos com desprendimentos ou perda de aderência, buscando compatibilidade técnica e estética com o revestimento existente.</p></FeatureCard>
    <FeatureCard tone="deep" class="w-full"><h3 slot="title" class="font-display text-2xl font-bold text-center">Sobreposição de Fachadas Cerâmicas com Textura Acrílica</h3><p slot="description" class="text-on-deep/80 text-center">Preparação do revestimento existente e execução de novo sistema argamassado com acabamento texturizado, quando as condições técnicas permitem a sobreposição.</p></FeatureCard>
    <FeatureCard tone="deep" class="w-full"><h3 slot="title" class="font-display text-2xl font-bold text-center">Recuperação de Fachadas em Concreto Aparente</h3><p slot="description" class="text-on-deep/80 text-center">Tratamento de fissuras, corrosão de armaduras e recomposição do concreto com sistemas de proteção que preservam as características arquitetônicas originais.</p></FeatureCard>
    <FeatureCard tone="deep" class="w-full"><h3 slot="title" class="font-display text-2xl font-bold text-center">Recuperação de Fachadas em Tijolos Aparentes</h3><p slot="description" class="text-on-deep/80 text-center">Tratamento de fissuras, juntas e falhas de assentamento com limpeza e recuperação localizada. Proteção final com hidrofugantes ou resinas acrílicas.</p></FeatureCard>
    <FeatureCard tone="deep" class="w-full"><h3 slot="title" class="font-display text-2xl font-bold text-center">Recuperação de Revestimentos Minerais e Monocapa</h3><p slot="description" class="text-on-deep/80 text-center">Recuperação de fissuras e falhas com revestimentos compatíveis com o sistema original. Aplicação de hidrofugante para reduzir absorção de água sem pintura.</p></FeatureCard>
    <FeatureCard tone="deep" class="w-full"><h3 slot="title" class="font-display text-2xl font-bold text-center">Tratamento de Áreas com Som Cavo por Injeção</h3><p slot="description" class="text-on-deep/80 text-center">Recuperação de regiões com perda de aderência através de injeção de materiais específicos, restabelecendo a aderência sem remoção integral do revestimento.</p></FeatureCard>
    <FeatureCard tone="deep" class="w-full"><h3 slot="title" class="font-display text-2xl font-bold text-center">Recuperação Estrutural de Concreto Armado</h3><p slot="description" class="text-on-deep/80 text-center">Tratamento de armaduras corroídas, recomposição de seções de concreto e aplicação de argamassas estruturais, grout e sistemas de reparo e reforço.</p></FeatureCard>
    <FeatureCard tone="deep" class="w-full"><h3 slot="title" class="font-display text-2xl font-bold text-center">Impermeabilização de Lajes e Reservatórios</h3><p slot="description" class="text-on-deep/80 text-center">Remoção de sistemas existentes, preparação da base, correção de caimentos e execução de novos sistemas de impermeabilização com testes de estanqueidade.</p></FeatureCard>
  </div>'''

if start is not None and end is not None:
    lines = lines[:start] + [new_block] + lines[end:]
    with open(r'C:\Users\maxeb\Projetos\lp-camargo-gallo\src\pages\index.astro', 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    print('Substituido com sucesso')
else:
    print('Nao encontrou')
