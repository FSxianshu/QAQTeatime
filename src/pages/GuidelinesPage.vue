<script setup>
import { ref } from 'vue'
import { guidelines } from '../data/site'

const openSection = ref('')

function toggleSection(id) {
  openSection.value = openSection.value === id ? '' : id
}
</script>

<template>
  <div class="page-container guidelines-page container">
    <div class="guidelines-layout">
      <div class="guidelines-content">
        <article
          v-for="item in guidelines"
          :id="`rule-${item.id}`"
          :key="item.id"
          class="rule-section"
          :class="{ open: openSection === item.id }"
        >
          <button
            class="rule-toggle"
            type="button"
            :aria-expanded="openSection === item.id"
            :aria-controls="`rule-body-${item.id}`"
            @click="toggleSection(item.id)"
          >
            <div class="rule-heading">
              <span class="rule-ticket-kicker" aria-hidden="true">
                GIFT PASS · TEATIME
              </span>
              <h2>{{ item.title }}</h2>
              <span class="rule-count">{{ item.points.length }} 项</span>
            </div>
            <span class="rule-toggle-mark" aria-hidden="true">
              {{ openSection === item.id ? '−' : '+' }}
            </span>
          </button>
          <Transition name="rule-expand">
            <div
              v-if="openSection === item.id"
              :id="`rule-body-${item.id}`"
              class="rule-body"
            >
              <ul>
                <li v-for="point in item.points" :key="point">{{ point }}</li>
              </ul>
            </div>
          </Transition>
        </article>
      </div>
    </div>
  </div>
</template>
