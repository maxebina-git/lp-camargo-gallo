with open(r'C:\Users\maxeb\Projetos\lp-camargo-gallo\src\pages\index.astro', 'r', encoding='utf-8') as f:
    content = f.read()

# Reverter loop para original
content = content.replace(
    "{servicos.map((s, i) => (\n          i === 0 ? (\n            <FeatureCard tone=\"deep\" class=\"w-full\">\n              <h3 slot=\"title\" class=\"font-display text-xl font-bold text-center\">Engenharia de Fachadas</h3>\n              <div slot=\"description\" class=\"font-body text-sm leading-normal text-on-deep/80 text-center\">Especialistas em grandes intervenções em condomínios habitados.</div>\n            </FeatureCard>\n          ) : (",
    "{servicos.map((s) => ("
)

# Insert FeatureCard at position of "Tratamento de Áreas com Som Cavo por Injeção" inside the loop by replacing that orbit-card block
# We need to find the specific orbit-card that contains that text and replace it
old_item = '''          <div class="orbit-card bg-deep text-on-deep border-on-deep/20 rounded-lg border p-8">
            <h2 class="orbit-card-title">Tratamento de Áreas com Som Cavo por Injeção</h2>
            <div role="separator" aria-hidden="true" class="h-2 w-3/4 rounded-full bg-primary-500 my-4 mx-auto"></div>
            <div class="orbit-card-desc">Recuperação de regiões com perda de aderência através de injeção de materiais específicos, restabelecendo a aderência sem remoção integral do revestimento.</div>
          </div>'''
new_item = '''          <FeatureCard tone="deep" class="w-full"><h3 slot="title" class="font-display text-xl font-bold text-center">Engenharia de Fachadas</h3><div slot="description" class="font-body text-sm leading-normal text-on-deep/80 text-center">Especialistas em grandes intervenções em condomínios habitados.</div></FeatureCard>'''

content = content.replace(old_item, new_item)

with open(r'C:\Users\maxeb\Projetos\lp-camargo-gallo\src\pages\index.astro', 'w', encoding='utf-8') as f:
    f.write(content)
print('Movido: 1º orbit-card restaurado, FeatureCard inserido no lugar de "Tratamento de Áreas com Som Cavo por Injeção"')
