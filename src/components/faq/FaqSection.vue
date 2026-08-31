<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { AccordionGroup, AccordionItem, Heading, Text, Section, Container } from 'ds-grupo-rkb'

const groupRef = ref<InstanceType<typeof AccordionGroup> | null>(null)
const ids = ['faq-0', 'faq-1', 'faq-2', 'faq-3', 'faq-4']

let tl: gsap.core.Timeline | null = null
let mm: gsap.MatchMedia | null = null

function seekTo(idx: number) {
  if (!tl) return
  const st = (tl as unknown as { scrollTrigger: { start: number; end: number } }).scrollTrigger
  if (!st) return
  const p = idx / (ids.length - 1)
  const y = st.start + p * (st.end - st.start)
  window.scrollTo(0, y)
}

function handleSelect(_id: string, idx: number) {
  seekTo(idx)
}

onMounted(() => {
  if (typeof window === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const g = (window as unknown as { gsap?: typeof gsap }).gsap
  const ST = (window as unknown as { ScrollTrigger?: typeof ScrollTrigger }).ScrollTrigger
  if (!g || !ST) return
  g.registerPlugin(ST)

  const section = document.getElementById('faq')
  if (!section) return
  const groupEl = groupRef.value as unknown as { setActive: (id: string) => void } | null
  if (!groupEl) return

  const set = (p: number) => {
    const idx = Math.min(ids.length - 1, Math.max(0, Math.round(p * (ids.length - 1))))
    groupEl.setActive(ids[idx])
  }

  mm = g.matchMedia()

  const create = (end: string) => {
    tl?.scrollTrigger?.kill()
    tl?.kill()
    tl = g.timeline({
      scrollTrigger: {
        trigger: '#faq',
        start: 'top top',
        end,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        onUpdate: (self: { progress: number }) => set(self.progress),
      } as unknown as ScrollTrigger,
    })
    tl.to({}, { duration: 1 })
    const st = (tl as unknown as { scrollTrigger: { progress: number } }).scrollTrigger
    set(st.progress ?? 0)
    return () => {
      tl?.scrollTrigger?.kill()
      tl?.kill()
      tl = null
    }
  }

  mm.add('(min-width: 768px)', () => create('+=250%'))
  mm.add('(max-width: 767px)', () => create('+=180%'))
})

onBeforeUnmount(() => {
  try {
    mm?.revert()
    tl?.scrollTrigger?.kill()
    tl?.kill()
  } catch {}
  tl = null
  mm = null
})
</script>

<template>
  <Section tone="surface" size="none" id="faq" class="py-16">
    <Container>
      <div class="max-w-3xl mx-auto">
        <div class="flex flex-col items-center text-center gap-4 mb-10">
          <Heading as="2" size="2xl">Dúvidas Frequentes</Heading>
          <Text tone="secondary">Tire suas dúvidas sobre nossos serviços e processos</Text>
        </div>
        <AccordionGroup ref="groupRef" :default-index="0">
          <AccordionItem item-id="faq-0" title="A Camargo Gallo emite ART (Anotação de Responsabilidade Técnica)?" @select="handleSelect('faq-0', 0)">
            Sim. Todos os nossos serviços são acompanhados por engenheiros e arquitetos habilitados, com emissão de ART e responsabilidade técnica aplicável conforme as normas do CREA-SP. Nossa equipe conta com 10 profissionais especializados em Patologia das Construções.
          </AccordionItem>
          <AccordionItem item-id="faq-1" title="A obra interfere na rotina dos moradores?" @select="handleSelect('faq-1', 1)">
            Nosso foco é realizar grandes intervenções com o mínimo impacto na rotina dos moradores. Utilizamos proteções coletivas adequadas (telas fachadeiras, bandejas suspensas), equipamentos de baixo ruído quando possível, e planejamos os acessos e horários de trabalho para preservar a convivência no condomínio. Temos +200 colaboradores treinados em Segurança do Trabalho e normas NR aplicáveis.
          </AccordionItem>
          <AccordionItem item-id="faq-2" title="Vocês trabalham com laudos técnicos de terceiros?" @select="handleSelect('faq-2', 2)">
            Sim. Atuamos tanto em obras fundamentadas em laudos, projetos e especificações elaborados por consultores e profissionais contratados pelo condomínio, quanto em demandas que chegam diretamente à nossa equipe. Em cada situação, analisamos tecnicamente o escopo, as condições de execução e as particularidades da edificação para desenvolver planejamento, metodologia e orçamento adequados.
          </AccordionItem>
          <AccordionItem item-id="faq-3" title="Qual o prazo para recebimento do orçamento?" @select="handleSelect('faq-3', 3)">
            Após a vistoria técnica no condomínio, nossa equipe de engenharia analisa o escopo e as particularidades da edificação para desenvolver um orçamento detalhado e adequado à intervenção. O prazo de retorno varia conforme a complexidade da obra, mas buscamos ser ágeis sem comprometer a precisão técnica da proposta.
          </AccordionItem>
          <AccordionItem item-id="faq-4" title="Vocês oferecem condições de pagamento facilitadas?" @select="handleSelect('faq-4', 4)">
            Sim. Oferecemos condições comerciais diferenciadas e parcelamento direto com a Camargo Gallo Engenharia. Nosso objetivo é facilitar o acesso a intervenções de alta qualidade técnica, permitindo que o condomínio planeje a recuperação da fachada de forma adequada ao seu orçamento.
          </AccordionItem>
        </AccordionGroup>
      </div>
    </Container>
  </Section>
</template>
