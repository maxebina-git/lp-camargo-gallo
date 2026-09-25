<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { BrandIcon } from 'ds-grupo-rkb'

withDefaults(
  defineProps<{
    ariaLabel?: string
  }>(),
  {
    ariaLabel: 'Falar no WhatsApp',
  },
)

const isBackToTopVisible = ref(false)

const phoneNumber = '551129248556'
const message = 'Ol%C3%A1%20gostaria%20de%20saber%20mais%20sobre%20recupera%C3%A7%C3%A3o%20de%20fachadas'
const href = `https://wa.me/${phoneNumber}?text=${message}`

function checkBackToTopVisibility() {
  const backToTopBtn = document.querySelector('[aria-label="Voltar ao topo"]')
  if (backToTopBtn) {
    const styles = window.getComputedStyle(backToTopBtn as HTMLElement)
    isBackToTopVisible.value = styles.opacity !== '0' && styles.pointerEvents !== 'none'
  }
}

function handleScroll() {
  checkBackToTopVisibility()
}

onMounted(() => {
  checkBackToTopVisibility()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <a
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    onclick="gtag('event', 'lp_whatsapp_click', { 'event_category': 'contato', 'event_label': 'whatsapp_lp' });"
    :aria-label="ariaLabel"
    :class="[
      'whatsapp-floating group fixed bottom-8 z-50 bg-[#25D366] text-white rounded-full shadow-xl p-4 hover:bg-[#128C7E] transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366] cursor-pointer flex items-center justify-center',
      isBackToTopVisible ? 'right-24' : 'right-8'
    ]"
  >
    <BrandIcon name="whatsapp" class="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
  </a>
</template>