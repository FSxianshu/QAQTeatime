<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { profile } from '../data/site'

const heroRef = ref(null)
const particleField = ref(null)
const particleCanvas = ref(null)
const pointer = { x: 0, y: 0, active: false, strength: 0 }
let pointerTarget = { x: 0, y: 0, active: false }
let canvasContext = null
let canvasWidth = 0
let canvasHeight = 0
let animationFrame = 0
let resizeObserver = null
let bubbles = []
let motes = []
let elapsed = 0
let previousFrame = 0

function randomBetween(min, max) {
  return min + Math.random() * (max - min)
}

function createAtmosphere() {
  const moteCount = Math.max(
    82,
    Math.min(150, Math.round((canvasWidth * canvasHeight) / 3400)),
  )
  const aspect = canvasWidth / canvasHeight
  const columns = Math.ceil(Math.sqrt(moteCount * aspect))
  const rows = Math.ceil(moteCount / columns)

  motes = Array.from({ length: moteCount }, (_, index) => {
    const column = index % columns
    const row = Math.floor(index / columns)
    const x =
      ((column + randomBetween(0.16, 0.84)) / columns) * canvasWidth
    const y =
      ((row + randomBetween(0.16, 0.84)) / rows) * canvasHeight

    return {
      x,
      y,
      radius: randomBetween(0.7, 1.9),
      speed: randomBetween(0.08, 0.22),
      phase: randomBetween(0, Math.PI * 2),
      opacity:
        randomBetween(0.3, 0.68) *
        (x > canvasWidth * 0.6 ? 0.5 : 1),
      leaf: Math.random() > 0.82,
    }
  })

  bubbles = Array.from(
    { length: Math.max(7, Math.min(13, Math.round(canvasWidth / 80))) },
    () => ({
      x: randomBetween(canvasWidth * 0.04, canvasWidth * 0.78),
      y: randomBetween(8, canvasHeight - 8),
      radius: randomBetween(2.8, 6.5),
      speed: randomBetween(0.08, 0.2),
      phase: randomBetween(0, Math.PI * 2),
      opacity: randomBetween(0.1, 0.24),
    }),
  )
}

function resizeCanvas() {
  if (!particleField.value || !particleCanvas.value) return

  const rect = particleField.value.getBoundingClientRect()
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
  canvasWidth = rect.width
  canvasHeight = rect.height
  particleCanvas.value.width = Math.round(canvasWidth * pixelRatio)
  particleCanvas.value.height = Math.round(canvasHeight * pixelRatio)
  canvasContext = particleCanvas.value.getContext('2d')
  canvasContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  createAtmosphere()
}

function drawTeaAtmosphere(timestamp) {
  if (!canvasContext || !canvasWidth || !canvasHeight) return

  const delta = Math.min(32, timestamp - previousFrame || 16)
  previousFrame = timestamp
  elapsed += delta
  canvasContext.clearRect(0, 0, canvasWidth, canvasHeight)

  pointer.x += (pointerTarget.x - pointer.x) * 0.08
  pointer.y += (pointerTarget.y - pointer.y) * 0.08
  pointer.strength +=
    ((pointerTarget.active ? 1 : 0) - pointer.strength) * 0.12
  pointer.active = pointerTarget.active

  const pointerX = (pointer.x * 0.5 + 0.5) * canvasWidth
  const pointerY = (pointer.y * 0.5 + 0.5) * canvasHeight

  canvasContext.globalCompositeOperation = 'screen'
  canvasContext.lineCap = 'round'

  for (const bubble of bubbles) {
    const time = elapsed * 0.0014
    const x =
      bubble.x +
      Math.sin(time * bubble.speed + bubble.phase) * 7 +
      pointer.x * 3
    const y = bubble.y + pointer.y * 2

    bubble.y -= (delta * bubble.speed) / 16
    bubble.x += Math.sin(time * bubble.speed + bubble.phase) * 0.02

    if (bubble.y < -bubble.radius * 2) {
      bubble.y = canvasHeight + bubble.radius * 2
      bubble.x = randomBetween(canvasWidth * 0.04, canvasWidth * 0.78)
    }

    canvasContext.beginPath()
    canvasContext.arc(x, y, bubble.radius, 0, Math.PI * 2)
    canvasContext.strokeStyle = `rgba(210, 226, 255, ${bubble.opacity})`
    canvasContext.lineWidth = 0.8
    canvasContext.stroke()
  }

  canvasContext.shadowBlur = 0

  for (const mote of motes) {
    const time = elapsed * 0.0014
    const drift = Math.sin(time * mote.speed + mote.phase) * 0.16
    const deltaX = mote.x - pointerX
    const deltaY = mote.y - pointerY
    const distance = Math.hypot(deltaX, deltaY)
    const influence =
      pointer.strength * Math.max(0, 1 - distance / 120)
    const x =
      mote.x +
      (distance ? (-deltaY / distance) * influence * 9 : 0) +
      pointer.x * 3
    const y =
      mote.y +
      (distance ? (deltaX / distance) * influence * 9 : 0) -
      (delta * mote.speed) / 16 +
      pointer.y * 2

    mote.x += drift + pointer.x * 0.04
    mote.y -= (delta * mote.speed) / 16

    if (mote.y < -10) {
      mote.x = randomBetween(4, canvasWidth - 4)
      mote.y = canvasHeight + 8
    }

    canvasContext.beginPath()
    if (mote.leaf) {
      canvasContext.save()
      canvasContext.translate(x, y)
      canvasContext.rotate(time * mote.speed + mote.phase)
      canvasContext.ellipse(
        0,
        0,
        mote.radius * 1.8,
        mote.radius * 0.72,
        0,
        0,
        Math.PI * 2,
      )
      canvasContext.fillStyle = `rgba(190, 211, 255, ${mote.opacity * 0.8})`
      canvasContext.fill()
      canvasContext.restore()
    } else {
      canvasContext.arc(x, y, mote.radius, 0, Math.PI * 2)
      canvasContext.fillStyle = `rgba(218, 230, 255, ${mote.opacity})`
      canvasContext.fill()
    }
  }

  canvasContext.globalCompositeOperation = 'source-over'
  animationFrame = window.requestAnimationFrame(drawTeaAtmosphere)
}

function handlePointerMove(event) {
  if (!particleField.value) return

  const rect = particleField.value.getBoundingClientRect()
  pointerTarget = {
    x: Math.min(
      1,
      Math.max(-1, ((event.clientX - rect.left) / rect.width - 0.5) * 2),
    ),
    y: Math.min(
      1,
      Math.max(-1, ((event.clientY - rect.top) / rect.height - 0.5) * 2),
    ),
    active: true,
  }
}

function resetPointer() {
  pointerTarget = { x: 0, y: 0, active: false }
}

onMounted(() => {
  resizeCanvas()
  resizeObserver = new ResizeObserver(resizeCanvas)
  resizeObserver.observe(particleField.value)

  for (const target of [
    heroRef.value,
    particleField.value,
    particleCanvas.value,
    document,
  ]) {
    target?.addEventListener('pointermove', handlePointerMove, {
      capture: true,
      passive: true,
    })
    target?.addEventListener('mousemove', handlePointerMove, {
      capture: true,
      passive: true,
    })
  }

  heroRef.value?.addEventListener('pointerleave', resetPointer)
  heroRef.value?.addEventListener('mouseleave', resetPointer)
  animationFrame = window.requestAnimationFrame(drawTeaAtmosphere)
})

onBeforeUnmount(() => {
  window.cancelAnimationFrame(animationFrame)
  resizeObserver?.disconnect()

  for (const target of [
    heroRef.value,
    particleField.value,
    particleCanvas.value,
    document,
  ]) {
    target?.removeEventListener('pointermove', handlePointerMove, true)
    target?.removeEventListener('mousemove', handlePointerMove, true)
  }

  heroRef.value?.removeEventListener('pointerleave', resetPointer)
  heroRef.value?.removeEventListener('mouseleave', resetPointer)
})
</script>

<template>
  <div class="home-page">
    <section ref="heroRef" class="hero">
      <div ref="particleField" class="home-particles" aria-hidden="true">
        <canvas ref="particleCanvas" class="particle-canvas"></canvas>
      </div>
      <div class="home-ticket-head" aria-hidden="true">
        <span>ADMIT ONE</span>
        <span>MEOW</span>
        <span>VOL. 01</span>
      </div>
      <div class="home-ticket-rail" aria-hidden="true">
        <span>FS</span>
        <i></i>
        <span>TEA Time</span>
      </div>
      <div class="hero-copy home-hero-copy container">
        <p class="hero-role">{{ profile.role }}</p>
        <h1>
          <span class="hero-greeting">Welcome To</span>
          <span class="hero-title">My Tea Time</span>
        </h1>
        <p v-if="profile.intro" class="hero-intro">{{ profile.intro }}</p>
      </div>
      <div class="home-ticket-foot" aria-hidden="true">
        <span>SynthV UTAU VOCALOID</span>
        <span>SVP · USTX · MIDI</span>
        <strong>OVO / 01</strong>
      </div>
    </section>
  </div>
</template>
