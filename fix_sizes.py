with open(r'C:\Users\maxeb\Projetos\lp-camargo-gallo\src\pages\index.astro', 'r', encoding='utf-8') as f:
    content = f.read()

# Ajustar tamanhos nos 11 FeatureCards acima da section (antes de Section id="trust-cards-desktop")
# Vamos dividir pelo marker
parts = content.split('<Section id="trust-cards-desktop"')
if len(parts) == 2:
    top = parts[0]
    # Ajustar títulos: text-2xl -> text-xl nos h3 do bloco (apenas antes da section)
    top = top.replace('font-display text-2xl font-bold text-center', 'font-display text-xl font-bold text-center', 11)
    # Ajustar descrições: text-base -> text-sm
    top = top.replace('class="text-on-deep/80 text-center">', 'class="text-on-deep/80 text-center text-sm">', 11)
    content = top + '<Section id="trust-cards-desktop"' + parts[1]

with open(r'C:\Users\maxeb\Projetos\lp-camargo-gallo\src\pages\index.astro', 'w', encoding='utf-8') as f:
    f.write(content)
print('Tamanhos ajustados nos 11 cards')
