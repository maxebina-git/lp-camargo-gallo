with open(r'C:\Users\maxeb\Projetos\lp-camargo-gallo\src\pages\index.astro', 'r', encoding='utf-8') as f:
    content = f.read()
start = content.find('<section id="obras" tone="surface" size="lg" class="py-16">')
end = content.find('</section>', start)
if start != -1 and end != -1:
    content = content[:start] + content[end+10:]
with open(r'C:\Users\maxeb\Projetos\lp-camargo-gallo\src\pages\index.astro', 'w', encoding='utf-8') as f:
    f.write(content)
print('Removido')
