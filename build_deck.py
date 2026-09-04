with open(r'C:\Users\maxeb\Projetos\lp-camargo-gallo\src\pages\index.astro', 'r', encoding='utf-8') as f:
    content = f.read()
start = content.find('<section id="obras"')
end = content.find('</section>', start)
if start != -1 and end != -1:
    old = content[start:end+10]
    new = '''<section id="obras" tone="surface" size="lg" class="py-16">
    <Container>
      <div class="flex flex-col items-center text-center gap-4 mb-10">
        <Heading as="h2" size="2xl">Nossas Obras em Execução</Heading>
        <Text size="lg" tone="secondary">Equipes especializadas em campo, excelência em cada detalhe</Text>
      </div>

      <div id="galeria-wrapper" style="position:relative; overflow:hidden; width:100%; height:70vh; background:var(--color-deep);">
        <div id="galeria-track" style="position:absolute; top:0; left:0; width:100%; height:100%; display:flex; align-items:center; gap:0;">
          <img src="/lp-camargo-gallo/assets/obras/obra-01.jpg" alt="Obra 01" class="obra-card" style="width:360px; height:360px; object-fit:cover; border-radius:var(--radius-lg); box-shadow:0 4px 16px rgba(0,0,0,0.25); flex-shrink:0;" />
          <img src="/lp-camargo-gallo/assets/obras/obra-02.png" alt="Obra 02" class="obra-card" style="width:360px; height:360px; object-fit:cover; border-radius:var(--radius-lg); box-shadow:0 4px 16px rgba(0,0,0,0.25); flex-shrink:0;" />
          <img src="/lp-camargo-gallo/assets/obras/obra-03.png" alt="Obra 03" class="obra-card" style="width:360px; height:360px; object-fit:cover; border-radius:var(--radius-lg); box-shadow:0 4px 16px rgba(0,0,0,0.25); flex-shrink:0;" />
          <img src="/lp-camargo-gallo/assets/obras/obra-04.png" alt="Obra 04" class="obra-card" style="width:360px; height:360px; object-fit:cover; border-radius:var(--radius-lg); box-shadow:0 4px 16px rgba(0,0,0,0.25); flex-shrink:0;" />
          <img src="/lp-camargo-gallo/assets/obras/obra-05.png" alt="Obra 05" class="obra-card" style="width:360px; height:360px; object-fit:cover; border-radius:var(--radius-lg); box-shadow:0 4px 16px rgba(0,0,0,0.25); flex-shrink:0;" />
          <img src="/lp-camargo-gallo/assets/obras/obra-06.png" alt="Obra 06" class="obra-card" style="width:360px; height:360px; object-fit:cover; border-radius:var(--radius-lg); box-shadow:0 4px 16px rgba(0,0,0,0.25); flex-shrink:0;" />
          <img src="/lp-camargo-gallo/assets/obras/obra-07.png" alt="Obra 07" class="obra-card" style="width:360px; height:360px; object-fit:cover; border-radius:var(--radius-lg); box-shadow:0 4px 16px rgba(0,0,0,0.25); flex-shrink:0;" />
          <img src="/lp-camargo-gallo/assets/obras/obra-08.png" alt="Obra 08" class="obra-card" style="width:360px; height:360px; object-fit:cover; border-radius:var(--radius-lg); box-shadow:0 4px 16px rgba(0,0,0,0.25); flex-shrink:0;" />
          <img src="/lp-camargo-gallo/assets/obras/obra-09.png" alt="Obra 09" class="obra-card" style="width:360px; height:360px; object-fit:cover; border-radius:var(--radius-lg); box-shadow:0 4px 16px rgba(0,0,0,0.25); flex-shrink:0;" />
          <img src="/lp-camargo-gallo/assets/obras/obra-10.png" alt="Obra 10" class="obra-card" style="width:360px; height:360px; object-fit:cover; border-radius:var(--radius-lg); box-shadow:0 4px 16px rgba(0,0,0,0.25); flex-shrink:0;" />
          <img src="/lp-camargo-gallo/assets/obras/obra-11.png" alt="Obra 11" class="obra-card" style="width:360px; height:360px; object-fit:cover; border-radius:var(--radius-lg); box-shadow:0 4px 16px rgba(0,0,0,0.25); flex-shrink:0;" />
        </div>
      </div>
      <script>
        (function() {
          if (typeof window === 'undefined' || !window.gsap || !window.ScrollTrigger) return;
          const track = document.getElementById('galeria-track');
          const wrapper = document.getElementById('galeria-wrapper');
          if (!track || !wrapper) return;
          window.gsap.registerPlugin(window.ScrollTrigger);
          window.gsap.to(track, {
            x: () => -(track.scrollWidth - wrapper.offsetWidth) + 100,
            ease: 'none',
            scrollTrigger: {
              trigger: '#galeria-wrapper',
              start: 'top top',
              end: '+=3000',
              scrub: 1,
              pin: true,
              anticipatePin: 1,
            }
          });
        })();
      </script>
    </Container>
  </section>'''
    content = content.replace(old, new)
    with open(r'C:\Users\maxeb\Projetos\lp-camargo-gallo\src\pages\index.astro', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Deck inserido')
else:
    print('Nível não encontrado')
