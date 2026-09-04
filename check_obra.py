with open(r'C:\Users\maxeb\Projetos\lp-camargo-gallo\src\pages\index.astro', 'r', encoding='utf-8') as f:
    content = f.read()
count = content.count('<section id="obras"')
print('Seções obras:', count)
for i, line in enumerate(content.splitlines(), 1):
    if '<section id="obras"' in line:
        print('Linha', i, ':', line[:90])
