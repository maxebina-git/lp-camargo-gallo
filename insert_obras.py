with open(r'C:\Users\maxeb\Projetos\lp-camargo-gallo\src\pages\index.astro', 'r', encoding='utf-8') as f:
    content = f.read()
old = '<section id="faq" class="bg-surface text-ink py-16">'
new = '<section id="obras" tone="surface" size="lg" class="py-16"><Container class="text-center"><Heading as="h2" size="2xl">Nossas Obras em Execução</Heading><Text size="lg" tone="secondary">Equipes especializadas em campo, excelência em cada detalhe</Text></Container></section>\n  <section id="faq" class="bg-surface text-ink py-16">'
if old in content:
    content = content.replace(old, new, 1)
    with open(r'C:\Users\maxeb\Projetos\lp-camargo-gallo\src\pages\index.astro', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Seção adicionada antes do FAQ')
else:
    print('Não encontrou seção FAQ')
