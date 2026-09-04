with open(r'C:\Users\maxeb\Projetos\lp-camargo-gallo\src\pages\index.astro', 'r', encoding='utf-8') as f:
    lines = f.read().splitlines()
for i in range(len(lines)):
    if 'faq' in lines[i].lower() and ('section' in lines[i].lower() or 'Section' in lines[i]):
        print(i+1, lines[i])
