<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import HomePage from './pages/HomePage.vue'
import CommissionPage from './pages/CommissionPage.vue'
import DownloadsPage from './pages/DownloadsPage.vue'
import GuidelinesPage from './pages/GuidelinesPage.vue'
import ContactPage from './pages/ContactPage.vue'
import { navItems, profile } from './data/site'

const pages = {
  home: HomePage,
  commission: CommissionPage,
  downloads: DownloadsPage,
  guidelines: GuidelinesPage,
  contact: ContactPage,
}

const siteTitle = '赋水 · 果茶铺 · 个人存档点'

function readPageFromHash() {
  const page = window.location.hash.replace('#', '')
  return pages[page] ? page : 'home'
}

const activePage = ref(readPageFromHash())

function syncFromLocation() {
  activePage.value = readPageFromHash()
}

function navigateTo(page) {
  if (!pages[page]) return

  if (activePage.value === page) {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    })
    return
  }

  activePage.value = page
  window.history.pushState({ page }, '', `#${page}`)
  window.scrollTo({
    top: 0,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth',
  })
}

watch(activePage, () => {
  document.title = siteTitle
}, { immediate: true })

onMounted(() => {
  window.addEventListener('hashchange', syncFromLocation)
  window.addEventListener('popstate', syncFromLocation)
  if (!window.location.hash) {
    window.history.replaceState({ page: 'home' }, '', '#home')
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', syncFromLocation)
  window.removeEventListener('popstate', syncFromLocation)
})
</script>

<template>
  <div class="site-shell" :class="`route-${activePage}`">
    <a class="skip-link" href="#main-content">跳到主要内容</a>
    <SiteHeader
      :items="navItems"
      :active-page="activePage"
      @navigate="navigateTo"
    />
    <main id="main-content" class="site-main">
      <Transition name="page" mode="out-in">
        <component
          :is="pages[activePage]"
          :key="activePage"
          @navigate="navigateTo"
        />
      </Transition>
    </main>

    <SiteFooter @navigate="navigateTo" />
  </div>
</template>
