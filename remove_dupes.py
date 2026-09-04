with open(r'C:\Users\maxeb\Projetos\lp-camargo-gallo\src\pages\index.astro', 'r', encoding='utf-8') as f:
    content = f.read()
# Encontrar a seção trust-cards-desktop e remover até antes do faq (já corrigido antes)
start = content.find('<section id="trust-cards-desktop"')
if start != -1:
    # Encontrar o próximo </section> após o início
    end = content.find('</section>', start)
    if end != -1:
        # Incluir o fechamento da tag
        content = content[:start] + content[end+10:]
with open(r'C:\Users\maxeb\Projetos\lp-camargo-gallo\src\pages\index.astro', 'w', encoding='utf-8') as f:
    f.write(content)
print('Seção trust-cards-desktop removida (sem animação duplicada)')
