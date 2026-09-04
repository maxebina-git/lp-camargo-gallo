with open(r'C:\Users\maxeb\Projetos\lp-camargo-gallo\src\pages\index.astro', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace('FeatureCard tone="deep" class="w-full w-[360px]"', 'FeatureCard tone="deep" class="w-full card-360"')
with open(r'C:\Users\maxeb\Projetos\lp-camargo-gallo\src\pages\index.astro', 'w', encoding='utf-8') as f:
    f.write(content)
print('ok')
