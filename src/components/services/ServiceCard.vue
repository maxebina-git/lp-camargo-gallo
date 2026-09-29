<script setup lang="ts">
import { ChevronRight } from '@lucide/vue'

export interface Servico {
  titulo: string
  imagem: string
  href: string
}

defineProps<Servico>()
</script>

<template>
  <a
    :href="href"
    class="group relative block overflow-hidden rounded-xl shadow-lg transition-transform duration-300 ease-out hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100"
  >
    <img
      :src="imagem"
      :alt="titulo"
      class="h-[400px] w-[300px] object-cover transition-transform duration-300 ease-out group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
    />
    <div class="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/70"></div>
    <div class="absolute inset-x-0 top-0 p-5">
      <h3 class="font-display text-xl font-bold text-white">{{ titulo }}</h3>
    </div>
    <div class="absolute inset-x-0 bottom-0 p-5">
      <span
        class="group/cta inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-white/40 bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-colors duration-200 hover:bg-white/25! [container-type:inline-size]"
      >
        <span class="transition-transform duration-200 ease-out group-hover/cta:-translate-x-[7.5cqw]">Saiba Mais</span>
        <ChevronRight class="h-4 w-4 transition-transform duration-200 ease-out group-hover/cta:translate-x-[7.5cqw]" aria-hidden="true" />
      </span>
    </div>
  </a>
</template>
