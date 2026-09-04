with open(r'C:\Users\maxeb\Projetos\lp-camargo-gallo\src\pages\index.astro', 'r', encoding='utf-8') as f:
    content = f.read()

start = content.find('<section id="trust-cards-desktop"')
# Encontrar o fechamento </section> correspondente ao trust-cards-desktop
# A seção termina em </section> antes de <div class="bg-surface-alt...>
end = content.find('</section>', start)
if start != -1 and end != -1:
    block = content[start:end+10]
    content = content[:start] + content[end+10:]
    # Inserir antes de <section id="antes-e-depois"
    insert_pos = content.find('<section id="antes-e-depois"')
    if insert_pos != -1:
        content = content[:insert_pos] + block + '\n' + content[insert_pos:]
with open(r'C:\Users\maxeb\Projetos\lp-camargo-gallo\src\pages\index.astro', 'w', encoding='utf-8') as f:
    f.write(content)
print('Movido trust-cards-desktop para antes de antes-e-depois')
