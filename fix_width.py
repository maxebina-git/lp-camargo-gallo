with open(r'C:\Users\maxeb\Projetos\lp-camargo-gallo\src\pages\index.astro', 'r', encoding='utf-8') as f:
    lines = f.read().splitlines()

for i in range(len(lines)):
    if i >= 116 and i <= 144:  # lines 117-145 (0-indexed 116-144)
        if 'FeatureCard tone="deep" class="w-full"' in lines[i]:
            lines[i] = lines[i].replace('class="w-full"', 'class="w-full w-[360px]"')

with open(r'C:\Users\maxeb\Projetos\lp-camargo-gallo\src\pages\index.astro', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))
print('Atualizado 117-145')
