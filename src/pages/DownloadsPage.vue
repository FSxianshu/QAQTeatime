<script setup>
import { computed, ref, watch } from 'vue'
import { engineeringFiles } from '../data/site'
import DownloadCard from '../components/DownloadCard.vue'

const emit = defineEmits(['navigate'])
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 6

const filteredFiles = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return engineeringFiles.filter((file) => {
    const searchable = `${file.title} ${file.description} ${file.formats.join(' ')}`
      .toLowerCase()

    return searchable.includes(query)
  })
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredFiles.value.length / pageSize)),
)

const visibleFiles = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredFiles.value.slice(start, start + pageSize)
})

watch(searchQuery, () => {
  currentPage.value = 1
})
</script>

<template>
  <div class="page-container downloads-page container">
    <header class="page-heading downloads-heading">
      <label class="search-box">
        <input
          v-model="searchQuery"
          type="search"
          placeholder=" "
          aria-label="Search files"
        />
        <span class="search-box-label">Search files</span>
        <span class="search-box-bar" aria-hidden="true"></span>
        <span class="search-box-highlight" aria-hidden="true"></span>
      </label>
      <div>
        <p>
          下载和使用默认您已阅读<a
            href="#guidelines"
            @click.prevent="emit('navigate', 'guidelines')"
          >
            本站规约
          </a>
        </p>
      </div>
    </header>

    <section class="download-grid" aria-live="polite">
      <DownloadCard
        v-for="file in visibleFiles"
        :key="file.title"
        :file="file"
      />

      <div v-if="filteredFiles.length === 0" class="empty-state">
        <h2>没有找到匹配的文件</h2>
        <p>试试其他关键词。</p>
        <button
          type="button"
          @click="searchQuery = ''"
        >
          清除搜索
        </button>
      </div>
    </section>

    <nav
      v-if="filteredFiles.length > 0"
      class="pagination"
      aria-label="下载文件分页"
    >
      <button
        type="button"
        :disabled="currentPage === 1"
        @click="currentPage -= 1"
      >
        Prev
      </button>
      <button
        v-for="page in totalPages"
        :key="page"
        type="button"
        :class="{ active: currentPage === page }"
        :aria-current="currentPage === page ? 'page' : undefined"
        @click="currentPage = page"
      >
        {{ page }}
      </button>
      <button
        type="button"
        :disabled="currentPage === totalPages"
        @click="currentPage += 1"
      >
        Next
      </button>
    </nav>

  </div>
</template>
