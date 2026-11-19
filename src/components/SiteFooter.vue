<script setup>
import { profile } from '../data/site'

const emit = defineEmits(['navigate'])
</script>

<template>
  <footer class="site-footer">
    <div class="footer-inner container">
      <div class="footer-actions">
        <button type="button" @click="emit('navigate', 'commission')">
          个人委托
        </button>
        <button type="button" @click="emit('navigate', 'guidelines')">
          使用规约
        </button>
        <button type="button" @click="emit('navigate', 'contact')">
          联系我
        </button>
      </div>

      <p class="footer-credit">{{ profile.bannerCredit }}</p>

      <p class="footer-meta">
        管理者&维护：赋水仙术
      </p>
    </div>
  </footer>
</template>
