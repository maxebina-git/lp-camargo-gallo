<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  Button,
  Container,
  Heading,
  Section,
  FeatureCard,
  Carousel,
  CarouselSlide,
} from 'ds-grupo-rkb'
import { ChevronLeft, ChevronRight, Plus } from '@lucide/vue'
import { diferenciais } from '../../data/diferenciais'
import { heroFotos } from '../../data/hero-fotos'
import HeroTextColumn from './HeroTextColumn.vue'
import HeroSlideIndicator from './HeroSlideIndicator.vue'

const index = ref(0)
const fotosIndex = ref(0)

const TOTAL_SLIDES = 2

const carrossel = ref<{ next(): void; prev(): void; goTo(indice: number): void } | null>(null)

const LIMIAR_SWIPE = 45
const FOLGA_EIXO = 8
const MARGEM_EDGE = 24

type Gesto = { id: number; x0: number; y0: number; dx: number; dy: number; ativo: boolean }

const gesto = ref<Gesto | null>(null)
let suprimirClick = false

function onPointerDown(e: PointerEvent) {
  suprimirClick = false
  if (!e.isPrimary || e.pointerType === 'mouse') return
  const alvo = e.target as HTMLElement | null
  if (alvo?.closest('a, button, input, select, textarea, [role="button"]')) return
  if (e.clientX <= MARGEM_EDGE || e.clientX >= window.innerWidth - MARGEM_EDGE) return
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  gesto.value = { id: e.pointerId, x0: e.clientX, y0: e.clientY, dx: 0, dy: 0, ativo: false }
}

function onPointerMove(e: PointerEvent) {
  const g = gesto.value
  if (!g || g.id !== e.pointerId) return
  g.dx = e.clientX - g.x0
  g.dy = e.clientY - g.y0
  if (g.ativo) return
  if (Math.abs(g.dx) < FOLGA_EIXO && Math.abs(g.dy) < FOLGA_EIXO) return
  if (Math.abs(g.dy) > Math.abs(g.dx)) {
    gesto.value = null
    return
  }
  g.ativo = true
}

function onPointerUp(e: PointerEvent) {
  const g = gesto.value
  gesto.value = null
  if (!g || g.id !== e.pointerId || !g.ativo) return
  if (Math.abs(g.dx) < LIMIAR_SWIPE) return
  suprimirClick = true
  if (g.dx < 0) carrossel.value?.next()
  else carrossel.value?.prev()
}

function onPointerCancel() {
  gesto.value = null
}

function onClick(e: MouseEvent) {
  if (!suprimirClick) return
  suprimirClick = false
  e.preventDefault()
  e.stopPropagation()
}

function irParaSlide(indice: number) {
  carrossel.value?.goTo(indice)
}

const temVariasFotos = computed(() => heroFotos.length > 1)
const fotoAtiva = computed(() => heroFotos[fotosIndex.value] ?? heroFotos[0])
const v2JaEntrou = ref(false)

watch(index, (valor) => {
  if (valor === 1 && !v2JaEntrou.value) setTimeout(() => (v2JaEntrou.value = true), 700)
})

function fotoAnterior() {
  fotosIndex.value = (fotosIndex.value - 1 + heroFotos.length) % heroFotos.length
}

function fotoProxima() {
  fotosIndex.value = (fotosIndex.value + 1) % heroFotos.length
}

type Globals = {
  gtag?: (...args: unknown[]) => void
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
      ref="carrossel"
      v-model:index="index"
      class="w-full touch-pan-y"
      nav-position="top-right"
      nav-class="top-20! right-4"
      aria-label="Variações do destaque"
      @update:index="trackSlide"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerCancel"
      @click="onClick"
    >
      <CarouselSlide :class="slideClass">
        <Container size="lg" class="flex w-full flex-1 flex-row py-0 max-lg:flex-col">
          <HeroTextColumn />
          <HeroSlideIndicator
            :atual="index"
            :total="TOTAL_SLIDES"
            @ir-para="irParaSlide"
          />
          <div
            class="order-1 max-lg:order-3 flex w-4/12 max-lg:w-full flex-col items-center justify-center gap-12 px-4"
          >
            <img
              src="/assets/logo-camargo-gallo.png"
              alt="Camargo Gallo"
              width="166"
              height="232"
              class="hidden h-auto w-[120px] lg:block"
              fetchpriority="high"
              decoding="async"
            />
            <div class="flex w-full max-w-[360px] flex-col items-center gap-4">
              <Heading as="2" size="xl" class="w-full text-center text-ink">
                Confiança que se mede
              </Heading>
              <div class="grid w-full grid-cols-2 gap-3">
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
          </div>
        </Container>
      </CarouselSlide>

      <CarouselSlide :class="slideClass">
        <Container size="lg" class="flex w-full flex-1 flex-row py-0 max-lg:flex-col">
          <HeroTextColumn />
          <HeroSlideIndicator
            :atual="index"
            :total="TOTAL_SLIDES"
            @ir-para="irParaSlide"
          />
          <div
            class="order-1 max-lg:order-3 max-lg:mt-8 flex w-4/12 max-lg:w-full flex-col items-center justify-center gap-8 px-4"
          >
            <img
              src="/assets/logo-camargo-gallo.png"
              alt="Camargo Gallo"
              width="166"
              height="232"
              class="hidden h-auto w-[120px] lg:block"
              fetchpriority="high"
              decoding="async"
            />
            <div class="w-full max-w-[360px]">
              <Heading as="2" size="xl" class="mb-4 w-full text-center text-ink">
                Serviços
              </Heading>
              <div class="hero-arch-slide">
                <div class="hero-arch" aria-hidden="true"></div>
                <div class="hero-arch-slot" :data-reveal="v2JaEntrou ? 'swap' : 'slide'">
                  <img
                    v-for="(foto, i) in heroFotos"
                    :key="foto.src"
                    class="hero-arch-media"
                    :class="{ 'is-in': index === 1 && fotosIndex === i }"
                    :aria-hidden="!(index === 1 && fotosIndex === i)"
                    :src="foto.src"
                    :alt="foto.alt"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>

              <div class="mt-3 flex items-center justify-between gap-3">
                <a
                  :href="fotoAtiva.href"
                  class="font-body text-xs font-bold uppercase leading-tight tracking-wide text-deep hover:underline"
                >
                  {{ fotoAtiva.legenda }}
                </a>
                <div class="flex shrink-0 gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    iconOnly
                    aria-label="Foto anterior"
                    :disabled="!temVariasFotos"
                    @click="fotoAnterior"
                  >
                    <ChevronLeft class="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    iconOnly
                    aria-label="Próxima foto"
                    :disabled="!temVariasFotos"
                    @click="fotoProxima"
                  >
                    <ChevronRight class="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>

              <a
                href="#servicos"
                class="mt-3 flex items-center justify-center gap-1.5 font-body text-xs font-bold uppercase leading-tight tracking-wide text-deep hover:underline"
              >
                <Plus class="h-4 w-4" aria-hidden="true" />
                Serviços
              </a>
            </div>
          </div>
        </Container>
      </CarouselSlide>
    </Carousel>
  </Section>
</template>

