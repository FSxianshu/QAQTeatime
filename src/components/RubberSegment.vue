<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  value: {
    type: String,
    default: undefined,
  },
  defaultValue: {
    type: String,
    default: '',
  },
  trackColor: {
    type: String,
    default: 'transparent',
  },
  thumbColor: {
    type: String,
    default: '#ffffff',
  },
  textColor: {
    type: String,
    default: '#ffffff',
  },
  activeTextColor: {
    type: String,
    default: '#303f9f',
  },
  size: {
    type: String,
    default: 'md',
  },
  radius: {
    type: Number,
    default: 10,
  },
  inset: {
    type: Number,
    default: 3,
  },
  equalSlots: {
    type: Boolean,
    default: true,
  },
  stretch: {
    type: Number,
    default: 100,
  },
  squash: {
    type: Number,
    default: 3,
  },
  speed: {
    type: Number,
    default: 1,
  },
  glide: {
    type: Number,
    default: 75,
  },
  draggable: {
    type: Boolean,
    default: true,
  },
  orientation: {
    type: String,
    default: 'horizontal',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['change'])
const rootElement = ref(null)
const buttonElements = []
const initialIndex = Math.max(
  0,
  props.items.indexOf(props.value ?? props.defaultValue),
)
const currentIndex = ref(initialIndex)
const thumbStyle = ref({ width: '0px', transform: 'translateX(0)' })
const ready = ref(false)
const dragging = ref(false)
const snapping = ref(false)
let dragState = null
let handoffTimer
let settleTimer
let resizeObserver
let animationGeneration = 0

const sizePresets = {
  sm: { height: 28, font: 12, padding: 10, minWidth: 36 },
  md: { height: 36, font: 13, padding: 14, minWidth: 44 },
  lg: { height: 44, font: 14, padding: 18, minWidth: 48 },
}

const preset = computed(() => sizePresets[props.size] ?? sizePresets.md)
const currentValue = computed(
  () => props.items[currentIndex.value] ?? props.items[0] ?? '',
)
const isVertical = computed(() => props.orientation === 'vertical')
const rootClasses = computed(() => [
  `size-${props.size}`,
  props.orientation,
  {
    'equal-slots': props.equalSlots,
    draggable: props.draggable && !props.disabled,
    dragging: dragging.value,
    snapping: snapping.value,
    disabled: props.disabled,
    ready: ready.value,
  },
])
const rootStyle = computed(() => ({
  '--track-color': props.trackColor,
  '--thumb-color': props.thumbColor,
  '--text-color': props.textColor,
  '--active-text-color': props.activeTextColor,
  '--segment-radius': `${props.radius}px`,
  '--segment-thumb-radius': `${Math.max(0, props.radius - props.inset)}px`,
  '--segment-inset': `${props.inset}px`,
  '--segment-height': `${preset.value.height}px`,
  '--segment-font-size': `${preset.value.font}px`,
  '--segment-padding': `${preset.value.padding}px`,
  '--segment-min-width': `${preset.value.minWidth}px`,
  '--segment-settle': `${Math.max(100, 300 * props.speed)}ms`,
  '--segment-relax': `${Math.max(70, 160 * props.speed)}ms`,
}))

function setButtonRef(element, index) {
  if (element) buttonElements[index] = element
}

function slotOf(index) {
  const button = buttonElements[index]
  if (!button) return null

  const start = isVertical.value ? button.offsetTop : button.offsetLeft
  const size = isVertical.value ? button.offsetHeight : button.offsetWidth

  return {
    start,
    size,
    end: start + size,
    center: start + size / 2,
  }
}

function setThumb(start, size) {
  if (isVertical.value) {
    const crossSize =
      (rootElement.value?.clientWidth ?? 0) - props.inset * 2
    thumbStyle.value = {
      width: `${crossSize}px`,
      height: `${size}px`,
      transform: `translateY(${start}px)`,
    }
  } else {
    thumbStyle.value = {
      width: `${size}px`,
      height: 'auto',
      transform: `translateX(${start}px)`,
    }
  }
}

function clearTravelTimers() {
  window.clearTimeout(handoffTimer)
  window.clearTimeout(settleTimer)
}

async function jumpTo(index) {
  snapping.value = true
  await nextTick()
  const slot = slotOf(index)
  if (!slot) {
    snapping.value = false
    return
  }

  clearTravelTimers()
  animationGeneration += 1
  setThumb(slot.start, slot.size)
  ready.value = true
  requestAnimationFrame(() => {
    snapping.value = false
  })
}

async function travelTo(index) {
  snapping.value = false
  await nextTick()
  const target = slotOf(index)
  if (!target) return

  const previous = slotOf(currentIndex.value)
  currentIndex.value = index
  if (!previous || previous.start === target.start) {
    setThumb(target.start, target.size)
    return
  }

  clearTravelTimers()
  const generation = ++animationGeneration
  const ratio = Math.max(0, props.stretch / 100)
  const expandedStart =
    target.start + (Math.min(previous.start, target.start) - target.start) * ratio
  const expandedEnd =
    target.end + (Math.max(previous.end, target.end) - target.end) * ratio

  setThumb(expandedStart, expandedEnd - expandedStart)

  handoffTimer = window.setTimeout(() => {
    if (generation !== animationGeneration) return

    const direction = Math.sign(target.start - previous.start) || 1
    setThumb(target.start, target.size + direction * props.squash)

    settleTimer = window.setTimeout(() => {
      if (generation !== animationGeneration) return
      setThumb(target.start, target.size)
    }, 150 * props.speed)
  }, Math.max(80, 150 * props.speed))
}

function selectIndex(index, { notify = true } = {}) {
  if (props.disabled || index < 0 || index >= props.items.length) return
  if (index === currentIndex.value) return

  travelTo(index)
  if (notify) emit('change', props.items[index], index)
}

function handlePointerDown(event) {
  if (!props.draggable || props.disabled || event.button !== 0) return

  const slot = slotOf(currentIndex.value)
  if (!slot) return

  const rootRect = rootElement.value?.getBoundingClientRect()
  if (!rootRect) return

  const pointerAxis = isVertical.value
    ? event.clientY - rootRect.top
    : event.clientX - rootRect.left
  dragState = {
    startAxis: pointerAxis,
    start: slot.start,
    size: slot.size,
    offset: pointerAxis - slot.start,
    samples: [[event.timeStamp, pointerAxis]],
    live: false,
    pointerId: event.pointerId,
  }
  dragging.value = true
  clearTravelTimers()
  animationGeneration += 1
  event.currentTarget.setPointerCapture?.(event.pointerId)
  window.addEventListener('pointermove', handlePointerMove)
  window.addEventListener('pointerup', handlePointerUp, { once: true })
}

function handlePointerMove(event) {
  if (!dragState || event.pointerId !== dragState.pointerId) return

  const root = rootElement.value
  if (!root) return

  const rootRect = root.getBoundingClientRect()
  const pointerAxis = isVertical.value
    ? event.clientY - rootRect.top
    : event.clientX - rootRect.left
  dragState.samples.push([event.timeStamp, pointerAxis])
  if (dragState.samples.length > 8) dragState.samples.shift()

  if (!dragState.live) {
    if (Math.abs(pointerAxis - dragState.startAxis) < 4) return
    dragState.live = true
  }

  const minStart = props.inset
  const maxStart =
    (isVertical.value ? root.clientHeight : root.clientWidth) -
    props.inset -
    dragState.size
  const nextStart = Math.min(
    maxStart,
    Math.max(minStart, pointerAxis - dragState.offset),
  )

  setThumb(nextStart, dragState.size)
}

function velocityOf(samples, now) {
  const recent = samples.filter(([time]) => now - time <= 100)
  if (recent.length < 2) return 0

  const [startTime, startX] = recent[0]
  const [endTime, endX] = recent[recent.length - 1]
  return endTime - startTime >= 8
    ? ((endX - startX) / (endTime - startTime)) * 1000
    : 0
}

function projectVelocity(velocity) {
  const decay = 1 - 0.1 * Math.pow(0.05, props.glide / 100)
  return ((velocity / 1000) * decay) / (1 - decay)
}

function nearestIndexAt(x) {
  let nearest = 0
  let nearestDistance = Number.POSITIVE_INFINITY

  props.items.forEach((_, index) => {
    const slot = slotOf(index)
    if (!slot) return
    const distance = Math.abs(slot.center - x)
    if (distance < nearestDistance) {
      nearestDistance = distance
      nearest = index
    }
  })

  return nearest
}

function handlePointerUp(event) {
  if (!dragState) return

  const state = dragState
  dragState = null
  dragging.value = false
  window.removeEventListener('pointermove', handlePointerMove)

  if (!state.live) {
    jumpTo(currentIndex.value)
    return
  }

  const root = rootElement.value
  if (!root) return

  const rootRect = root.getBoundingClientRect()
  const pointerAxis = isVertical.value
    ? event.clientY - rootRect.top
    : event.clientX - rootRect.left
  const velocity = Math.max(
    -2000,
    Math.min(2000, velocityOf(state.samples, event.timeStamp)),
  )
  let nextIndex = nearestIndexAt(pointerAxis + projectVelocity(velocity))

  if (Math.abs(velocity) > 110 && nextIndex === currentIndex.value) {
    nextIndex = Math.min(
      props.items.length - 1,
      Math.max(0, nextIndex + Math.sign(velocity)),
    )
  }

  const changed = nextIndex !== currentIndex.value
  const target = slotOf(nextIndex)
  if (target) {
    currentIndex.value = nextIndex
    setThumb(target.start, target.size)
  }
  if (changed) emit('change', props.items[nextIndex], nextIndex)
}

function handleKeyDown(event, index) {
  if (props.disabled) return

  const last = props.items.length - 1
  let next = null

  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    next = Math.min(last, index + 1)
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    next = Math.max(0, index - 1)
  } else if (event.key === 'Home') {
    next = 0
  } else if (event.key === 'End') {
    next = last
  }

  if (next === null || next === index) return
  event.preventDefault()
  selectIndex(next)
  nextTick(() => buttonElements[next]?.focus())
}

watch(
  () => props.value ?? props.defaultValue,
  (value) => {
    const index = props.items.indexOf(value)
    if (index < 0 || index === currentIndex.value) return
    currentIndex.value = index
    jumpTo(index)
  },
)

onMounted(() => {
  jumpTo(currentIndex.value)
  resizeObserver = new ResizeObserver(() => jumpTo(currentIndex.value))
  if (rootElement.value) resizeObserver.observe(rootElement.value)
})

onBeforeUnmount(() => {
  clearTravelTimers()
  resizeObserver?.disconnect()
  window.removeEventListener('pointermove', handlePointerMove)
})
</script>

<template>
  <div
    ref="rootElement"
    class="rubber-segment"
    :class="rootClasses"
    :style="rootStyle"
    role="radiogroup"
    aria-label="主导航"
    :aria-disabled="disabled || undefined"
  >
    <span
      class="rubber-thumb"
      :style="thumbStyle"
      aria-hidden="true"
      @pointerdown.prevent.stop="handlePointerDown"
    ></span>
    <button
      v-for="(item, index) in items"
      :key="item"
      :ref="(element) => setButtonRef(element, index)"
      type="button"
      role="radio"
      class="rubber-segment-item"
      :class="{ active: currentIndex === index }"
      :aria-checked="currentIndex === index"
      :tabindex="currentIndex === index ? 0 : -1"
      :disabled="disabled"
      @click="selectIndex(index)"
      @keydown="handleKeyDown($event, index)"
    >
      {{ item }}
    </button>
  </div>
</template>
