<script setup>
import { contactLinks } from '../data/site'

function resolveHref(link) {
  return link.href || `mailto:${link.handle}`
}

function opensNewTab(link) {
  return link.href.startsWith('http')
}
</script>

<template>
  <div class="page-container contact-page container">
    <div class="contact-layout">
      <section class="contact-links" aria-label="联系方式">
        <a
          v-for="(link, index) in contactLinks"
          :key="link.label"
          class="contact-card"
          :href="resolveHref(link)"
          :target="opensNewTab(link) ? '_blank' : undefined"
          :rel="opensNewTab(link) ? 'noreferrer' : undefined"
        >
          <span class="contact-ticket-index" aria-hidden="true">
            {{ String(index + 1).padStart(2, '0') }}
          </span>
          <span class="contact-link-copy">
            <small aria-hidden="true">CONTACT PASS · TEATIME</small>
            <strong>{{ link.label }}</strong>
            <span>{{ link.handle }} · {{ link.description }}</span>
          </span>
          <span class="contact-card-action" aria-hidden="true">↗</span>
        </a>
      </section>
    </div>
  </div>
</template>
