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
import { useEventListener, useRect, useScrollParent } from '../vant-use'
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
  container: Object as PropType<Element>,
  offsetTop: makeNumericProp(0),
  offsetBottom: makeNumericProp(0),
}

export type StickyProps = ExtractPropTypes<typeof stickyProps>
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

// eslint-disable-next-line vue/return-in-computed-property
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
})

const stickyStyle = computed<CSSProperties | undefined>(() => {
  if (!state.fixed || isReset.value)
    return

  const style: CSSProperties = extend(getZIndexStyle(props.zIndex), {
    width: `${state.width}px`,
    height: `${state.height}px`,
    [props.position]: `${offset.value}px`,
  })

  if (state.transform)
    style.transform = `translate3d(0, ${state.transform}px, 0)`

  return style
})

function emitScroll(scrollTop: number) {
  return emit('scroll', {
    scrollTop,
    isFixed: state.fixed,
  })
}

function onScroll() {
  if (!root.value || isHidden(root))
    return

  const { container, position } = props
  const rootRect = useRect(root)
  const scrollTop = getScrollTop(window)

  state.width = rootRect.width
  state.height = rootRect.height

  if (position === 'top') {
    // The sticky component should be kept inside the container element
    if (container) {
      const containerRect = useRect(container)
      const difference = containerRect.bottom - offset.value - state.height
      state.fixed = offset.value > rootRect.top && containerRect.bottom > 0
      state.transform = difference < 0 ? difference : 0
    }
    else {
      state.fixed = offset.value > rootRect.top
    }
  }
  else {
    const { clientHeight } = document.documentElement
    if (container) {
      const containerRect = useRect(container)
      const difference
            = clientHeight - containerRect.top - offset.value - state.height
      state.fixed
            = clientHeight - offset.value < rootRect.bottom
            && clientHeight > containerRect.top
      state.transform = difference < 0 ? -difference : 0
    }
    else {
      state.fixed = clientHeight - offset.value < rootRect.bottom
    }
  }

  emitScroll(scrollTop)
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
    const rootRect = useRect(root)
    state.width = rootRect.width
    state.height = rootRect.height
    isReset.value = false
  })
})
</script>

<template>
  <view ref="root" :style="rootStyle">
    <view :class="bem({ fixed: state.fixed && !isReset })" :style="stickyStyle">
      <slot />
    </view>
  </view>
</template>
