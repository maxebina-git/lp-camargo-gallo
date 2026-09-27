<script setup lang="ts">
import { ref } from 'vue'
import {
  Button,
  Container,
  Heading,
  Text,
  Section,
  FeatureCard,
  Carousel,
  CarouselSlide,
} from 'ds-grupo-rkb'
import { diferenciais } from '../../data/diferenciais'

const WA = 'https://wa.me/551129248556?text=Ol%C3%A1%20gostaria%20de%20saber%20mais%20sobre%20recupera%C3%A7%C3%A3o%20de%20fachadas'

const index = ref(0)

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

function trackSlide() {
  ;(window as unknown as Globals).gtag?.('event', 'lp_hero_slide', {
    event_category: 'navegacao',
    event_label: `v${index.value + 1}`,
  })
}

const slideClass =
  'flex min-h-[100svh] max-lg:pt-20 max-lg:pb-10 sm:max-lg:pt-24 sm:max-lg:pb-12 lg:h-[100dvh] lg:min-h-[100dvh]'
</script>

<template>
  <Section
    tone="surface-alt"
    size="none"
    class="relative z-0 overflow-x-clip bg-[radial-gradient(ellipse_at_top,_#e6e7ef_0%,_#cccce0_100%)]"
  >
    <Carousel
      v-model:index="index"
      class="w-full"
      nav-position="top-right"
      nav-class="top-20! right-4 hidden lg:flex"
      aria-label="Variações do destaque"
      @update:index="trackSlide"
    >
      <CarouselSlide :class="slideClass">
        <Container size="lg" class="flex w-full flex-1 flex-row py-0 max-lg:flex-col">
          <div
            class="order-2 flex w-8/12 flex-none flex-col items-center justify-center px-4 text-center lg:h-full max-lg:order-1 max-lg:w-full max-lg:flex-1 max-lg:px-0"
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
          <div
            class="order-1 hidden w-4/12 flex-col items-center justify-center gap-6 px-4 lg:order-1 lg:flex"
          >
            <img
              src="/assets/logo-camargo-gallo.png"
              alt="Camargo Gallo"
              width="166"
              height="232"
              class="h-auto w-[166px]"
              fetchpriority="high"
              decoding="async"
            />
            <Heading as="2" size="xl" class="max-w-[360px] text-center text-ink">
              Confiança que se mede
            </Heading>
            <div class="grid w-full max-w-[360px] grid-cols-2 gap-3">
              <FeatureCard
                v-for="d in diferenciais"
                :key="d.titulo"
                tone="deep"
                class="!p-3 text-center [&>div]:flex-1 [&>div]:justify-between"
              >
                <template #title>
                  <div class="flex flex-col items-center gap-2">
                    <span class="trust-icon text-[var(--color-divider)]">
                      <component :is="d.icone" :size="26" />
                    </span>
                    <h3 class="text-sm font-bold leading-tight text-on-deep">{{ d.titulo }}</h3>
                  </div>
                </template>
                <template #description>
                  <div class="text-xs leading-snug">{{ d.texto }}</div>
                </template>
              </FeatureCard>
            </div>
          </div>
        </Container>
      </CarouselSlide>

      <CarouselSlide :class="slideClass">
        <Container size="lg" class="flex w-full flex-1 flex-row py-0 max-lg:flex-col">
          <div
            class="order-2 flex w-8/12 flex-none flex-col items-center justify-center px-4 text-center lg:h-full max-lg:order-1 max-lg:w-full max-lg:flex-1 max-lg:px-0"
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
          <div
            class="order-1 hidden w-4/12 flex-col items-center justify-center gap-6 px-4 lg:order-1 lg:flex"
          >
            <img
              src="/assets/logo-camargo-gallo.png"
              alt="Camargo Gallo"
              width="166"
              height="232"
              class="h-auto w-[166px]"
              fetchpriority="high"
              decoding="async"
            />
            <div class="hero-arch max-w-[360px]">
              <img
                class="hero-arch-media"
                :class="{ 'is-in': index === 1 }"
                src="/assets/trat-patologias-revestimentos-ceramicos.webp"
                alt="Exemplo de tratamento de patologias em revestimentos cerâmicos"
                width="224"
                height="352"
                decoding="async"
              />
            </div>
          </div>
        </Container>
      </CarouselSlide>
    </Carousel>
  </Section>
</template>
