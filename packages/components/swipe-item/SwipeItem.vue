<script lang="ts">
import './index.less'
import {
  type CSSProperties,
  computed,
  nextTick,
  onMounted,
  reactive,
} from 'vue'

// Utils
import { useParent } from '../vant-use'
import { createNamespace } from '../utils'
import { SWIPE_KEY } from '../swipe'

// Composables
import { useExpose } from '../composables/use-expose'

export default {
  options: {
    virtualHost: true,
  },
}
</script>

<script lang="ts" setup>
const [name, bem] = createNamespace('swipe-item')

let rendered: boolean
const state = reactive({
  offset: 0,
  inited: false,
  mounted: false,
})

const { parent, index } = useParent(SWIPE_KEY)

const style = computed(() => {
  const style: CSSProperties = {}
  if (parent) {
    const { vertical } = parent.props

    if (parent?.size.value)
      style[vertical ? 'height' : 'width'] = `${parent.size.value}px`

    if (state.offset)
      style.transform = `translate${vertical ? 'Y' : 'X'}(${state.offset}px)`
  }
  return style
})

const shouldRender = computed(() => {
  const { loop, lazyRender } = parent!.props
  if (!lazyRender || rendered)
    return true

  // wait for all item to mount, so we can get the exact count
  if (!state.mounted)
    return false

  const active = parent!.activeIndicator.value
  const maxActive = parent!.count.value - 1
  const prevActive = active === 0 && loop ? maxActive : active - 1
  const nextActive = active === maxActive && loop ? 0 : active + 1
  rendered
        = index.value === active
        || index.value === prevActive
        || index.value === nextActive

  return rendered
})

function setOffset(offset: number) {
  state.offset = offset
}

onMounted(() => {
  nextTick(() => {
    state.mounted = true
  })
})

useExpose({ setOffset })
</script>

<template>
  <view :class="bem()" :style="style">
    <template v-if="shouldRender">
      <slot />
    </template>
  </view>
</template>
