<script setup>
import { FeatureCard } from 'ds-grupo-rkb'
import { aboutBadges } from '../../data/about-badges'

const dur = ['5.5s', '6.4s', '4.8s', '7s', '5.9s']
const delay = ['-1.2s', '-3.4s', '-2.1s', '-0.4s', '-4.6s']
</script>

<template>
  <div class="about-badges">
    <FeatureCard
      v-for="(b, i) in aboutBadges"
      :key="b.titulo"
      tone="surface-alt"
      divider="3/4"
      :class="`about-badge w-full !p-2 [&>div]:flex-1 [&>div]:justify-center [&_[role=separator]]:mx-auto`"
      :style="`animation-duration:${dur[i]};animation-delay:${delay[i]}`"
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
</template>