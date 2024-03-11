<script lang="ts" setup>
import './index.less'
import {
  type CSSProperties,
  type PropType,
  computed,
  ref,
  watch,
} from 'vue'

// Utils
// import { useEventListener } from '@vant/use'
import {
  createNamespace,
  extend,
  getZIndexStyle,
  isDef,
  numericProp,
  preventDefault,
  truthProp,
  unknownProp,
} from '../utils'

// Composables
// import { useLazyRender } from '../composables/use-lazy-render'

const props = defineProps({
  show: Boolean,
  zIndex: numericProp,
  duration: numericProp,
  className: unknownProp,
  lockScroll: truthProp,
  lazyRender: truthProp,
  customStyle: Object as PropType<CSSProperties>,
})
const [name, bem] = createNamespace('overlay')
const root = ref<HTMLElement>()
// const lazyRender = useLazyRender(() => props.show || !props.lazyRender)
const inited = ref(false)
watch(
  () => props.show || !props.lazyRender,
  (value) => {
    if (value)
      inited.value = value
  },
  { immediate: true },
)

function onTouchMove(event: TouchEvent) {
  if (props.lockScroll)
    preventDefault(event, true)
}

const style = computed(() => {
  const style: CSSProperties = extend(
    getZIndexStyle(props.zIndex),
    props.customStyle,
  )

  if (isDef(props.duration))
    style.animationDuration = `${props.duration}s`
  return style
})

// useEventListener will set passive to `false` to eliminate the warning of Chrome
// useEventListener('touchmove', onTouchMove, {
//   target: root,
// })
</script>

<template>
  <template v-if="inited">
    <view v-show="show" ref="root" :style="style" :class="[bem(), className]">
      <slot />
    </view>
  </template>
</template>
