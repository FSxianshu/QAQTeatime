<script setup>
import { onBeforeUnmount, ref } from 'vue'

defineProps({
  file: {
    type: Object,
    required: true,
  },
})

const isPunched = ref(false)
let punchTimer = 0

function handleDownloadClick() {
  isPunched.value = true
  window.clearTimeout(punchTimer)
  punchTimer = window.setTimeout(() => {
    isPunched.value = false
  }, 560)
}

onBeforeUnmount(() => {
  window.clearTimeout(punchTimer)
})
</script>

<template>
  <article
    class="download-card"
    :class="{ muted: !file.available, 'is-punched': isPunched }"
  >
    <div class="file-cover">
      <img :src="file.cover" :alt="`${file.title}封面`" />
      <span v-if="!file.available" class="cover-status">待上传</span>
    </div>
    <div class="file-card-body">
      <div class="ticket-legend" aria-hidden="true">
        <span>ADMIT ONE</span>
        <span>{{ file.format }}</span>
      </div>
      <div class="file-card-heading">
        <h2>{{ file.title }}</h2>
      </div>
      <p class="file-description">{{ file.description }}</p>
      <a
        v-if="file.available"
        class="download-button"
        :href="file.href"
        download
        :aria-label="`下载 ${file.title}，包体大小 ${file.size}`"
        @click="handleDownloadClick"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          width="22"
          height="22"
          aria-hidden="true"
        >
          <path
            d="M6 21H18M12 3V17M12 17L17 12M12 17L7 12"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span>Download</span>
        <span class="download-tooltip" aria-hidden="true">
          包体大小 · {{ file.size }}
        </span>
      </a>
      <span v-else class="download-button disabled">暂未发布</span>
    </div>
  </article>
</template>
