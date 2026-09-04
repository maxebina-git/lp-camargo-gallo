with open(r'C:\Users\maxeb\Projetos\lp-camargo-gallo\src\pages\index.astro', 'r', encoding='utf-8') as f:
    lines = f.read().splitlines()

# Encontrar linhas entre grid (117) e Section (aproximadamente 145-190 dependendo de edições anteriores)
# Vamos fazer de forma simples: nos 11 FeatureCards acima da section, inserir separador após </h3>
# Como os cards são compactos, vou substituir a primeira ocorrência de </h3> de cada FeatureCard no bloco
# Mas é complexo. Vou fazer uma substituição direta: após cada </h3> no bloco antes da section, adicionar separador.
# Primeiro, encontrar o índice da primeira linha do bloco (grid)
start_idx = None
end_idx = None
for i, line in enumerate(lines):
    if 'grid grid-cols-1 md:grid-cols-4' in line:
        start_idx = i
    if start_idx is not None and 'Section id="trust-cards-desktop"' in line:
        end_idx = i
        break

if start_idx and end_idx:
    for i in range(start_idx, end_idx):
        if '</h3>' in lines[i] and 'slot="title"' in lines[i-1] if i>0 else False:
            # Inserir separador após esta linha
            sep = '    <div role="separator" aria-hidden="true" class="h-2 w-3/4 rounded-full bg-primary-500 my-4 mx-auto"></div>'
            lines.insert(i+1, sep)
            # Ajustar índices porque inserimos
            end_idx += 1

with open(r'C:\Users\maxeb\Projetos\lp-camargo-gallo\src\pages\index.astro', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))
print('Separadores inseridos')
