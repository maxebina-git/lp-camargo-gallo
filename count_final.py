with open(r'C:\Users\maxeb\Projetos\lp-camargo-gallo\src\pages\index.astro', 'r', encoding='utf-8') as f:
    content = f.read()
print('Seções obras:', content.count('<section id="obras"'))
print('Trust-cards-desktop:', content.count('trust-cards-desktop'))
print('FeatureCard total:', content.count('<FeatureCard'))
