<script lang="ts">
import './index.less'
import {
  type CSSProperties,
  type ExtractPropTypes,
  type PropType,
  computed,
  nextTick,
  reactive,
  ref,
  watch,
} from 'vue'

// Utils
import { useEventListener, useRect, useScrollParent, useUniRect } from '../vant-use'
import {
  createNamespace,
  extend,
  getScrollTop,
  getZIndexStyle,
  isHidden,
  makeNumericProp,
  makeStringProp,
  numericProp,
  unitToPx,
  windowHeight,
  windowWidth,
} from '../utils'

// Composables
import { useVisibilityChange } from '../composables/use-visibility-change'

export type StickyPosition = 'top' | 'bottom'

export const stickyProps = {
  zIndex: numericProp,
  position: makeStringProp<StickyPosition>('top'),
  container: Boolean,
  offsetTop: makeNumericProp(0),
  offsetBottom: makeNumericProp(0),
}

export type StickyProps = ExtractPropTypes<typeof stickyProps>

export default {
  options: {
    virtualHost: true,
  },
}
</script>

<script lang="ts" setup>
const props = defineProps(stickyProps)
const emit = defineEmits(['scroll', 'change'])

const [name, bem] = createNamespace('sticky')
const root = ref<HTMLElement>()
const scrollParent = useScrollParent(root)
const state = reactive({
  fixed: false,
  width: 0, // root width
  height: 0, // root height
  transform: 0,
})
const isReset = ref(false)

const offset = computed(() =>
  unitToPx(props.position === 'top' ? props.offsetTop : props.offsetBottom),
)

const rootStyle = computed<CSSProperties | undefined>(() => {
  if (isReset.value)
    return

  const { fixed, height, width } = state
  if (fixed) {
    return {
      width: `${width}px`,
      height: `${height}px`,
    }
  }
  return undefined
})

const stickyStyle = computed<CSSProperties | undefined>(() => {
  // if (!state.fixed || isReset.value)
  //   return

  const style: CSSProperties = extend(getZIndexStyle(props.zIndex), {
    // width: `${state.width}px`,
    // height: `${state.height}px`,
    [props.position]: `${offset.value}px`,
  })

  // if (state.transform)
  //   style.transform = `translate3d(0, ${state.transform}px, 0)`

  return style
})

function emitScroll(scrollTop: number) {
  return emit('scroll', {
    scrollTop,
    isFixed: state.fixed,
  })
}

function onScroll(event) {
  console.log('event', event)
  // emitScroll(scrollTop)
}

watch(
  () => state.fixed,
  value => emit('change', value),
)

useEventListener('scroll', onScroll, {
  target: scrollParent,
  passive: true,
})
useVisibilityChange(root, onScroll)

watch([windowWidth, windowHeight], () => {
  if (!root.value || isHidden(root) || !state.fixed)
    return

  isReset.value = true
  nextTick(() => {
    useUniRect(`.${bem('root')}`).then((rootRect) => {
      state.width = rootRect.width!
      state.height = rootRect.height!
      isReset.value = false
    })
  })
})
</script>

<template>
  <!-- <scroll-view :style="rootStyle" @scroll="onScroll"> -->
    <view :class="bem()" :style="stickyStyle">
      <slot />
    </view>
  <!-- </scroll-view> -->
</template>
