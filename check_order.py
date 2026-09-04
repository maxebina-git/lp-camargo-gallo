with open(r'C:\Users\maxeb\Projetos\lp-camargo-gallo\src\pages\index.astro', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f, 1):
        if 'FaqSection' in line or 'antes-e-depois' in line:
            print(i, line[:60].strip())
