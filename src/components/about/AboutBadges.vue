<script setup>
import { computed } from 'vue'
import { FeatureCard } from 'ds-grupo-rkb'
import { aboutBadges } from '../../data/about-badges'

const dur = ['5.5s', '6.4s', '4.8s', '7s', '5.9s']
const delay = ['-1.2s', '-3.4s', '-2.1s', '-0.4s', '-4.6s']

const props = defineProps({
  items: {
    type: Array,
    default: () => aboutBadges,
  },
  // bare: renderiza SO os cards, sem o clip e a grade. Usado na pagina
  // /empresa, onde os 9 cards (5 + 4 diferenciais) vivem em uma unica grade
  // fornecida pelo chamador — com os wrappers internos cada AboutBadges abriria
  // a sua propria grade e as larguras divergiriam.
  bare: {
    type: Boolean,
    default: false,
  },
  // clones: a duplicata existe so para o marquee do mobile (ver lp.css). Na
  // /empresa a grade e unica e o corte e por GSAP, entao a duplicata atrapalha.
  clones: {
    type: Boolean,
    default: true,
  },
})

// A fileira e renderizada DUAS vezes: a segunda copia existe so para o marquee
// do mobile poder fechar o ciclo (ver lp.css). Sem ela sobra um vao vazio a
// esquerda no fim do trajeto. A copia fica aria-hidden, some a partir de 640px
// e repete o par duration/delay do original, entao os gemeos flutuam em fase.
// O indice i vai em data-badge-index para o GSAP escalar o desenho do icone
// pelo card e nao pela posicao na lista (sao 10 icones, nao 5).
const items = computed(() => [
  ...props.items.map((b, i) => ({ b, i, clone: false })),
  ...(props.clones ? props.items.map((b, i) => ({ b, i, clone: true })) : []),
])

const cardClass = 'about-badge w-full !p-2 [&>div]:flex-1 [&>div]:justify-center [&_[role=separator]]:mx-auto'
const floatStyle = (i) => `animation-duration:${dur[i]};animation-delay:${delay[i]}`
</script>

<template>
  <div class="about-badges-clip">
    <div class="about-badges">
      <FeatureCard
        v-for="{ b, i, clone } in items"
        :key="`${b.titulo}-${clone}`"
        tone="deep"
        divider="3/4"
        :class="[cardClass, clone && 'about-badge--clone']"
        :style="floatStyle(i)"
        :data-badge-index="i"
        :aria-hidden="clone ? 'true' : undefined"
      >
        <template #title>
          <div class="flex flex-col items-center gap-2">
            <span class="about-badge__icon">
              <component :is="b.icone" :size="36" />
            </span>
          </div>
        </template>
        <template #description>
          <span class="text-sm font-bold leading-tight text-on-deep">{{ b.titulo }}</span>
        </template>
      </FeatureCard>
    </div>
  </div>
</template>

<style scoped>
  .about-badge :deep(.about-badge__icon) {
    color: var(--color-on-deep);
  }

  .about-badge:hover :deep(.about-badge__icon) {
    color: var(--color-surface-brand);
  }

  .about-badge :deep(.font-body) {
    color: var(--color-on-deep);
  }
</style>