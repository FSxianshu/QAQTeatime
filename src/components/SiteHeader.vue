<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import RubberSegment from './RubberSegment.vue'
import bgmUrl from '../../audio/bgm_冬の記憶.mp3'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  activePage: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['navigate'])
const mobileOpen = ref(false)
const activeIndex = ref(0)
const audioRef = ref(null)
const isBgmPlaying = ref(false)
const segmentItems = computed(() => props.items.map((item) => item.label))
const activeLabel = computed(
  () => props.items[activeIndex.value]?.label ?? props.items[0]?.label ?? '',
)

watch(
  () => props.activePage,
  (page) => {
    const index = props.items.findIndex((item) => item.id === page)
    activeIndex.value = index >= 0 ? index : 0
  },
  { immediate: true },
)

function goTo(page) {
  emit('navigate', page)
  mobileOpen.value = false
}

function handleNavChange(_value, index) {
  const navItem = props.items[index]
  if (navItem) goTo(navItem.id)
}

function closeOnEscape(event) {
  if (event.key === 'Escape') {
    mobileOpen.value = false
  }
}

async function playBgm() {
  const audio = audioRef.value
  if (!audio) return

  try {
    await audio.play()
  } catch {
    isBgmPlaying.value = false
  }
}

async function toggleBgm() {
  const audio = audioRef.value
  if (!audio) return

  if (!audio.paused) {
    audio.pause()
    return
  }

  await playBgm()
}

watch(
  () => props.activePage,
  () => {
    mobileOpen.value = false
  },
)

watch(mobileOpen, (isOpen) => {
  document.body.classList.toggle('nav-open', isOpen)
})

onMounted(() => {
  window.addEventListener('keydown', closeOnEscape)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', closeOnEscape)
  document.body.classList.remove('nav-open')
})
</script>

<template>
  <header class="site-header">
    <div class="ticket-stub">
      <span class="ticket-notch top" aria-hidden="true"></span>
      <span class="ticket-notch bottom" aria-hidden="true"></span>

      <div class="ticket-stub-heading">
        <span>ADMIT ONE</span>
        <strong>TEATIME</strong>
      </div>

      <RubberSegment
        :items="segmentItems"
        :default-value="activeLabel"
        track-color="transparent"
        thumb-color="#ffffff"
        text-color="#ffffff"
        active-text-color="#303f9f"
        size="md"
        :radius="10"
        :inset="3"
        equal-slots
        :stretch="100"
        :squash="3"
        :speed="1"
        :glide="75"
        draggable
        orientation="vertical"
        @change="handleNavChange"
      />

      <div class="ticket-stub-art">
        <button
          class="ticket-music-toggle"
          :class="{ playing: isBgmPlaying }"
          type="button"
          :aria-label="
            isBgmPlaying
              ? '暂停 BGM - 冬の記憶'
              : '播放 BGM - 冬の記憶'
          "
          :aria-pressed="isBgmPlaying"
          @click="toggleBgm"
        >
          <svg
            class="ticket-music-icon"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle
              cx="32"
              cy="32"
              r="24"
              fill="#0a0d24"
              stroke="currentColor"
              stroke-width="1.7"
            />
            <circle
              cx="32"
              cy="32"
              r="20.5"
              stroke="currentColor"
              stroke-width="1"
              stroke-opacity=".28"
            />
            <circle
              cx="32"
              cy="32"
              r="17.5"
              stroke="currentColor"
              stroke-width="1"
              stroke-opacity=".18"
            />
            <circle
              cx="32"
              cy="32"
              r="14.5"
              stroke="currentColor"
              stroke-width="1"
              stroke-opacity=".34"
            />
            <circle
              cx="32"
              cy="32"
              r="11.5"
              stroke="currentColor"
              stroke-width="1"
              stroke-opacity=".16"
            />
            <circle
              cx="32"
              cy="32"
              r="8"
              fill="#d9ddff"
              stroke="currentColor"
              stroke-width="1.2"
            />
            <circle
              cx="32"
              cy="32"
              r="2"
              fill="#0a0d24"
              stroke="currentColor"
              stroke-width=".8"
            />
            <path
              d="M16.8 18.2a21 21 0 0 1 8-5.4"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linecap="round"
              stroke-opacity=".6"
            />
          </svg>
        </button>
        <span class="ticket-bgm-title">BGM - 冬の記憶</span>
        <audio
          ref="audioRef"
          class="ticket-bgm-audio"
          :src="bgmUrl"
          preload="metadata"
          playsinline
          @play="isBgmPlaying = true"
          @pause="isBgmPlaying = false"
          @ended="isBgmPlaying = false"
        ></audio>
      </div>

      <div class="ticket-stub-meta">
        <span>VOICE SYNTHESIS</span>
        <span>2026.11.15</span>
      </div>
      <div class="ticket-barcode" aria-hidden="true">
        <i v-for="line in 14" :key="line"></i>
      </div>
    </div>

    <button
      class="nav-toggle"
      type="button"
      :class="{ open: mobileOpen }"
      :aria-expanded="mobileOpen"
      aria-controls="mobile-navigation"
      aria-label="打开导航菜单"
      @click="mobileOpen = !mobileOpen"
    >
      <span></span>
      <span></span>
    </button>

    <Teleport to="body">
      <Transition name="mobile-menu">
        <div
          v-if="mobileOpen"
          id="mobile-navigation"
          class="mobile-overlay"
          @click.self="mobileOpen = false"
        >
          <nav class="mobile-nav" aria-label="移动端主导航">
            <a
              v-for="item in items"
              :key="item.id"
              :href="`#${item.id}`"
              :class="{ active: activePage === item.id }"
              :aria-current="activePage === item.id ? 'page' : undefined"
              @click.prevent="goTo(item.id)"
            >
              <strong>{{ item.label }}</strong>
            </a>
          </nav>
        </div>
      </Transition>
    </Teleport>
  </header>
</template>
