<script setup lang="ts">
defineProps<{ atual: number; total: number }>()
const emit = defineEmits<{ irPara: [indice: number] }>()
</script>

<template>
  <div class="max-lg:order-2 mt-5 flex w-full items-center justify-center gap-2 lg:hidden">
    <button
      v-for="n in total"
      :key="n"
      type="button"
      class="h-1.5 rounded-full transition-all duration-300"
      :class="atual === n - 1 ? 'w-8 bg-primary-500' : 'w-4 bg-border'"
      :aria-label="`Ir para o slide ${n}`"
      :aria-current="atual === n - 1 ? 'true' : undefined"
      @click="emit('irPara', n - 1)"
    />
  </div>
</template>
