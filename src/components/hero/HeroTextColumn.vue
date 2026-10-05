<script setup lang="ts">
import { onUnmounted, ref, useId, watch } from 'vue'
import { Button, Heading, Text } from 'ds-grupo-rkb'

const props = withDefaults(defineProps<{ ativo?: boolean }>(), { ativo: true })

const maskId = `hero-underline-${useId()}`
const desenhado = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

watch(
  () => props.ativo,
  (ativo) => {
    if (timer !== undefined) clearTimeout(timer)
    if (!ativo || desenhado.value || typeof window === 'undefined') return
    timer = setTimeout(() => {
      desenhado.value = true
    }, 400)
  },
  { immediate: true },
)

onUnmounted(() => {
  if (timer !== undefined) clearTimeout(timer)
})

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
            <svg
              class="hero-underline -mt-1 block w-full max-w-full"
              :class="{ 'is-drawn': desenhado }"
              viewBox="0 0 651.4 18.1"
              aria-hidden="true"
              focusable="false"
            >
              <defs>
                <mask
                  :id="maskId"
                  maskUnits="userSpaceOnUse"
                  x="-16"
                  y="-9"
                  width="684"
                  height="36"
                >
                  <path
                    class="hero-underline-s1"
                    d="M0 11L16 10.5L32 9.5L48 9.5L64 8.5L80 8L96 8L112 7L128 7L144 6L160 6L176 5L192 5L208 4.5L224 4L240 3.5L256 3.5L272 3L288 3L304 4L320 3L336 3L352 3L368 2.5L384 2.5L400 2L416 2L432 2L448 1.5L464 1.5L480 1.5L496 1.5L512 2L528 2L544 2.5L560 2.5L576 3L592 3.5L608 4L624 4.5L640 4.5L644 5L648 7"
                    fill="none"
                    stroke="#fff"
                    stroke-width="16"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    class="hero-underline-s2"
                    d="M356 11.5L354 8L344 7L336 7.5L320 7.5L304 8L288 8.5L272 9.5L256 11.5L240 13L236 13"
                    fill="none"
                    stroke="#fff"
                    stroke-width="14"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    class="hero-underline-s3"
                    d="M262 16L300 15.5L342 15.5"
                    fill="none"
                    stroke="#fff"
                    stroke-width="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </mask>
              </defs>
              <path
                :mask="`url(#${maskId})`"
                fill="#3C405D"
                d="M1.07049 11.4064C0.773326 11.4215 0.493596 11.5529 0.292895 11.773C0.0921937 11.993 -0.0130469 12.2835 0.000334501 12.5807C0.013716 12.878 0.144635 13.1578 0.3643 13.3589C0.583965 13.5601 0.874374 13.6659 1.17169 13.6541C1.17169 13.6541 1.17169 13.6541 1.17169 13.6541C23.3829 12.8099 45.6779 12.0899 67.869 11.4178C261.443 5.93099 455.189 2.80746 648.509 9.52627C652.104 9.66062 652.328 3.66865 648.733 3.5343C641.466 3.26146 634.319 3.00695 627.288 2.77012C497.367 -1.10428 367.072 -3.23122 237.837 12.683C235.021 13.0242 235.514 17.6452 238.338 17.3845C276.886 13.8291 315.481 10.3502 354.039 11.9581L354.039 8.10443C323.89 9.8586 294.117 10.1059 263.613 15.1075C261.954 15.6985 262.396 18.0824 264.156 18.0427C266.21 17.9848 268.211 17.9307 270.257 17.8782C292.505 17.3171 314.872 17.0069 337.102 17.155C337.4 17.1583 337.687 17.0443 337.901 16.837C338.115 16.6297 338.238 16.3463 338.243 16.0488C338.248 15.7513 338.134 15.464 337.927 15.2497C337.721 15.0354 337.437 14.9119 337.14 14.9053C337.14 14.9053 337.14 14.9053 337.14 14.9053C314.856 14.5066 292.481 14.5796 270.195 14.9164C268.146 14.9484 266.142 14.9822 264.086 15.0198L264.63 17.955C293.557 13.6023 324.299 13.403 354.204 11.9581C356.511 11.8591 356.51 8.20248 354.203 8.1044C315.325 6.15638 276.533 9.3683 237.904 12.6758L238.405 17.3773C367.23 2.36071 497.301 4.89382 627.086 8.76672C634.109 9.0033 641.25 9.25626 648.509 9.52627L648.733 3.5343C455.133 -3.12361 261.328 1.01758 67.7648 8.45711C45.5741 9.35438 23.2879 10.3116 1.07049 11.4064Z"
              />
            </svg>
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
