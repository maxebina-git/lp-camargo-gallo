<script setup>
import { computed } from 'vue'
import { FeatureCard } from 'ds-grupo-rkb'
import { aboutBadges } from '../../data/about-badges'

const dur = ['5.5s', '6.4s', '4.8s', '7s', '5.9s']
const delay = ['-1.2s', '-3.4s', '-2.1s', '-0.4s', '-4.6s']

// A fileira e renderizada DUAS vezes: a segunda copia existe so para o marquee
// do mobile poder fechar o ciclo (ver lp.css). Sem ela sobra um vao vazio a
// esquerda no fim do trajeto. A copia fica aria-hidden, some a partir de 640px
// e repete o par duration/delay do original, entao os gemeos flutuam em fase.
// O indice i vai em data-badge-index para o GSAP escalar o desenho do icone
// pelo card e nao pela posicao na lista (sao 10 icones, nao 5).
const items = computed(() => [
  ...aboutBadges.map((b, i) => ({ b, i, clone: false })),
  ...aboutBadges.map((b, i) => ({ b, i, clone: true })),
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
        tone="surface-alt"
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
          <span class="text-sm font-bold leading-tight text-ink">{{ b.titulo }}</span>
        </template>
      </FeatureCard>
    </div>
  </div>
</template>