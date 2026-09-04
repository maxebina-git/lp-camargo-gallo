with open(r'C:\Users\maxeb\Projetos\lp-camargo-gallo\src\pages\index.astro', 'r', encoding='utf-8') as f:
    content = f.read()
start = content.find('<div class="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">')
end_marker = '<Section id="trust-cards-desktop"'
end = content.find(end_marker, start)
if start != -1 and end != -1:
    content = content[:start] + content[end:]
with open(r'C:\Users\maxeb\Projetos\lp-camargo-gallo\src\pages\index.astro', 'w', encoding='utf-8') as f:
    f.write(content)
print('Removido grid de 11 cards acima da section')
