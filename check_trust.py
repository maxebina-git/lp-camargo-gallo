with open(r'C:\Users\maxeb\Projetos\lp-camargo-gallo\src\pages\index.astro', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f, 1):
        if 'trust-cards' in line or ('FeatureCard' in line and 'trust-card' in line):
            print(i, line[:60].strip())
