<script lang="ts" setup>
import {
  computed,
  reactive,
  ref,
  useSlots,
} from 'vue'
import type {
  PropType,
  Ref,
} from 'vue'

// Utils
import { useClickAway, useEventListener, useRect } from '@vant/use'
import type { Interceptor } from '../utils'
import {
  callInterceptor,
  clamp,
  createNamespace,
  isDef,
  makeNumericProp,
  numericProp,
  preventDefault,
} from '../utils'

// Composables
import { useTouch } from '../composables/use-touch'
import { useExpose } from '../composables/use-expose'

// Types
import type {
  SwipeCellExpose,
  SwipeCellPosition,
  SwipeCellSide,
} from './types'

const props = defineProps({
  name: makeNumericProp(''),
  disabled: Boolean,
  leftWidth: numericProp,
  rightWidth: numericProp,
  beforeClose: Function as PropType<Interceptor>,
  stopPropagation: Boolean,
})
const emit = defineEmits(['open', 'close', 'click'])
const [name, bem] = createNamespace('swipe-cell')
let opened: boolean
let lockClick: boolean
let startOffset: number
let isInBeforeClosing: boolean

const root = ref<HTMLElement>()
const leftRef = ref<HTMLElement>()
const rightRef = ref<HTMLElement>()

const state = reactive({
  offset: 0,
  dragging: false,
})

const touch = useTouch()

function getWidthByRef(ref: Ref<HTMLElement | undefined>) {
  return ref.value ? useRect(ref).width : 0
}

const leftWidth = computed(() =>
  isDef(props.leftWidth) ? +props.leftWidth : getWidthByRef(leftRef),
)

const rightWidth = computed(() =>
  isDef(props.rightWidth) ? +props.rightWidth : getWidthByRef(rightRef),
)

function open(side: SwipeCellSide) {
  state.offset = side === 'left' ? leftWidth.value : -rightWidth.value

  if (!opened) {
    opened = true
    emit('open', {
      name: props.name,
      position: side,
    })
  }
}

function close(position: SwipeCellPosition) {
  state.offset = 0

  if (opened) {
    opened = false
    emit('close', {
      name: props.name,
      position,
    })
  }
}

function toggle(side: SwipeCellSide) {
  const offset = Math.abs(state.offset)
  const THRESHOLD = 0.15
  const threshold = opened ? 1 - THRESHOLD : THRESHOLD
  const width = side === 'left' ? leftWidth.value : rightWidth.value

  if (width && offset > width * threshold)
    open(side)
  else
    close(side)
}

function onTouchStart(event: TouchEvent) {
  if (!props.disabled) {
    startOffset = state.offset
    touch.start(event)
  }
}

function onTouchMove(event: TouchEvent) {
  if (props.disabled)
    return

  const { deltaX } = touch
  touch.move(event)

  if (touch.isHorizontal()) {
    lockClick = true
    state.dragging = true

    const isEdge = !opened || deltaX.value * startOffset < 0
    if (isEdge)
      preventDefault(event, props.stopPropagation)

    state.offset = clamp(
      deltaX.value + startOffset,
      -rightWidth.value,
      leftWidth.value,
    )
  }
}

function onTouchEnd() {
  if (state.dragging) {
    state.dragging = false
    toggle(state.offset > 0 ? 'left' : 'right')

    // compatible with desktop scenario
    setTimeout(() => {
      lockClick = false
    }, 0)
  }
}

function onClick(position: SwipeCellPosition = 'outside') {
  if (isInBeforeClosing)
    return

  emit('click', position)

  if (opened && !lockClick) {
    isInBeforeClosing = true
    callInterceptor(props.beforeClose, {
      args: [
        {
          name: props.name,
          position,
        },
      ],
      done: () => {
        isInBeforeClosing = false
        close(position)
      },
      canceled: () => (isInBeforeClosing = false),
      error: () => (isInBeforeClosing = false),
    })
  }
}

function getClickHandler(position: SwipeCellPosition, stop?: boolean) {
  return (event: MouseEvent) => {
    if (stop)
      event.stopPropagation()

    onClick(position)
  }
}

useExpose<SwipeCellExpose>({
  open,
  close,
})

useClickAway(root, () => onClick('outside'), { eventName: 'touchstart' })

// useEventListener will set passive to `false` to eliminate the warning of Chrome
useEventListener('touchmove', onTouchMove, {
  target: root,
})

const wrapperStyle = computed(() => {
  return {
    transform: `translate3d(${state.offset}px, 0, 0)`,
    transitionDuration: state.dragging ? '0s' : '.6s',
  }
})

const slots = useSlots()
</script>

<template>
  <view ref="root" :class="bem()" @click="getClickHandler('cell', lockClick)" @touchstart="onTouchStart" @touchend="onTouchEnd" @touchcancel="onTouchEnd">
    <view :class="bem('wrapper')" :style="wrapperStyle">
      <template v-if="slots.left">
        <view ref="leftRef" :class="bem('left')" @click="getClickHandler('left', true)">
          <slot name="left" />
        </view>
      </template>
      <slot />
      <template v-if="slots.right">
        <view ref="rightRef" :class="bem('right')" @click="getClickHandler('right', true)">
          <slot name="right" />
        </view>
      </template>
    </view>
  </view>
</template>
