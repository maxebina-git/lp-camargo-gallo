<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Drawer } from 'ds-grupo-rkb'
import PrivacyPolicy from './PrivacyPolicy.vue'
import TermsOfUse from './TermsOfUse.vue'

type LegalView = 'privacy' | 'terms'

const open = ref(false)
const view = ref<LegalView>('privacy')

const titles: Record<LegalView, string> = {
  privacy: 'Política de Privacidade',
  terms: 'Termos de Uso',
}

function openFor(hash: string) {
  if (hash === 'privacy' || hash === 'terms') {
    view.value = hash
    open.value = true
  }
}

function closeDrawer() {
  open.value = false
  history.replaceState(null, '', location.pathname + location.search)
}

onMounted(() => {
  const h = location.hash.replace('#', '')
  if (h === 'privacy' || h === 'terms') openFor(h)
  window.addEventListener('hashchange', () => {
    const h = location.hash.replace('#', '')
    if (h === 'privacy' || h === 'terms') openFor(h)
    else closeDrawer()
  })
})
</script>

<template>
  <Drawer v-model:open="open" :title="titles[view]" placement="right" @close="closeDrawer">
    <PrivacyPolicy v-if="view === 'privacy'" />
    <TermsOfUse v-else />
  </Drawer>
</template>