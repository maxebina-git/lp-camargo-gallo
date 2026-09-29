<script setup lang="ts">
import { Button, Heading, Text } from 'ds-grupo-rkb'

const WA = 'https://wa.me/551129248556?text=Ol%C3%A1%20gostaria%20de%20saber%20mais%20sobre%20recupera%C3%A7%C3%A3o%20de%20fachadas'

type Globals = {
  gtag?: (...args: unknown[]) => void
  animarScroll?: () => void
}

function trackWhatsapp() {
  ;(window as unknown as Globals).gtag?.('event', 'lp_whatsapp_click', {
    event_category: 'contato',
    event_label: 'whatsapp_lp',
  })
}

function trackScrollToForm() {
  ;(window as unknown as Globals).gtag?.('event', 'lp_scroll_to_form', {
    event_category: 'navegacao',
    event_label: 'cta_formulario',
  })
  ;(window as unknown as Globals).animarScroll?.()
}
</script>

<template>
  <div
    class="order-2 flex w-8/12 flex-none flex-col items-center justify-center px-4 text-center lg:h-full max-lg:order-1 max-lg:w-full max-lg:px-0"
  >
    <div class="hero-content flex w-full flex-col items-center">
      <img
        src="/assets/logo-camargo-gallo.png"
        alt="Camargo Gallo"
        width="166"
        height="232"
        class="h-auto w-14 sm:w-16 lg:hidden max-[359px]:hidden"
        fetchpriority="high"
        decoding="async"
      />
      <div class="flex w-full flex-col items-center">
        <Heading as="1" size="display" class="hero-title text-center text-ink">
          Engenharia, Estrutura e Tecnologia para
          <span class="inline-block max-w-full font-extrabold text-deep">
            Grandes Intervenções em Fachadas
            <img
              src="/assets/decorative-underline.png"
              alt=""
              aria-hidden="true"
              class="-mt-1 block w-full max-w-full"
            />
          </span>
        </Heading>
      </div>
      <Text as="p" size="lg" tone="default" class="hero-copy max-w-2xl">
        Especialistas em grandes intervenções em condomínios habitados. Unimos eficiência,
        segurança e mínimo impacto na rotina dos moradores para entregar soluções tecnicamente
        precisas e duráveis.
      </Text>
      <div class="flex w-full flex-row justify-center gap-3 max-sm:flex-col">
        <Button
          as="a"
          :href="WA"
          target="_blank"
          rel="noopener noreferrer"
          variant="primary"
          size="lg"
          class="w-auto font-body max-sm:w-full"
          @click="trackWhatsapp"
        >
          Solicitar Vistoria Técnica
        </Button>
        <Button
          variant="secondary"
          size="lg"
          class="w-auto font-body max-sm:w-full"
          @click="trackScrollToForm"
        >
          Escrever Mensagem
        </Button>
      </div>
    </div>
  </div>
</template>
