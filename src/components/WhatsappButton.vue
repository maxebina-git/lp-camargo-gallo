<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

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
    :aria-label="ariaLabel"
    :class="[
      'group fixed bottom-8 z-50 bg-[#25D366] text-white rounded-full shadow-xl p-4 hover:bg-[#128C7E] transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366] cursor-pointer flex items-center justify-center',
      isBackToTopVisible ? 'right-16' : 'right-8'
    ]"
  >
    <span class="inline-block transition-transform duration-300 group-hover:scale-110">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.198.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"
        />
      </svg>
    </span>
  </a>
</template>