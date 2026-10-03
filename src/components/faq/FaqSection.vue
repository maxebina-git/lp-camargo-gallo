<script setup lang="ts">
import { AccordionGroup, AccordionItem, Heading, Text, Section, Container } from 'ds-grupo-rkb'
</script>

<template>
  <Section tone="surface-alt" size="none" id="faq" class="h-[100dvh] flex flex-col justify-center">
    <Container>
      <div class="max-w-3xl mx-auto">
        <div class="flex flex-col items-center text-center gap-4 mb-10">
          <Heading as="2" size="2xl">Dúvidas Frequentes</Heading>
          <Text tone="secondary">Tire suas dúvidas sobre nossos serviços e processos</Text>
        </div>
        <AccordionGroup :default-index="0">
          <AccordionItem item-id="faq-0" title="A Camargo Gallo emite ART (Anotação de Responsabilidade Técnica)?">
            Sim. Todos os nossos serviços são acompanhados por engenheiros e arquitetos habilitados, com emissão de ART e responsabilidade técnica aplicável conforme as normas do CREA-SP. Nossa equipe conta com 10 profissionais especializados em Patologia das Construções.
          </AccordionItem>
          <AccordionItem item-id="faq-1" title="A obra interfere na rotina dos moradores?">
            Nosso foco é realizar grandes intervenções com o mínimo impacto na rotina dos moradores. Utilizamos proteções coletivas adequadas (telas fachadeiras, bandejas suspensas), equipamentos de baixo ruído quando possível, e planejamos os acessos e horários de trabalho para preservar a convivência no condomínio. Temos +200 colaboradores treinados em Segurança do Trabalho e normas NR aplicáveis.
          </AccordionItem>
          <AccordionItem item-id="faq-2" title="Vocês trabalham com laudos técnicos de terceiros?">
            Sim. Atuamos tanto em obras fundamentadas em laudos, projetos e especificações elaborados por consultores e profissionais contratados pelo condomínio, quanto em demandas que chegam diretamente à nossa equipe. Em cada situação, analisamos tecnicamente o escopo, as condições de execução e as particularidades da edificação para desenvolver planejamento, metodologia e orçamento adequados.
          </AccordionItem>
          <AccordionItem item-id="faq-3" title="Qual o prazo para recebimento do orçamento?">
            Após a vistoria técnica no condomínio, nossa equipe de engenharia analisa o escopo e as particularidades da edificação para desenvolver um orçamento detalhado e adequado à intervenção. O prazo de retorno varia conforme a complexidade da obra, mas buscamos ser ágeis sem comprometer a precisão técnica da proposta.
          </AccordionItem>
          <AccordionItem item-id="faq-4" title="Vocês oferecem condições de pagamento facilitadas?">
            Sim. Oferecemos condições comerciais diferenciadas e parcelamento direto com a Camargo Gallo Engenharia. Nosso objetivo é facilitar o acesso a intervenções de alta qualidade técnica, permitindo que o condomínio planeje a recuperação da fachada de forma adequada ao seu orçamento.
          </AccordionItem>
        </AccordionGroup>
      </div>
    </Container>
  </Section>
</template>
